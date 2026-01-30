# Human Developer Task List

> **Purpose:** This document tracks all tasks requiring human developer action for the Raffle Competition Platform.
> **Auto-display:** Run `npm run tasks` or `./scripts/show-tasks.sh` to see pending tasks in terminal.

---

## Quick Status

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| Phase 0 | Planning & Documentation | COMPLETE | 100% |
| Phase 1 | Database & Schemas | NOT STARTED | 0% |
| Phase 2 | Backend API & Auth | NOT STARTED | 0% |
| Phase 3 | Frontend Skeleton | NOT STARTED | 0% |
| Phase 4 | Page Implementation | NOT STARTED | 0% |
| Phase 5 | Testing & Polish | NOT STARTED | 0% |

---

## Pre-Implementation Setup (HUMAN REQUIRED)

These tasks must be completed before starting any development:

### Environment Setup
- [ ] **TASK-001:** Install PostgreSQL 12+ locally
- [ ] **TASK-002:** Create PostgreSQL database: `raffle_db`
- [ ] **TASK-003:** Create database user: `raffle_user` with password
- [ ] **TASK-004:** Install Node.js 18+ (LTS recommended)
- [ ] **TASK-005:** Install pnpm or npm globally

### Third-Party Accounts
- [ ] **TASK-006:** Create Stripe account and get test API keys
  - Dashboard: https://dashboard.stripe.com
  - Copy `STRIPE_PUBLIC_KEY` and `STRIPE_SECRET_KEY`
- [ ] **TASK-007:** Set up email service (SendGrid or Resend)
  - Get `EMAIL_API_KEY`
- [ ] **TASK-008:** (Optional) Set up cloud storage (AWS S3 / Cloudinary)
  - Get `STORAGE_ACCESS_KEY` and `STORAGE_SECRET_KEY`

### Environment Files
- [ ] **TASK-009:** Create `backend/.env` from `backend/.env.example`
  - Fill in all database credentials
  - Add JWT secrets (generate secure random strings)
  - Add Stripe keys
  - Add email API key
- [ ] **TASK-010:** Create `frontend/.env.local` from `frontend/.env.example`
  - Add API URL
  - Add Stripe public key

---

## Phase 1: Database & Schemas

**Role:** SQL Architect
**Reference:** `MASTER_DEVELOPMENT_PLAN.md` Section 6

### Migration Files to Create
- [ ] **TASK-101:** Create `backend/database/migrations/001_create_users.sql`
- [ ] **TASK-102:** Create `backend/database/migrations/002_create_competitions.sql`
- [ ] **TASK-103:** Create `backend/database/migrations/003_create_competition_images.sql`
- [ ] **TASK-104:** Create `backend/database/migrations/004_create_tickets.sql`
- [ ] **TASK-105:** Create `backend/database/migrations/005_create_orders.sql`
- [ ] **TASK-106:** Create `backend/database/migrations/006_create_order_items.sql`
- [ ] **TASK-107:** Create `backend/database/migrations/007_create_wallets.sql`
- [ ] **TASK-108:** Create `backend/database/migrations/008_create_wallet_transactions.sql`
- [ ] **TASK-109:** Create `backend/database/migrations/009_create_promo_codes.sql`
- [ ] **TASK-110:** Create `backend/database/migrations/010_create_content_pages.sql`
- [ ] **TASK-111:** Create `backend/database/migrations/011_create_winners_gallery.sql`
- [ ] **TASK-112:** Create `backend/database/migrations/012_create_refresh_tokens.sql`

### Seed Data
- [ ] **TASK-113:** Create `backend/database/seeds/users.seed.ts` (admin + test users)
- [ ] **TASK-114:** Create `backend/database/seeds/competitions.seed.ts` (sample competitions)
- [ ] **TASK-115:** Create `backend/database/seeds/content.seed.ts` (FAQ, Terms, Privacy)

### Validation
- [ ] **TASK-116:** Run all migrations successfully
- [ ] **TASK-117:** Verify all 12 tables exist with `\dt` in psql
- [ ] **TASK-118:** Run seed scripts to populate test data

---

## Phase 2: Backend API & Auth

**Role:** Backend API Developer
**Reference:** `MASTER_DEVELOPMENT_PLAN.md` Section 7

### Core Setup
- [ ] **TASK-201:** Install all npm dependencies (`cd backend && npm install`)
- [ ] **TASK-202:** Verify TypeScript compiles without errors
- [ ] **TASK-203:** Set up database connection pool (`src/config/database.ts`)

