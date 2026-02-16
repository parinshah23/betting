# Client-Ready Implementation Plan for Gambling-Web Project

## Context

The user has a gambling/raffle competition platform (frontend + backend) with several critical features broken or incomplete. The goal is to audit the entire codebase and create a comprehensive plan to fix all non-working features and add missing functionality to make the project client-ready for testing.

### Current State
- **Frontend**: Next.js with TypeScript, Tailwind CSS, SWR for data fetching
- **Backend**: Express.js with TypeScript, PostgreSQL database, Stripe payments
- **Integrations**: Stripe (payments), SMTP (emails), Cloudinary (images)
- **Database**: 13 migrations with full schema (users, competitions, tickets, orders, wallet, cart, winners)

### Critical Issues Identified

**Frontend Broken Features:**
1. My Wins - "Claim Prize" button has no onClick handler (my-wins/page.tsx:308)
2. My Wins - "Download Certificate" button has no handler (my-wins/page.tsx:346-351)
3. Wallet - Deposit flow incomplete, no Stripe redirect (wallet/page.tsx:96-118)
4. Ticket History - Missing order data (orderNumber, totalPrice always empty)
5. My Wins - Delivery tracking UI shows but backend provides no data

**Backend Broken Features:**
1. Missing route: DELETE /cart/promo (controller exists, route not registered)
2. Promo codes hardcoded in controller, should use database (cart.controller.ts:134-138)
3. Winner claim functionality not implemented (winner.controller.ts:143)
4. Webhook refund handling incomplete (webhook.controller.ts:166-168)
5. Payment failure doesn't release tickets or send email (webhook.controller.ts:142-143)
6. Wallet not created on user registration (auth.service.ts:43)

**Configuration Issues:**
1. SMTP credentials missing from .env (EMAIL_PROVIDER=smtp but no SMTP_USER/SMTP_PASS)
2. Password reset tokens stored in-memory, lost on restart (auth.service.ts:7-14)
3. No seed data - cannot test without sample competitions/users

---

## Implementation Plan

### PHASE 1: Backend Foundation & Data Infrastructure
**Priority: CRITICAL** | **Blocks all other phases**

#### 1.1 Create Database-Driven Promo Code System
**Files:**
- CREATE: `backend/src/models/promo-code.model.ts`
- MODIFY: `backend/src/controllers/cart.controller.ts` (lines 130-147)
- MODIFY: `backend/src/routes/cart.routes.ts` (add missing DELETE route)

**Implementation:**
```typescript
// New promo-code.model.ts
- findByCode(code: string): Promise<PromoCode | null>
- validatePromoCode(code: string): Promise<{ valid: boolean; discountValue: number }>
- incrementUsage(code: string): Promise<void>
```

Replace hardcoded promo codes with database lookups. Validate: is_active, date range, usage limits, min_order_value.

Add missing route: `router.delete('/promo', cartController.removePromoCode);`

**Acceptance:** Promo codes work from database, DELETE /api/cart/promo returns 200

---

#### 1.2 Create Winner Claim System
**Files:**
- CREATE: `backend/database/migrations/014_create_winner_claims.sql`
- CREATE: `backend/src/models/winner.model.ts`
- MODIFY: `backend/src/controllers/winner.controller.ts` (line 143)
- CREATE: `backend/src/routes/winner.routes.ts` - add POST /:competitionId/claim

