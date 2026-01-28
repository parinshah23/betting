# Master Development Plan - Raffle Competition Platform

> **Version:** 1.0.0
> **Created:** 2026-01-28
> **Tech Stack:** Next.js (App Router) + Node.js API + PostgreSQL + Tailwind CSS

---

## Table of Contents

1. [High-Level Architecture](#1-high-level-architecture)
2. [Folder Structure](#2-folder-structure)
3. [Security Layer](#3-security-layer)
4. [Third-Party Integrations](#4-third-party-integrations)
5. [Execution Order](#5-execution-order)
6. [Database Schemas](#6-database-schemas)
7. [API Endpoint Registry](#7-api-endpoint-registry)
8. [Page Specifications Index](#8-page-specifications-index)
9. [Agent Roles & Workflows](#9-agent-roles--workflows)

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                    │
│                     Next.js 14+ (App Router)                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Public    │  │    User     │  │   Admin     │  │    Auth     │    │
│  │   Pages     │  │  Dashboard  │  │   Panel     │  │   Pages     │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
│                              │                                           │
│                    ┌─────────┴─────────┐                                │
│                    │  API Client Layer │                                │
│                    │   (fetch + SWR)   │                                │
│                    └─────────┬─────────┘                                │
└──────────────────────────────┼──────────────────────────────────────────┘
                               │ HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              BACKEND                                     │
│                        Node.js + Express                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      Middleware Stack                            │   │
│  │  [CORS] → [Rate Limit] → [Auth JWT] → [RBAC] → [Validation]     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │    Auth     │  │ Competition │  │   Ticket    │  │   Wallet    │    │
│  │  Controller │  │ Controller  │  │ Controller  │  │ Controller  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
│                              │                                           │
│                    ┌─────────┴─────────┐                                │
│                    │   Service Layer   │                                │
│                    └─────────┬─────────┘                                │
└──────────────────────────────┼──────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            DATABASE                                      │
│                           PostgreSQL                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  users   │  │ competi- │  │ tickets  │  │  wallet  │  │  orders  │  │
│  │          │  │  tions   │  │          │  │          │  │          │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Folder Structure

### Frontend (Next.js App Router)

```
frontend/
├── .env.local                    # Environment variables
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS config
├── package.json
├── tsconfig.json
│
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   └── og-image.jpg
│   └── favicon.ico
│
├── src/
│   ├── app/                      # App Router pages
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page (/)
│   │   ├── globals.css           # Global styles
│   │   │
│   │   ├── (auth)/               # Auth route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx        # Auth layout (centered, no nav)
│   │   │
│   │   ├── (public)/             # Public pages group
│   │   │   ├── competitions/
│   │   │   │   ├── page.tsx      # Competition listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx  # Single competition
│   │   │   ├── winners/
│   │   │   │   └── page.tsx
│   │   │   ├── faq/
│   │   │   │   └── page.tsx
│   │   │   ├── terms/
│   │   │   │   └── page.tsx
│   │   │   └── privacy/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/          # User dashboard group
│   │   │   ├── layout.tsx        # Dashboard layout with sidebar
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx      # User dashboard home
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── wallet/
│   │   │   │   └── page.tsx
│   │   │   ├── tickets/
│   │   │   │   ├── page.tsx      # Active tickets
│   │   │   │   └── history/
│   │   │   │       └── page.tsx  # Ticket history
│   │   │   └── my-wins/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (admin)/              # Admin panel group
│   │   │   ├── layout.tsx        # Admin layout
│   │   │   ├── admin/
│   │   │   │   └── page.tsx      # Admin dashboard
│   │   │   ├── admin/competitions/
│   │   │   │   ├── page.tsx      # List all competitions
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # Edit competition
│   │   │   ├── admin/users/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── admin/orders/
│   │   │   │   └── page.tsx
│   │   │   ├── admin/draws/
│   │   │   │   └── page.tsx
│   │   │   └── admin/content/
│   │   │       └── page.tsx
│   │   │
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   │
│   │   └── api/                  # Next.js API routes (minimal - proxy only)
│   │       └── auth/
│   │           └── [...nextauth]/
│   │               └── route.ts  # Optional: NextAuth.js
│   │
│   ├── components/               # Reusable components
│   │   ├── ui/                   # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── CountdownTimer.tsx
│   │   │   └── index.ts          # Barrel export
│   │   │
│   │   ├── layout/               # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── AdminNav.tsx
│   │   │
│   │   ├── competition/          # Competition-specific
│   │   │   ├── CompetitionCard.tsx
│   │   │   ├── CompetitionGrid.tsx
│   │   │   ├── HeroSlider.tsx
│   │   │   ├── TicketSelector.tsx
│   │   │   ├── SkillQuestion.tsx
│   │   │   └── InstantWinNotification.tsx
│   │   │
│   │   ├── dashboard/            # Dashboard-specific
│   │   │   ├── StatsWidget.tsx
│   │   │   ├── ActiveTicketsList.tsx
│   │   │   ├── WalletBalance.tsx
│   │   │   └── RecentActivity.tsx
│   │   │
│   │   └── admin/                # Admin-specific
│   │       ├── DataTable.tsx
│   │       ├── CompetitionForm.tsx
│   │       ├── DrawManager.tsx
│   │       └── UserManager.tsx
│   │
│   ├── lib/                      # Utilities & configurations
│   │   ├── api.ts                # API client (fetch wrapper)
│   │   ├── auth.ts               # Auth utilities
│   │   ├── utils.ts              # Helper functions
│   │   ├── constants.ts          # App constants
│   │   └── validations.ts        # Zod schemas for forms
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useWallet.ts
│   │   └── useCompetitions.ts
│   │
│   ├── context/                  # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── ToastContext.tsx
│   │
│   ├── types/                    # TypeScript types
│   │   ├── user.ts
│   │   ├── competition.ts
│   │   ├── ticket.ts
│   │   ├── order.ts
│   │   └── api.ts
│   │
│   └── styles/                   # Additional styles if needed
│       └── components.css
│
└── middleware.ts                 # Next.js middleware (route protection)
```

### Backend (Node.js API)

```
backend/
├── .env                          # Environment variables
├── package.json
├── tsconfig.json
├── nodemon.json                  # Dev server config
│
├── src/
│   ├── index.ts                  # Entry point
│   ├── app.ts                    # Express app setup
│   │
│   ├── config/                   # Configuration
│   │   ├── database.ts           # PostgreSQL connection
│   │   ├── cors.ts               # CORS settings
│   │   ├── env.ts                # Environment validation
│   │   └── email.ts              # Email service config
│   │
│   ├── middleware/               # Express middleware
│   │   ├── auth.ts               # JWT verification
│   │   ├── rbac.ts               # Role-based access control
│   │   ├── rateLimit.ts          # Rate limiting
│   │   ├── validate.ts           # Request validation
│   │   ├── errorHandler.ts       # Global error handler
│   │   └── logger.ts             # Request logging
│   │
│   ├── routes/                   # API routes
│   │   ├── index.ts              # Route aggregator
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── competition.routes.ts
│   │   ├── ticket.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── order.routes.ts
│   │   ├── wallet.routes.ts
│   │   ├── admin.routes.ts
│   │   └── content.routes.ts
│   │
│   ├── controllers/              # Route handlers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── competition.controller.ts
│   │   ├── ticket.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── order.controller.ts
│   │   ├── wallet.controller.ts
│   │   ├── admin.controller.ts
│   │   └── content.controller.ts
│   │
│   ├── services/                 # Business logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── competition.service.ts
│   │   ├── ticket.service.ts
│   │   ├── order.service.ts
│   │   ├── wallet.service.ts
│   │   ├── email.service.ts
│   │   ├── payment.service.ts
│   │   └── instantWin.service.ts
│   │
│   ├── models/                   # Database models (SQL queries)
│   │   ├── user.model.ts
│   │   ├── competition.model.ts
│   │   ├── ticket.model.ts
│   │   ├── order.model.ts
│   │   ├── wallet.model.ts
│   │   └── content.model.ts
│   │
│   ├── validators/               # Zod schemas
│   │   ├── auth.validator.ts
│   │   ├── user.validator.ts
│   │   ├── competition.validator.ts
│   │   ├── ticket.validator.ts
│   │   └── order.validator.ts
│   │
│   ├── utils/                    # Utility functions
│   │   ├── jwt.ts                # Token generation/verification
│   │   ├── password.ts           # Hashing utilities
│   │   ├── response.ts           # Standard response helpers
│   │   ├── pagination.ts         # Pagination helpers
│   │   └── fileUpload.ts         # File upload handling
│   │
│   └── types/                    # TypeScript types
│       ├── express.d.ts          # Express type extensions
│       ├── user.ts
│       ├── competition.ts
│       └── common.ts
│
├── database/
│   ├── migrations/               # SQL migrations
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_competitions.sql
│   │   ├── 003_create_tickets.sql
│   │   ├── 004_create_orders.sql
│   │   ├── 005_create_wallets.sql
│   │   └── 006_create_content.sql
│   │
│   ├── seeds/                    # Seed data
│   │   ├── users.seed.ts
│   │   └── competitions.seed.ts
│   │
│   └── schema.sql                # Complete schema export
│
└── tests/                        # Test files
    ├── unit/
    └── integration/
```

---

## 3. Security Layer

### 3.1 JWT Authentication Protocol

```typescript
// Token Structure
interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  iat: number;
  exp: number;
}

// Implementation Rules:
// 1. Access Token: 15 minutes expiry, stored in memory
// 2. Refresh Token: 30 days expiry, stored in httpOnly cookie
// 3. Token rotation on each refresh
// 4. Blacklist tokens on logout
```

### 3.2 Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| `guest` | View public pages, competitions, winners |
| `user` | All guest + purchase tickets, manage wallet, view dashboard |
| `admin` | All user + manage competitions, users, orders, content |

```typescript
// Middleware Usage Example
router.get('/admin/users', authenticate, authorize(['admin']), getUsers);
router.get('/dashboard', authenticate, authorize(['user', 'admin']), getDashboard);
```

### 3.3 Rate Limiting Rules

| Endpoint Category | Rate Limit | Window |
|-------------------|------------|--------|
| Auth (login/register) | 5 requests | 15 minutes |
| API General | 100 requests | 1 minute |
| Ticket Purchase | 10 requests | 1 minute |
| Admin Endpoints | 200 requests | 1 minute |

### 3.4 Data Validation Protocol

- **Frontend:** Zod schemas for form validation before submission
- **Backend:** Zod schemas in middleware for all incoming requests
- **Database:** PostgreSQL constraints as final validation layer

```typescript
// Example Validation Schema
const purchaseTicketSchema = z.object({
  competitionId: z.string().uuid(),
  quantity: z.number().int().min(1).max(100),
  skillAnswer: z.string().min(1).max(50),
});
```

### 3.5 Security Headers

```typescript
// Helmet.js Configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      frameSrc: ["https://js.stripe.com"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
}));
```

---

## 4. Third-Party Integrations

### 4.1 Required NPM Packages

#### Frontend (package.json)

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "react-hook-form": "^7.48.0",
    "swr": "^2.2.0",
    "@stripe/stripe-js": "^2.2.0",
    "@stripe/react-stripe-js": "^2.4.0",
    "js-cookie": "^3.0.5",
    "clsx": "^2.0.0",
    "date-fns": "^2.30.0",
    "swiper": "^11.0.0",
    "react-hot-toast": "^2.4.0",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "eslint": "^8.55.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

#### Backend (package.json)

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "pg": "^8.11.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "zod": "^3.22.0",
    "express-rate-limit": "^7.1.0",
    "stripe": "^14.7.0",
    "nodemailer": "^6.9.0",
    "multer": "^1.4.5-lts.1",
    "uuid": "^9.0.0",
    "morgan": "^1.10.0",
    "compression": "^1.7.4"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/express": "^4.17.0",
    "@types/node": "^20.10.0",
    "@types/bcryptjs": "^2.4.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/cors": "^2.8.0",
    "@types/morgan": "^1.9.0",
    "@types/compression": "^1.7.0",
    "@types/multer": "^1.4.0",
    "@types/uuid": "^9.0.0",
    "nodemon": "^3.0.0",
    "ts-node": "^10.9.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.0"
  }
}
```

### 4.2 External API Keys Required

| Service | Purpose | Environment Variable |
|---------|---------|---------------------|
| Stripe | Payment processing | `STRIPE_SECRET_KEY`, `STRIPE_PUBLIC_KEY` |
| SendGrid/Resend | Transactional emails | `EMAIL_API_KEY` |
| AWS S3/Cloudinary | Image storage | `STORAGE_ACCESS_KEY`, `STORAGE_SECRET_KEY` |
| (Optional) Google OAuth | Social login | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |

---

## 5. Execution Order

### Phase 1: Database & Schemas (Estimated: Step 1)

**Agent Role:** SQL Architect

**Tasks:**
1. Set up PostgreSQL database
2. Create all migration files
3. Run migrations to create tables
4. Create seed data for testing
5. Verify all foreign key relationships

**Deliverables:**
- All `.sql` migration files in `backend/database/migrations/`
- Working database with all tables
- Seed script for test data

**Validation:** Run `\dt` in psql to list all tables

---

### Phase 2: Backend API & Auth (Estimated: Step 2)

**Agent Role:** Backend API Developer

**Tasks:**
1. Initialize Node.js project with TypeScript
2. Set up Express with all middleware
3. Implement authentication system (register, login, JWT)
4. Create all CRUD endpoints
5. Implement Stripe payment integration
6. Set up email service

**Deliverables:**
- Working API server on port 3001
- All routes returning correct responses
- Postman collection for API testing

**Validation:** All endpoints respond correctly to Postman tests

---

### Phase 3: Frontend Skeleton (Estimated: Step 3)

**Agent Role:** Frontend Architect

**Tasks:**
1. Initialize Next.js project with App Router
2. Configure Tailwind CSS
3. Create all layout components (Header, Footer, Sidebar)
4. Set up routing structure with placeholder pages
5. Implement auth context and protected routes
6. Create base UI component library

**Deliverables:**
- All routes navigable (even if showing "Coming Soon")
- Auth flow working (login/logout)
- Responsive layouts

**Validation:** Can navigate entire app structure in browser

---

### Phase 4: Page-by-Page Implementation (Estimated: Step 4+)

See [Section 8: Page Specifications Index](#8-page-specifications-index) for individual page build orders.

**Build Order:**
1. Home Page
2. Competition Listing Page
3. Single Competition Page
4. Cart & Checkout
5. User Dashboard
6. Profile & Wallet
7. Ticket Management
8. Admin Dashboard
9. Admin Competition Management
10. Admin User & Order Management
11. Draw Management
12. Content Management
13. Winners Page
14. Static Pages (FAQ, Terms, Privacy)

---

## 6. Database Schemas

### 6.1 Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    email_verified BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### 6.2 Competitions Table

```sql
CREATE TABLE competitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    prize_value DECIMAL(10, 2) NOT NULL,
    ticket_price DECIMAL(10, 2) NOT NULL,
    total_tickets INTEGER NOT NULL,
    max_tickets_per_user INTEGER DEFAULT 100,
    category VARCHAR(50),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'live', 'ended', 'completed', 'cancelled')),
    featured BOOLEAN DEFAULT FALSE,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    draw_date TIMESTAMP WITH TIME ZONE,
    winner_user_id UUID REFERENCES users(id),
    winning_ticket_number INTEGER,
    skill_question VARCHAR(255) NOT NULL,
    skill_answer VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_competitions_status ON competitions(status);
CREATE INDEX idx_competitions_end_date ON competitions(end_date);
CREATE INDEX idx_competitions_slug ON competitions(slug);
```

### 6.3 Competition Images Table

```sql
CREATE TABLE competition_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_competition_images_competition ON competition_images(competition_id);
```

### 6.4 Tickets Table

```sql
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    order_id UUID REFERENCES orders(id),
    ticket_number INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
    is_instant_win BOOLEAN DEFAULT FALSE,
    instant_win_prize VARCHAR(255),
    instant_win_claimed BOOLEAN DEFAULT FALSE,
    purchased_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (competition_id, ticket_number)
);

CREATE INDEX idx_tickets_competition ON tickets(competition_id);
CREATE INDEX idx_tickets_user ON tickets(user_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_instant_win ON tickets(is_instant_win) WHERE is_instant_win = TRUE;
```

### 6.5 Orders Table

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
    subtotal DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    wallet_amount_used DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    stripe_payment_intent_id VARCHAR(255),
    promo_code VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
```

### 6.6 Order Items Table

```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    competition_id UUID NOT NULL REFERENCES competitions(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
```

### 6.7 Wallets Table

```sql
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(10, 2) DEFAULT 0 CHECK (balance >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wallets_user ON wallets(user_id);
```

### 6.8 Wallet Transactions Table

```sql
CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'spend', 'cashback', 'refund', 'admin_credit', 'admin_debit')),
    amount DECIMAL(10, 2) NOT NULL,
    balance_after DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255),
    reference_id UUID, -- Order ID or other reference
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wallet_transactions_wallet ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_transactions_type ON wallet_transactions(type);
```

### 6.9 Promo Codes Table

```sql
CREATE TABLE promo_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_value DECIMAL(10, 2) DEFAULT 0,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_promo_codes_code ON promo_codes(code);
```

### 6.10 Content Pages Table

```sql
CREATE TABLE content_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_content_pages_slug ON content_pages(slug);
```

### 6.11 Winners Gallery Table

```sql
CREATE TABLE winners_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id UUID NOT NULL REFERENCES competitions(id),
    user_id UUID NOT NULL REFERENCES users(id),
    display_name VARCHAR(100), -- For privacy: "John D."
    testimonial TEXT,
    photo_url VARCHAR(500),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_winners_gallery_competition ON winners_gallery(competition_id);
```

### 6.12 Refresh Tokens Table

```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);
```

---

## 7. API Endpoint Registry

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/logout` | Logout user | User |
| POST | `/api/auth/refresh` | Refresh access token | Public |
| POST | `/api/auth/forgot-password` | Request password reset | Public |
| POST | `/api/auth/reset-password` | Reset password with token | Public |
| GET | `/api/auth/me` | Get current user | User |

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/profile` | Get user profile | User |
| PUT | `/api/users/profile` | Update user profile | User |
| PUT | `/api/users/password` | Change password | User |

### Competitions

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/competitions` | List all live competitions | Public |
| GET | `/api/competitions/featured` | Get featured competitions | Public |
| GET | `/api/competitions/:slug` | Get single competition | Public |
| GET | `/api/competitions/:id/tickets` | Get available ticket count | Public |

### Tickets

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/tickets/verify-answer` | Verify skill question | Public |
| GET | `/api/tickets/my-tickets` | Get user's active tickets | User |
| GET | `/api/tickets/history` | Get user's ticket history | User |
| GET | `/api/tickets/instant-wins` | Get user's instant wins | User |

### Cart & Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/cart` | Get current cart | User |
| POST | `/api/cart/add` | Add tickets to cart | User |
| PUT | `/api/cart/update` | Update cart item quantity | User |
| DELETE | `/api/cart/:itemId` | Remove item from cart | User |
| POST | `/api/cart/apply-promo` | Apply promo code | User |
| POST | `/api/orders/create` | Create order from cart | User |
| POST | `/api/orders/payment-intent` | Create Stripe payment intent | User |
| POST | `/api/orders/confirm` | Confirm order after payment | User |
| GET | `/api/orders` | Get user's orders | User |
| GET | `/api/orders/:id` | Get single order | User |

### Wallet

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/wallet` | Get wallet balance | User |
| GET | `/api/wallet/transactions` | Get transaction history | User |
| POST | `/api/wallet/deposit` | Create deposit payment intent | User |

### Winners

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/winners` | Get winners gallery | Public |
| GET | `/api/winners/recent` | Get recent winners | Public |

### Admin - Competitions

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/competitions` | List all competitions | Admin |
| POST | `/api/admin/competitions` | Create competition | Admin |
| GET | `/api/admin/competitions/:id` | Get competition details | Admin |
| PUT | `/api/admin/competitions/:id` | Update competition | Admin |
| DELETE | `/api/admin/competitions/:id` | Delete competition | Admin |
| POST | `/api/admin/competitions/:id/duplicate` | Duplicate competition | Admin |
| POST | `/api/admin/competitions/:id/instant-wins` | Set instant win numbers | Admin |
| GET | `/api/admin/competitions/:id/entries` | Export entries CSV | Admin |
| POST | `/api/admin/competitions/:id/draw` | Declare winner | Admin |

### Admin - Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/users` | List all users | Admin |
| GET | `/api/admin/users/:id` | Get user details | Admin |
| PUT | `/api/admin/users/:id` | Update user | Admin |
| POST | `/api/admin/users/:id/ban` | Ban/unban user | Admin |
| POST | `/api/admin/users/:id/wallet` | Credit/debit wallet | Admin |

### Admin - Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/orders` | List all orders | Admin |
| GET | `/api/admin/orders/:id` | Get order details | Admin |
| POST | `/api/admin/orders/:id/refund` | Refund order | Admin |

### Admin - Content

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/content` | List all content pages | Admin |
| PUT | `/api/admin/content/:slug` | Update content page | Admin |
| POST | `/api/admin/winners-gallery` | Add winner to gallery | Admin |

---

## 8. Page Specifications Index

> Detailed specifications for each page are in `docs/pages/`

| Ref | Page | Spec File | Priority |
|-----|------|-----------|----------|
| 3.1 | Home Page | `docs/pages/01-home.md` | High |
| 3.2 | Competition Listing | `docs/pages/02-competitions.md` | High |
| 3.3 | Single Competition | `docs/pages/03-competition-single.md` | High |
| 3.4 | Cart | `docs/pages/04-cart.md` | High |
| 3.5 | Checkout | `docs/pages/05-checkout.md` | High |
| 3.6 | Login | `docs/pages/06-login.md` | High |
| 3.7 | Register | `docs/pages/07-register.md` | High |
| 3.8 | Forgot Password | `docs/pages/08-forgot-password.md` | Medium |
| 3.9 | User Dashboard | `docs/pages/09-user-dashboard.md` | High |
| 3.10 | Profile | `docs/pages/10-profile.md` | Medium |
| 3.11 | Wallet | `docs/pages/11-wallet.md` | High |
| 3.12 | My Tickets | `docs/pages/12-my-tickets.md` | High |
| 3.13 | My Wins | `docs/pages/13-my-wins.md` | Medium |
| 3.14 | Winners Page | `docs/pages/14-winners.md` | Medium |
| 3.15 | Admin Dashboard | `docs/pages/15-admin-dashboard.md` | High |
| 3.16 | Admin Competitions | `docs/pages/16-admin-competitions.md` | High |
| 3.17 | Admin Users | `docs/pages/17-admin-users.md` | Medium |
| 3.18 | Admin Orders | `docs/pages/18-admin-orders.md` | Medium |
| 3.19 | Admin Draws | `docs/pages/19-admin-draws.md` | High |
| 3.20 | Admin Content | `docs/pages/20-admin-content.md` | Low |
| 3.21 | FAQ | `docs/pages/21-faq.md` | Low |
| 3.22 | Terms & Conditions | `docs/pages/22-terms.md` | Low |
| 3.23 | Privacy Policy | `docs/pages/23-privacy.md` | Low |

---

## 9. Agent Roles & Workflows

### 9.1 Agent Persona Definitions

#### SQL Architect
```
You are the SQL Architect. Your expertise is in designing and implementing
PostgreSQL database schemas. You write clean, normalized SQL with proper
indexes, constraints, and relationships. You always consider query
performance and data integrity.

Your scope:
- Create migration files in backend/database/migrations/
- Define all tables, indexes, and constraints
- Create seed data for testing
- Document any complex queries needed

You do NOT:
- Write application code
- Touch frontend files
- Modify API endpoints
```

#### Backend API Developer
```
You are the Backend API Developer. You build secure, efficient Node.js APIs
using Express and TypeScript. You follow RESTful conventions and implement
proper error handling, validation, and authentication.

Your scope:
- All files in backend/src/
- API routes, controllers, services, and models
- Authentication and authorization logic
- Payment integration (Stripe)
- Email service integration

You do NOT:
- Create database migrations (SQL Architect's job)
- Write React components
- Style anything
```

#### Frontend Architect
```
You are the Frontend Architect. You build the structural foundation of the
Next.js application. You create layouts, set up routing, implement auth
flows, and build reusable UI components.

Your scope:
- Next.js app structure and routing
- Layout components (Header, Footer, Sidebar)
- Base UI component library
- Auth context and protected routes
- API client setup

You do NOT:
- Implement full page features (Page Builder's job)
- Write backend code
- Create database schemas
```

#### UI Component Builder
```
You are the UI Component Builder. You create polished, accessible, and
reusable React components using Tailwind CSS. You focus on visual
consistency and user experience.

Your scope:
- All files in frontend/src/components/
- Tailwind CSS styling
- Component variants and states
- Accessibility (ARIA labels, keyboard navigation)

You do NOT:
- Implement business logic
- Make API calls
- Set up routing
```

#### Page Builder (Feature Developer)
```
You are the Page Builder. You implement complete page features by combining
existing components, connecting to APIs, and handling state. You work on
one page at a time, following the page spec provided.

Your scope:
- Single page implementation as specified
- Connecting components to API
- Local state management
- Form handling and validation

Before starting:
1. Read .ai/context.md
2. Read the specific page spec (docs/pages/XX-pagename.md)
3. Understand required API endpoints

After completing:
1. Update .ai/context.md
2. Test the page manually
3. Document any issues found
```

#### Integration Tester
```
You are the Integration Tester. You verify that features work correctly
end-to-end. You write test cases, find bugs, and document issues.

Your scope:
- Testing completed pages
- API endpoint testing
- Writing bug reports
- Suggesting improvements

You do NOT:
- Fix bugs (report to appropriate agent)
- Write production code
- Change database schemas
```

### 9.2 Agent Workflow Protocol

```
┌─────────────────────────────────────────────────┐
│              BEFORE STARTING ANY TASK           │
├─────────────────────────────────────────────────┤
│ 1. Read .ai/context.md completely              │
│ 2. Check "Current Active Task" matches yours   │
│ 3. Review "Known Issues" for relevant bugs     │
│ 4. Read relevant page spec if building a page  │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│                 DURING TASK                     │
├─────────────────────────────────────────────────┤
│ 1. Follow the specific page/component spec     │
│ 2. Use existing components from components/ui/ │
│ 3. Follow established patterns in codebase     │
│ 4. Log any blockers or decisions made          │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│               AFTER COMPLETING TASK             │
├─────────────────────────────────────────────────┤
│ 1. Update .ai/context.md:                      │
│    - Update "Project Status"                   │
│    - Update "Current Active Task"              │
│    - Add to "Recent Changes"                   │
│    - Update "Next Steps"                       │
│    - Add any "Known Issues"                    │
│    - Leave note in "Agent Communication Log"   │
│ 2. Mark task as complete                       │
│ 3. Do NOT start next task (await assignment)   │
└─────────────────────────────────────────────────┘
```

### 9.3 Validation Rule

> **CRITICAL:** Before marking ANY task complete, you MUST update `.ai/context.md`. Failure to do so will cause context loss for future agents and may result in duplicate work or broken integrations.

### 9.4 Example Agent Invocation

```markdown
## Prompt for Page Builder Agent

You are the Page Builder agent. Your task is to build the User Dashboard
page using the specifications in docs/pages/09-user-dashboard.md.

MANDATORY FIRST STEP:
Read .ai/context.md to understand the current project state.

MANDATORY FINAL STEP:
Update .ai/context.md with your changes before marking complete.

Begin by reading the required files, then implement the page.
```

---

## Appendix A: File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| React Components | PascalCase | `CompetitionCard.tsx` |
| Pages (App Router) | lowercase | `page.tsx` |
| Utilities | camelCase | `formatCurrency.ts` |
| Types | PascalCase | `Competition.ts` |
| API Routes | kebab-case | `competition.routes.ts` |
| SQL Migrations | numbered prefix | `001_create_users.sql` |
| Page Specs | numbered prefix | `01-home.md` |

---

## Appendix B: Git Branch Strategy

```
main                    # Production-ready code
├── develop             # Integration branch
│   ├── feature/xxx     # Feature branches
│   ├── bugfix/xxx      # Bug fix branches
│   └── hotfix/xxx      # Emergency fixes
```

**Branch Naming:**
- `feature/user-dashboard` - New features
- `bugfix/cart-total-calculation` - Bug fixes
- `hotfix/security-patch` - Urgent production fixes

---

## Appendix C: Checklist Templates

### Page Completion Checklist

- [ ] Page renders without errors
- [ ] All required components are integrated
- [ ] API calls work correctly
- [ ] Loading states are shown
- [ ] Error states are handled
- [ ] Form validation works (if applicable)
- [ ] Responsive on mobile, tablet, desktop
- [ ] Accessible (keyboard navigation, screen readers)
- [ ] .ai/context.md updated

### API Endpoint Checklist

- [ ] Route is defined
- [ ] Controller handles request
- [ ] Service contains business logic
- [ ] Validation schema is applied
- [ ] Auth middleware is applied (if needed)
- [ ] Error responses follow standard format
- [ ] Success responses follow standard format
- [ ] Endpoint is documented in API registry