### Authentication System
- [ ] **TASK-210:** Implement `POST /api/auth/register`
- [ ] **TASK-211:** Implement `POST /api/auth/login`
- [ ] **TASK-212:** Implement `POST /api/auth/logout`
- [ ] **TASK-213:** Implement `POST /api/auth/refresh`
- [ ] **TASK-214:** Implement `POST /api/auth/forgot-password`
- [ ] **TASK-215:** Implement `POST /api/auth/reset-password`
- [ ] **TASK-216:** Implement `GET /api/auth/me`

### User Routes
- [ ] **TASK-220:** Implement `GET /api/users/profile`
- [ ] **TASK-221:** Implement `PUT /api/users/profile`
- [ ] **TASK-222:** Implement `PUT /api/users/password`

### Competition Routes
- [ ] **TASK-230:** Implement `GET /api/competitions` (list with pagination)
- [ ] **TASK-231:** Implement `GET /api/competitions/featured`
- [ ] **TASK-232:** Implement `GET /api/competitions/:slug`
- [ ] **TASK-233:** Implement `GET /api/competitions/:id/tickets`

### Ticket Routes
- [ ] **TASK-240:** Implement `POST /api/tickets/verify-answer`
- [ ] **TASK-241:** Implement `GET /api/tickets/my-tickets`
- [ ] **TASK-242:** Implement `GET /api/tickets/history`
- [ ] **TASK-243:** Implement `GET /api/tickets/instant-wins`

### Cart & Order Routes
- [ ] **TASK-250:** Implement `GET /api/cart`
- [ ] **TASK-251:** Implement `POST /api/cart/add`
- [ ] **TASK-252:** Implement `PUT /api/cart/update`
- [ ] **TASK-253:** Implement `DELETE /api/cart/:itemId`
- [ ] **TASK-254:** Implement `POST /api/cart/apply-promo`
- [ ] **TASK-255:** Implement `POST /api/orders/create`
- [ ] **TASK-256:** Implement `POST /api/orders/payment-intent` (Stripe)
- [ ] **TASK-257:** Implement `POST /api/orders/confirm`
- [ ] **TASK-258:** Implement `GET /api/orders`
- [ ] **TASK-259:** Implement `GET /api/orders/:id`

### Wallet Routes
- [ ] **TASK-260:** Implement `GET /api/wallet`
- [ ] **TASK-261:** Implement `GET /api/wallet/transactions`
- [ ] **TASK-262:** Implement `POST /api/wallet/deposit`

### Winners Routes
- [ ] **TASK-270:** Implement `GET /api/winners`
- [ ] **TASK-271:** Implement `GET /api/winners/recent`

### Admin Routes - Competitions
- [ ] **TASK-280:** Implement `GET /api/admin/competitions`
- [ ] **TASK-281:** Implement `POST /api/admin/competitions`
- [ ] **TASK-282:** Implement `GET /api/admin/competitions/:id`
- [ ] **TASK-283:** Implement `PUT /api/admin/competitions/:id`
- [ ] **TASK-284:** Implement `DELETE /api/admin/competitions/:id`
- [ ] **TASK-285:** Implement `POST /api/admin/competitions/:id/duplicate`
- [ ] **TASK-286:** Implement `POST /api/admin/competitions/:id/instant-wins`
- [ ] **TASK-287:** Implement `GET /api/admin/competitions/:id/entries` (CSV)
- [ ] **TASK-288:** Implement `POST /api/admin/competitions/:id/draw`

### Admin Routes - Users
- [ ] **TASK-290:** Implement `GET /api/admin/users`
- [ ] **TASK-291:** Implement `GET /api/admin/users/:id`
- [ ] **TASK-292:** Implement `PUT /api/admin/users/:id`
- [ ] **TASK-293:** Implement `POST /api/admin/users/:id/ban`
- [ ] **TASK-294:** Implement `POST /api/admin/users/:id/wallet`

### Admin Routes - Orders
- [ ] **TASK-295:** Implement `GET /api/admin/orders`
- [ ] **TASK-296:** Implement `GET /api/admin/orders/:id`
- [ ] **TASK-297:** Implement `POST /api/admin/orders/:id/refund`

### Admin Routes - Content
- [ ] **TASK-298:** Implement `GET /api/admin/content`
- [ ] **TASK-299:** Implement `PUT /api/admin/content/:slug`
- [ ] **TASK-2100:** Implement `POST /api/admin/winners-gallery`