**Database Schema:**
```sql
CREATE TABLE winner_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID NOT NULL REFERENCES competitions(id),
  user_id UUID NOT NULL REFERENCES users(id),
  ticket_number INT NOT NULL,
  claimed BOOLEAN DEFAULT FALSE,
  claim_date TIMESTAMP WITH TIME ZONE,
  prize_type VARCHAR(20) CHECK (prize_type IN ('physical', 'cash', 'voucher')),
  delivery_status VARCHAR(20) CHECK (delivery_status IN ('pending', 'processing', 'shipped', 'delivered')),
  tracking_number VARCHAR(100),
  claim_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**New Model Methods:**
```typescript
- findByUser(userId: string): Promise<Winner[]>
- claimPrize(competitionId: string, userId: string, claimData: ClaimInput): Promise<Winner>
- updateDeliveryStatus(winnerId: string, status: string, trackingNumber?: string): Promise<void>
```

**New Endpoint:** `POST /api/winners/:competitionId/claim` - accepts shipping address for physical prizes

**Acceptance:** Winners can claim prizes, delivery status tracked, data persists in database

---

#### 1.3 Auto-Create Wallet on User Registration
**Files:**
- MODIFY: `backend/src/services/auth.service.ts` (lines 43-46)

**Implementation:**
After user creation (line 42), add:
```typescript
// Create wallet for new user
await walletModel.create(user.id);
```

**Acceptance:** All new users automatically get wallet with £0 balance

---

#### 1.4 Persist Password Reset Tokens
**Files:**
- CREATE: `backend/database/migrations/015_create_password_reset_tokens.sql`
- CREATE: `backend/src/models/password-reset.model.ts`
- MODIFY: `backend/src/services/auth.service.ts` (remove in-memory Map at lines 7-14)

**Database Schema:**
```sql
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_password_reset_tokens_hash ON password_reset_tokens(token_hash);
```

**Model Methods:**
```typescript
- createToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void>
- findByTokenHash(tokenHash: string): Promise<{ userId: string } | null>
- markAsUsed(tokenHash: string): Promise<void>
```

**Acceptance:** Password reset tokens survive server restarts, properly expire

---

#### 1.5 Create Comprehensive Seed Data
**Files:**
- CREATE: `backend/database/seeds/promo-codes.seed.ts`
- CREATE: `backend/database/seeds/tickets.seed.ts`
- CREATE: `backend/database/seeds/orders.seed.ts`
- CREATE: `backend/database/seeds/winners.seed.ts`
- CREATE: `backend/database/seeds/run-all.ts`

**Seed Data Requirements:**

**Users:**
- admin@test.com / Admin123! (admin role)
- user1@test.com / User123! (regular user)
- user2@test.com / User123! (regular user)

**Competitions:**
- Live: "Win a Tesla Model 3" (500 tickets, 250 sold, ends in 7 days)
- Ending Soon: "iPhone 16 Pro Max" (200 tickets, 180 sold, ends in 2 hours)
- Completed: "Rolex Submariner" (100 tickets, all sold, ended yesterday, user1 is winner)

**Promo Codes:**
- WELCOME10: 10% off, no min, unlimited uses, active
- SAVE20: 20% off, min £50, 100 max uses, active
- FIRSTBUY: 15% off, min £20, 50 max uses, active
- EXPIRED: 25% off, expired yesterday (test invalid)
- MAXED: 30% off, current_uses = max_uses (test invalid)

**Orders & Tickets:**
- user1: 3 paid orders, 12 tickets across competitions
- user2: 2 paid orders, 8 tickets
- user1: 1 pending order (test payment flow)

**Winners:**
- user1 wins "Rolex Submariner", claimed=false, prize_type='physical'

**Run Script:**
```typescript
// run-all.ts - sequential execution
await seedUsers();
await seedContent();
await seedCompetitions();
await seedPromoCodes();
await seedOrders();
await seedTickets();
await seedWinners();
```

**Acceptance:** `npm run seed` creates complete test environment, can login and test all flows

---

#### 1.6 Environment Validation
**Files:**
- CREATE: `backend/src/config/env-validator.ts`
- MODIFY: `backend/src/index.ts` (call validator at startup)
- MODIFY: `backend/.env` (add missing SMTP credentials)

**Validator:**
```typescript
const requiredVars = [
  'DATABASE_URL', 'JWT_SECRET', 'REFRESH_TOKEN_SECRET',
  'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET',
  'EMAIL_PROVIDER', 'EMAIL_FROM', 'FRONTEND_URL'
];

// If EMAIL_PROVIDER=smtp, also require:
if (process.env.EMAIL_PROVIDER === 'smtp') {
  requiredVars.push('SMTP_HOST', 'SMTP_USER', 'SMTP_PASS');
}

export function validateEnv() {
  const missing = requiredVars.filter(v => !process.env[v]);
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
}
```

**Add to .env:**
```
SMTP_USER=kevinpatil6354@gmail.com
SMTP_PASS=binh bymw bxqm pnsc
```

**Acceptance:** Server refuses to start if critical env vars missing, clear error messages

---

### PHASE 2: Backend API Fixes
**Priority: HIGH** | **Depends on Phase 1**

#### 2.1 Fix Ticket History - Group by Order
**Files:**
- MODIFY: `backend/src/controllers/ticket.controller.ts` (lines 54-89)

**Current Problem:** Returns individual tickets, frontend expects grouped orders

**New Response Format:**
```typescript
{
  orders: [
    {
      orderNumber: "ORD-20240101-ABC123",
      totalPrice: 45.50,
      purchaseDate: "2024-01-01T10:30:00Z",
      tickets: [
        {
          competition: { id, title, slug, image },
          ticketNumber: 12345,
          isWinner: false
        }
      ]
    }
  ]
}
```

**Implementation:**
1. Query orders for user with JOIN on order_items
2. For each order, fetch associated tickets
3. Group tickets under their order
4. Return with order metadata

**Acceptance:** GET /api/tickets/history returns orders with correct totals and ticket grouping

---

#### 2.2 Complete Stripe Wallet Deposit Flow
**Files:**
- MODIFY: `backend/src/controllers/wallet.controller.ts` (createDeposit method)
- MODIFY: `backend/src/controllers/webhook.controller.ts` (handlePaymentSucceeded)

**Current Issue:** Creates PaymentIntent but doesn't return clientSecret

**Fix createDeposit:**
```typescript
const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(amount * 100),
  currency: 'gbp',
  metadata: { userId, type: 'wallet_deposit' }
});

return res.json({
  success: true,
  data: {
    clientSecret: paymentIntent.client_secret,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  }
});
```

**Fix handlePaymentSucceeded:**
```typescript
// Add case for wallet deposits
if (metadata.type === 'wallet_deposit') {
  const wallet = await walletModel.findByUserId(metadata.userId);
  await walletModel.credit(wallet.id, amount / 100, 'Wallet deposit', paymentIntentId);
  await emailService.sendDepositConfirmation(user.email, amount / 100);
}
```

**Acceptance:** Wallet deposit returns clientSecret, webhook credits wallet on success

---

#### 2.3 Complete Webhook Refund Handling
**Files:**
- MODIFY: `backend/src/controllers/webhook.controller.ts` (lines 149-169)

**Implementation:**
```typescript
async function handleChargeRefunded(charge: Stripe.Charge) {
  // 1. Find order by payment intent ID
  const order = await orderModel.findByPaymentIntent(charge.payment_intent);

  // 2. Update order status
  await orderModel.updateStatus(order.id, 'refunded');

  // 3. Find and release tickets
  const tickets = await ticketModel.findByOrder(order.id);
  for (const ticket of tickets) {
    await ticketModel.update(ticket.id, {
      status: 'available',
      user_id: null,
      order_id: null
    });
  }

  // 4. Credit wallet if used
  if (order.wallet_amount > 0) {
    await walletModel.credit(order.user_id, order.wallet_amount, 'Refund', order.id);
  }

  // 5. Send refund email
  await emailService.sendRefundConfirmation(order.user_id, order);
}
```

**Acceptance:** Refunds update order status, return tickets to pool, restore wallet balance

---

#### 2.4 Implement Payment Failure Handling
**Files:**
- MODIFY: `backend/src/controllers/webhook.controller.ts` (lines 138-144)

**Implementation:**
```typescript
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  // 1. Find and update order
  const order = await orderModel.findByPaymentIntent(paymentIntent.id);
  await orderModel.updateStatus(order.id, 'failed');

  // 2. Release reserved tickets
  const tickets = await ticketModel.findByOrder(order.id);
  for (const ticket of tickets) {
    await ticketModel.update(ticket.id, {
      status: 'available',
      user_id: null,
      order_id: null
    });
  }

  // 3. Send failure email with retry link
  await emailService.sendPaymentFailureEmail(order.user_id, order);
}
```

**Acceptance:** Failed payments release tickets, user receives email with retry link

---

#### 2.5 Add Certificate Generation Endpoint
**Files:**
- CREATE: `backend/src/services/certificate.service.ts`
- MODIFY: `backend/src/controllers/winner.controller.ts` (add new endpoint)
- ADD: `backend/src/routes/winner.routes.ts` - GET /:competitionId/certificate

**Install:** `npm install pdfkit @types/pdfkit`

**Implementation:**
```typescript
// certificate.service.ts
import PDFDocument from 'pdfkit';