### Integrations
- [ ] **TASK-2110:** Set up Stripe payment processing
- [ ] **TASK-2111:** Set up Stripe webhook handler
- [ ] **TASK-2112:** Set up email service (transactional emails)
- [ ] **TASK-2113:** Implement email templates (order confirmation, password reset, win notification)

### Validation
- [ ] **TASK-2120:** Test all auth endpoints with Postman/Insomnia
- [ ] **TASK-2121:** Test all user endpoints
- [ ] **TASK-2122:** Test payment flow end-to-end
- [ ] **TASK-2123:** Verify rate limiting works correctly

---

## Phase 3: Frontend Skeleton

**Role:** Frontend Architect
**Reference:** `MASTER_DEVELOPMENT_PLAN.md` Section 2

### Core Setup
- [ ] **TASK-301:** Install all npm dependencies (`cd frontend && npm install`)
- [ ] **TASK-302:** Configure Tailwind with custom colors from design system
- [ ] **TASK-303:** Add Inter and Poppins fonts

### UI Component Library
Create these in `frontend/src/components/ui/`:
- [ ] **TASK-310:** Create `Button.tsx` (variants: primary, secondary, outline, ghost)
- [ ] **TASK-311:** Create `Input.tsx` (with error states, icons)
- [ ] **TASK-312:** Create `Card.tsx` (with header, body, footer slots)
- [ ] **TASK-313:** Create `Modal.tsx` (with backdrop, animations)
- [ ] **TASK-314:** Create `Badge.tsx` (variants: success, warning, error, info)
- [ ] **TASK-315:** Create `Spinner.tsx` (loading indicator)
- [ ] **TASK-316:** Create `ProgressBar.tsx` (for ticket progress)
- [ ] **TASK-317:** Create `CountdownTimer.tsx` (for competition end dates)

### Layout Components
Create these in `frontend/src/components/layout/`:
- [ ] **TASK-320:** Create `Header.tsx` (logo, nav, cart icon, auth buttons)
- [ ] **TASK-321:** Create `Footer.tsx` (links, social, newsletter)
- [ ] **TASK-322:** Create `Sidebar.tsx` (for user dashboard)
- [ ] **TASK-323:** Create `MobileNav.tsx` (hamburger menu)
- [ ] **TASK-324:** Create `AdminNav.tsx` (admin sidebar)

### Context Providers
Create these in `frontend/src/context/`:
- [ ] **TASK-330:** Create `AuthContext.tsx` (user state, login/logout)
- [ ] **TASK-331:** Create `CartContext.tsx` (cart state, add/remove)
- [ ] **TASK-332:** Create `ToastContext.tsx` (notifications)

### Custom Hooks
Create these in `frontend/src/hooks/`:
- [ ] **TASK-340:** Create `useAuth.ts`
- [ ] **TASK-341:** Create `useCart.ts`
- [ ] **TASK-342:** Create `useWallet.ts`
- [ ] **TASK-343:** Create `useCompetitions.ts`

### Route Protection
- [ ] **TASK-350:** Create `frontend/middleware.ts` (route protection)
- [ ] **TASK-351:** Implement redirect logic for protected routes

### Validation
- [ ] **TASK-360:** All routes navigable (even with placeholder content)
- [ ] **TASK-361:** Auth flow works (login redirects to dashboard)
- [ ] **TASK-362:** Responsive layouts on mobile/tablet/desktop

---

## Phase 4: Page Implementation

**Role:** Page Builder
**Reference:** `docs/pages/` specifications

### High Priority Pages
- [ ] **TASK-401:** Home Page (`docs/pages/01-home.md`)
- [ ] **TASK-402:** Competition Listing (`docs/pages/02-competitions.md`)
- [ ] **TASK-403:** Single Competition (`docs/pages/03-competition-single.md`)
- [ ] **TASK-404:** Cart Page (`docs/pages/04-cart.md`)
- [ ] **TASK-405:** Checkout Page (`docs/pages/05-checkout.md`)
- [ ] **TASK-406:** Login Page (`docs/pages/06-login.md`)
- [ ] **TASK-407:** Register Page (`docs/pages/07-register.md`)
- [ ] **TASK-408:** User Dashboard (`docs/pages/09-user-dashboard.md`)
- [ ] **TASK-409:** Wallet Page (`docs/pages/11-wallet.md`)
- [ ] **TASK-410:** My Tickets Page (`docs/pages/12-my-tickets.md`)
- [ ] **TASK-411:** Admin Dashboard (`docs/pages/15-admin-dashboard.md`)
- [ ] **TASK-412:** Admin Competitions (`docs/pages/16-admin-competitions.md`)
- [ ] **TASK-413:** Admin Draws (`docs/pages/19-admin-draws.md`)