export async function generateCertificate(
  winner: Winner,
  competition: Competition,
  user: User
): Promise<Buffer> {
  const doc = new PDFDocument();
  const chunks: Buffer[] = [];

  doc.on('data', chunk => chunks.push(chunk));
  doc.on('end', () => {});

  doc.fontSize(30).text('Competition Winner Certificate', { align: 'center' });
  doc.moveDown();
  doc.fontSize(20).text(`${user.first_name} ${user.last_name}`);
  doc.fontSize(16).text(`Prize: ${competition.title}`);
  doc.text(`Value: £${competition.prize_value.toFixed(2)}`);
  doc.text(`Ticket Number: ${winner.ticket_number}`);
  doc.text(`Date Won: ${new Date(winner.won_at).toLocaleDateString()}`);

  doc.end();

  return Buffer.concat(chunks);
}
```

**New Endpoint:** `GET /api/winners/:competitionId/certificate`
- Verify user is winner of competition
- Generate PDF certificate
- Return as downloadable file: `Content-Disposition: attachment; filename="certificate.pdf"`

**Acceptance:** Winners can download PDF certificate with all win details

---

### PHASE 3: Frontend Fixes
**Priority: HIGH** | **Depends on Phase 2**

#### 3.1 Implement Claim Prize Handler
**Files:**
- MODIFY: `frontend/src/app/(dashboard)/my-wins/page.tsx` (line 308)

**Implementation:**
```typescript
const [claimingWin, setClaimingWin] = useState<string | null>(null);
const [claimModal, setClaimModal] = useState<{ open: boolean; win: any }>({ open: false, win: null });
const [claimAddress, setClaimAddress] = useState('');

const handleClaimPrize = async (win: any) => {
  // If physical prize, show address modal
  if (win.prizeType === 'physical') {
    setClaimModal({ open: true, win });
    return;
  }

  // For cash/voucher, claim directly
  await submitClaim(win.competition_id, {});
};

const submitClaim = async (competitionId: string, data: any) => {
  try {
    setClaimingWin(competitionId);
    await api.post(`/winners/${competitionId}/claim`, data);
    mutate(); // Refresh wins
    toast.success('Prize claimed successfully!');
  } catch (error) {
    toast.error('Failed to claim prize');
  } finally {
    setClaimingWin(null);
    setClaimModal({ open: false, win: null });
  }
};

// Update button
<Button
  size="sm"
  variant="primary"
  onClick={() => handleClaimPrize(win)}
  isLoading={claimingWin === win.competition_id}
>
  Claim Prize
</Button>
```

**Acceptance:** Claim button works, shows address modal for physical prizes, updates UI

---

#### 3.2 Implement Download Certificate Handler
**Files:**
- MODIFY: `frontend/src/app/(dashboard)/my-wins/page.tsx` (lines 346-351)

**Implementation:**
```typescript
const handleDownloadCertificate = async (competitionId: string, title: string) => {
  try {
    const token = api.getAccessToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/winners/${competitionId}/certificate`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.ok) throw new Error('Download failed');

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '-')}-certificate.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Certificate downloaded');
  } catch (error) {
    toast.error('Failed to download certificate');
  }
};

// Update button
<button
  onClick={() => handleDownloadCertificate(win.competition_id, win.competition.title)}
  className="inline-flex items-center justify-center p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
>
  <Download className="w-5 h-5" />
</button>
```

**Acceptance:** Certificate downloads as PDF with proper filename

---

#### 3.3 Implement Stripe Wallet Deposit
**Files:**
- MODIFY: `frontend/src/app/(dashboard)/wallet/page.tsx` (lines 96-118)
- MODIFY: `frontend/package.json` (add @stripe/stripe-js)

**Install:** `npm install @stripe/stripe-js`

**Implementation:**
```typescript
import { loadStripe } from '@stripe/stripe-js';

const handleDeposit = async () => {
  const amount = selectedAmount || parseFloat(customAmount);
  if (!amount || amount <= 0) {
    toast.error('Please enter a valid amount');
    return;
  }

  setIsDepositing(true);
  try {
    const response = await api.post<{ clientSecret: string; publishableKey: string }>(
      '/wallet/deposit',
      { amount }
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to create deposit');
    }

    const stripe = await loadStripe(response.data.publishableKey);
    if (!stripe) throw new Error('Stripe not loaded');

    const { error } = await stripe.confirmCardPayment(response.data.clientSecret, {
      payment_method: {
        card: elements.getElement('card')!,
      },
    });

    if (error) {
      toast.error(error.message || 'Payment failed');
    } else {
      toast.success('Deposit successful!');
      mutate(); // Refresh wallet balance
    }
  } catch (error) {
    toast.error('Deposit failed');
  } finally {
    setIsDepositing(false);
  }
};
```

**Alternative Simpler Approach:** Use Stripe Checkout redirect instead of Elements
```typescript
const { error } = await stripe.redirectToCheckout({
  sessionId: response.data.sessionId
});
```

**Acceptance:** Wallet deposit redirects to Stripe, completes payment, updates balance

---

#### 3.4 Fix Ticket History Data Display
**Files:**
- MODIFY: `frontend/src/app/(dashboard)/my-tickets/history/page.tsx`

**Update Interface:**
```typescript
interface TicketHistoryOrder {
  orderNumber: string;
  totalPrice: number;
  purchaseDate: string;
  tickets: Array<{
    competition: {
      id: string;
      title: string;
      slug: string;
      image: string;
    };
    ticketNumber: number;
    isWinner: boolean;
  }>;
}
```

**Update Display:**
```tsx
{orders.map(order => (
  <div key={order.orderNumber}>
    <div className="flex justify-between">
      <span>Order #{order.orderNumber}</span>
      <span>£{order.totalPrice.toFixed(2)}</span>
    </div>
    <div className="text-sm text-gray-500">
      {new Date(order.purchaseDate).toLocaleDateString()}
    </div>
    <div className="mt-2">
      {order.tickets.map(ticket => (
        <TicketCard key={ticket.ticketNumber} ticket={ticket} />
      ))}
    </div>
  </div>
))}
```

**Acceptance:** Order numbers, totals, and dates display correctly

---

#### 3.5 Add TypeScript Interfaces
**Files:**
- MODIFY: `frontend/src/types/index.ts`

**Add Interfaces:**
```typescript
export interface Winner {
  id: string;
  competition_id: string;
  user_id: string;
  ticket_number: number;
  prize_value: number;
  won_at: string;
  claimed: boolean;
  claim_date?: string;
  prize_type?: 'physical' | 'cash' | 'voucher';
  delivery_status?: 'pending' | 'processing' | 'shipped' | 'delivered';
  tracking_number?: string;
  claim_address?: string;
  competition: {
    id: string;
    title: string;
    slug: string;
    prize_value: number;
  };
}

export interface PromoCode {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value: number;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
  valid_from?: string;
  valid_until?: string;
}
```

**Acceptance:** No TypeScript errors, proper type safety

---

### PHASE 4: Data Consistency & Polish
**Priority: MEDIUM** | **Depends on Phase 3**

#### 4.1 Standardize Response Format (camelCase)
**Files:**
- CREATE: `backend/src/utils/case-converter.ts`
- MODIFY: `backend/src/utils/response.ts`

**Implementation:**
```typescript
// case-converter.ts
export function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => snakeToCamel(v));
  }
  if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = snakeToCamel(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

// response.ts - update sendSuccess
export function sendSuccess(res: Response, payload: any) {
  const data = payload.data || payload;
  return res.json({
    success: true,
    data: snakeToCamel(data),
    meta: payload.meta ? snakeToCamel(payload.meta) : undefined
  });
}
```

**Acceptance:** All API responses use camelCase, frontend never receives snake_case

---

#### 4.2 Add Proper Error Handling
**Files:**
- MODIFY: `backend/src/middleware/error-handler.ts`

**Enhanced Error Format:**
```typescript
{
  success: false,
  error: {
    code: 'INVALID_PROMO_CODE',
    message: 'The promo code has expired',
    field: 'promo_code', // optional
    details: { /* validation errors */ } // optional
  }
}
```

**HTTP Status Codes:**
- 400: Invalid input (validation failed)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (valid auth, insufficient permissions)
- 404: Not found
- 409: Conflict (e.g., email already exists)
- 422: Business logic validation failed
- 500: Internal server error (log to console/Sentry)

**Acceptance:** Consistent error format, user-friendly messages

---

#### 4.3 Add Loading/Empty States to Frontend
**Files:**
- MODIFY: `frontend/src/app/(dashboard)/my-wins/page.tsx`
- MODIFY: `frontend/src/app/(dashboard)/wallet/page.tsx`
- MODIFY: `frontend/src/app/(dashboard)/my-tickets/history/page.tsx`

**Pattern:**
```tsx
{isLoading && <Spinner />}
{error && <ErrorMessage message={error} onRetry={mutate} />}
{!isLoading && !error && data.length === 0 && (
  <EmptyState
    icon={TrophyIcon}
    title="No wins yet"
    message="Enter competitions to win amazing prizes"
  />
)}
{data.map(item => <ItemCard />)}
```

**Acceptance:** All pages show loading, error, and empty states appropriately

---

### PHASE 5: Testing & Documentation
**Priority: MEDIUM** | **Depends on Phase 4**

#### 5.1 Create Client Testing Guide
**Files:**
- CREATE: `docs/CLIENT_TESTING_GUIDE.md`

**Content Outline:**
```markdown
# Client Testing Guide

## Setup
1. Run: npm run seed
2. Login credentials
3. Test Stripe card: 4242 4242 4242 4242

## Test Flows

### Flow 1: Browse & Purchase
1. Visit /competitions
2. Select competition
3. Add tickets to cart
4. Apply promo code: WELCOME10
5. Checkout with Stripe
6. Verify tickets in My Tickets

### Flow 2: Wallet Deposit & Purchase
1. Deposit £50 to wallet
2. Purchase with wallet balance
3. Verify balance decreased

### Flow 3: Claim Win
1. Login as user1@test.com
2. Visit /my-wins
3. Claim prize
4. Download certificate

### Flow 4: Admin Draw
1. Login as admin
2. Execute draw for completed competition
3. Verify winner selected

## Expected Results
- All emails should be received
- All balances should be accurate
- All status updates should persist
```

**Acceptance:** Testing guide covers all major flows with step-by-step instructions

---

#### 5.2 Add System Health Check
**Files:**
- CREATE: `backend/src/controllers/health.controller.ts`
- CREATE: `backend/src/routes/health.routes.ts`

**Endpoints:**
```typescript
// GET /api/health
{
  status: 'healthy',
  database: 'connected',
  stripe: 'configured',
  email: 'configured',
  version: '1.0.0',
  uptime: 123456
}

// GET /api/health/detailed (admin only)
{
  ...above,
  stats: {
    competitions: { total: 10, live: 3, ended: 2 },
    users: { total: 150, active_today: 12 },
    orders_today: 5,
    revenue_today: 523.50
  }
}
```

**Acceptance:** Health endpoints return system status, useful for monitoring

---

## Critical Files Reference

### New Files to Create (23 files)
1. `backend/src/models/promo-code.model.ts` - Promo code database operations
2. `backend/src/models/winner.model.ts` - Winner claims and delivery tracking
3. `backend/src/models/password-reset.model.ts` - Password reset token persistence
4. `backend/database/migrations/014_create_winner_claims.sql` - Winner claims table
5. `backend/database/migrations/015_create_password_reset_tokens.sql` - Password reset table
6. `backend/database/seeds/promo-codes.seed.ts` - Test promo codes
7. `backend/database/seeds/tickets.seed.ts` - Test tickets
8. `backend/database/seeds/orders.seed.ts` - Test orders
9. `backend/database/seeds/winners.seed.ts` - Test winners
10. `backend/database/seeds/run-all.ts` - Orchestrate all seeds
11. `backend/src/config/env-validator.ts` - Environment validation
12. `backend/src/services/certificate.service.ts` - PDF certificate generation
13. `backend/src/utils/case-converter.ts` - Snake/camel case conversion
14. `backend/src/controllers/health.controller.ts` - Health check endpoints
15. `backend/src/routes/health.routes.ts` - Health routes
16. `docs/CLIENT_TESTING_GUIDE.md` - Testing documentation

### Files to Modify (18 files)
1. `backend/src/controllers/cart.controller.ts` - Use promo code model, not hardcoded
2. `backend/src/routes/cart.routes.ts` - Add DELETE /promo route
3. `backend/src/controllers/winner.controller.ts` - Implement claim, add certificate endpoint
4. `backend/src/services/auth.service.ts` - Create wallet on registration, remove in-memory tokens
5. `backend/src/controllers/ticket.controller.ts` - Group tickets by order
6. `backend/src/controllers/wallet.controller.ts` - Return clientSecret for deposits
7. `backend/src/controllers/webhook.controller.ts` - Complete refund and payment failure handling
8. `backend/src/utils/response.ts` - Add camelCase conversion
9. `backend/src/middleware/error-handler.ts` - Consistent error format
10. `backend/src/index.ts` - Add env validation
11. `backend/.env` - Add SMTP credentials
12. `frontend/src/app/(dashboard)/my-wins/page.tsx` - Claim and certificate handlers
13. `frontend/src/app/(dashboard)/wallet/page.tsx` - Stripe deposit flow
14. `frontend/src/app/(dashboard)/my-tickets/history/page.tsx` - Show order data
15. `frontend/src/types/index.ts` - Add Winner and PromoCode interfaces
16. `frontend/package.json` - Add @stripe/stripe-js
17. `backend/package.json` - Add pdfkit, @types/pdfkit

---

## Verification Checklist

### Core User Flows
- [ ] User can register and login
- [ ] User can browse competitions
- [ ] User can add tickets to cart
- [ ] User can apply valid promo code (gets discount)
- [ ] User can checkout with Stripe test card
- [ ] User receives order confirmation email
- [ ] User can view tickets in My Tickets
- [ ] User can deposit to wallet via Stripe
- [ ] User can purchase with wallet balance
- [ ] User can view order history with correct totals
- [ ] Winner can claim prize
- [ ] Winner can download certificate PDF
- [ ] Winner sees delivery tracking info
- [ ] Admin can execute draw

### Error Handling
- [ ] Invalid promo code shows error
- [ ] Expired promo code shows error
- [ ] Insufficient wallet balance shows error
- [ ] Payment failure releases reserved tickets
- [ ] Refund returns tickets to available pool
- [ ] All errors show user-friendly messages

### Data Accuracy
- [ ] Ticket history shows order numbers
- [ ] Ticket history shows total prices
- [ ] My Wins shows claimed status
- [ ] My Wins shows delivery status
- [ ] Wallet balance is accurate
- [ ] Competition ticket counts accurate

### Configuration
- [ ] All env vars set and validated
- [ ] SMTP sends emails successfully
- [ ] Stripe test mode works
- [ ] Database migrations applied
- [ ] Seed data loads without errors

---

## Implementation Sequence

### Week 1: Backend Foundation
- **Day 1-2:** Phase 1.1-1.3 (Promo codes, winner claims, wallet creation)
- **Day 3-4:** Phase 1.4-1.5 (Password reset, seed data)
- **Day 5:** Phase 1.6 (Env validation), test Phase 1

### Week 2: Backend APIs
- **Day 1-2:** Phase 2.1-2.3 (Ticket history, wallet deposit, refunds)
- **Day 3-4:** Phase 2.4-2.5 (Payment failure, certificates)
- **Day 5:** Test Phase 2

### Week 3: Frontend
- **Day 1-2:** Phase 3.1-3.3 (Claim, certificate, wallet deposit)
- **Day 3-4:** Phase 3.4-3.5 (Ticket history, types)
- **Day 5:** Test Phase 3

### Week 4: Polish & Testing
- **Day 1-2:** Phase 4 (Consistency, error handling)
- **Day 3-4:** Phase 5 (Testing guide, health checks)
- **Day 5:** Full end-to-end client testing

**Total Estimated Time:** 3-4 weeks for one developer, 2 weeks with parallel backend/frontend work

---

## Risk Assessment

### High Risk (Require Careful Testing)
1. **Payment webhooks** - Must handle all Stripe events correctly
2. **Ticket concurrency** - Multiple users buying last tickets simultaneously
3. **Wallet balance accuracy** - Race conditions in concurrent transactions
4. **Refund logic** - Must properly return tickets and update wallet

### Medium Risk
1. **Email delivery** - May end up in spam folders
2. **Promo code edge cases** - Timezone issues with expiry
3. **PDF generation** - Memory usage for large batches

### Low Risk
1. **UI polish** - Loading states, error messages
2. **TypeScript types** - Won't affect runtime
3. **Health checks** - Nice to have, not critical

---

## Success Criteria

The project is client-ready when:

1. ✅ All core user flows work end-to-end without errors
2. ✅ Seed data creates realistic test environment
3. ✅ Client can follow testing guide independently
4. ✅ All emails send successfully
5. ✅ Payment processing works in Stripe test mode
6. ✅ Error messages are clear and actionable
7. ✅ No console errors or warnings in browser/server
8. ✅ Data displays correctly (no missing fields, proper formatting)
9. ✅ Admin can manage competitions and execute draws
10. ✅ System health check returns positive status