### Medium Priority Pages
- [ ] **TASK-420:** Forgot Password (`docs/pages/08-forgot-password.md`)
- [ ] **TASK-421:** Profile Page (`docs/pages/10-profile.md`)
- [ ] **TASK-422:** My Wins Page (`docs/pages/13-my-wins.md`)
- [ ] **TASK-423:** Winners Page (`docs/pages/14-winners.md`)
- [ ] **TASK-424:** Admin Users (`docs/pages/17-admin-users.md`)
- [ ] **TASK-425:** Admin Orders (`docs/pages/18-admin-orders.md`)

### Low Priority Pages
- [ ] **TASK-430:** Admin Content (`docs/pages/20-admin-content.md`)
- [ ] **TASK-431:** FAQ Page (`docs/pages/21-static-pages.md`)
- [ ] **TASK-432:** Terms & Conditions (`docs/pages/21-static-pages.md`)
- [ ] **TASK-433:** Privacy Policy (`docs/pages/21-static-pages.md`)

---

## Phase 5: Testing & Polish

**Role:** Integration Tester

### Functional Testing
- [ ] **TASK-501:** Test complete user registration flow
- [ ] **TASK-502:** Test complete login/logout flow
- [ ] **TASK-503:** Test password reset flow
- [ ] **TASK-504:** Test competition browsing and filtering
- [ ] **TASK-505:** Test ticket purchase flow (skill question -> cart -> checkout)
- [ ] **TASK-506:** Test instant win notifications
- [ ] **TASK-507:** Test wallet deposit and usage
- [ ] **TASK-508:** Test promo code application
- [ ] **TASK-509:** Test admin competition creation
- [ ] **TASK-510:** Test admin draw execution
- [ ] **TASK-511:** Test winner notification

### Cross-Browser Testing
- [ ] **TASK-520:** Test on Chrome
- [ ] **TASK-521:** Test on Firefox
- [ ] **TASK-522:** Test on Safari
- [ ] **TASK-523:** Test on Edge

### Mobile Testing
- [ ] **TASK-530:** Test on iOS Safari
- [ ] **TASK-531:** Test on Android Chrome
- [ ] **TASK-532:** Verify all touch interactions work

### Performance
- [ ] **TASK-540:** Run Lighthouse audit (target: 90+ score)
- [ ] **TASK-541:** Optimize images (WebP, lazy loading)
- [ ] **TASK-542:** Verify no layout shifts (CLS)

### Security
- [ ] **TASK-550:** Test for XSS vulnerabilities
- [ ] **TASK-551:** Test for CSRF protection
- [ ] **TASK-552:** Verify rate limiting works
- [ ] **TASK-553:** Test JWT expiration and refresh

---

## Deployment Tasks (HUMAN REQUIRED)

### Production Setup
- [ ] **TASK-601:** Set up production PostgreSQL (AWS RDS / Supabase / Railway)
- [ ] **TASK-602:** Set up production hosting for backend (Railway / Render / AWS)
- [ ] **TASK-603:** Set up production hosting for frontend (Vercel)
- [ ] **TASK-604:** Configure custom domain
- [ ] **TASK-605:** Set up SSL certificates
- [ ] **TASK-606:** Configure production environment variables
- [ ] **TASK-607:** Set up Stripe live keys
- [ ] **TASK-608:** Set up production email service
- [ ] **TASK-609:** Configure CDN for static assets
- [ ] **TASK-610:** Set up monitoring (Sentry / LogRocket)
- [ ] **TASK-611:** Set up backup strategy for database

---

## How to Mark Tasks Complete

When you complete a task, update this file:

```markdown
- [x] **TASK-XXX:** Description (DONE - 2026-01-29)
```

Also update the `.ai/context.md` file to keep the project brain in sync.

---

## Commands

```bash
# Show pending tasks in terminal
npm run tasks

# Or use the script directly
./scripts/show-tasks.sh

# Filter by phase
./scripts/show-tasks.sh --phase=1

# Filter by status
./scripts/show-tasks.sh --pending
```
