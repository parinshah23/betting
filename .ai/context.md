# Project Context - Living Memory

> **CRITICAL RULE:** Every AI agent MUST read this file at the start of their task and UPDATE it after completing their task. This prevents hallucinations, context loss, and ensures continuity across autonomous agents.

---

## Project Status

| Field | Value |
|-------|-------|
| **Current Phase** | Phase 0: Planning & Documentation COMPLETE |
| **Phase Progress** | 100% |
| **Last Updated** | 2026-01-28 |
| **Last Agent** | Chief Technical Architect |

---

## Current Active Task

```
Task: Phase 1 - Database Schema Setup
Status: Ready to Start
Assigned To: SQL Architect
Blockers: None
Prerequisites: PostgreSQL installed and configured
```

---

## Recent Changes

| Date | File/Component | Change Description | Agent |
|------|----------------|-------------------|-------|
| 2026-01-28 | `.ai/context.md` | Created project brain template | Architect |
| 2026-01-28 | `MASTER_DEVELOPMENT_PLAN.md` | Created master development plan with full architecture | Architect |
| 2026-01-28 | `docs/pages/*.md` | Created 17 page specifications | Architect |
| 2026-01-28 | `docs/AGENT_ROLES.md` | Created agent roles and workflows guide | Architect |
| 2026-01-28 | `frontend/*` | Scaffolded Next.js project structure | Architect |
| 2026-01-28 | `backend/*` | Scaffolded Node.js API project structure | Architect |

---

## Next Steps

1. **Immediate Next Task:** Create PostgreSQL database migrations (Phase 1)
   - Reference: MASTER_DEVELOPMENT_PLAN.md Section 6
   - Agent: SQL Architect

2. **Following Task:** Implement Node.js API with authentication (Phase 2)
   - Reference: MASTER_DEVELOPMENT_PLAN.md Section 7
   - Agent: Backend API Developer

3. **Queue:**
   - Implement base UI components (Frontend Architect)
   - Build authentication pages (Page Builder)
   - Implement user dashboard (Page Builder)

---

## Global Constants

### Environment Variables Required

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/raffle_db
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=raffle_db
DATABASE_USER=raffle_user
DATABASE_PASSWORD=<secure_password>

# Authentication
JWT_SECRET=<generate_256_bit_secret>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=<refresh_secret>
REFRESH_TOKEN_EXPIRES_IN=30d

# API Configuration
API_BASE_URL=http://localhost:3001/api
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# Payment Integration (Stripe)
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email Service (SendGrid/Resend)
EMAIL_API_KEY=<api_key>
EMAIL_FROM=noreply@rafflesite.com

# File Storage (AWS S3 / Cloudinary)
STORAGE_BUCKET=raffle-assets
STORAGE_REGION=eu-west-1
STORAGE_ACCESS_KEY=<access_key>
STORAGE_SECRET_KEY=<secret_key>
```

### Design System Constants

```javascript
// Colors - Tailwind Config Extensions
const colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#0ea5e9',  // Main brand color
    600: '#0284c7',
    700: '#0369a1',
  },
  accent: {
    500: '#f59e0b',  // Gold/Warning - for highlights
    600: '#d97706',
  },
  success: '#10b981',
  danger: '#ef4444',
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    800: '#262626',
    900: '#171717',
  }
};

// Typography
const fontFamily = {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  display: ['Poppins', 'sans-serif'],
};

// Spacing & Breakpoints (Tailwind defaults)
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};
```

### API Response Format Standard

```typescript
// Success Response
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// Error Response
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}
```

---

## Known Issues

| ID | Severity | Description | Status | Assigned To |
|----|----------|-------------|--------|-------------|
| - | - | No known issues yet | - | - |

---

## Completed Phases

| Phase | Name | Completion Date | Notes |
|-------|------|-----------------|-------|
| Phase 0 | Planning & Documentation | 2026-01-28 | All docs and scaffolding complete |

---

## File Registry

> Key files and their purposes. Update when creating new significant files.

| Path | Purpose | Last Modified |
|------|---------|---------------|
| `.ai/context.md` | Project brain - living memory | 2026-01-28 |
| `MASTER_DEVELOPMENT_PLAN.md` | Architecture & execution plan | 2026-01-28 |
| `docs/AGENT_ROLES.md` | Agent personas and workflows | 2026-01-28 |
| `docs/pages/01-home.md` | Home page spec | 2026-01-28 |
| `docs/pages/02-competitions.md` | Competitions listing spec | 2026-01-28 |
| `docs/pages/03-competition-single.md` | Single competition page spec | 2026-01-28 |
| `docs/pages/04-cart.md` | Cart page spec | 2026-01-28 |
| `docs/pages/05-checkout.md` | Checkout page spec | 2026-01-28 |
| `docs/pages/06-login.md` | Login page spec | 2026-01-28 |
| `docs/pages/07-register.md` | Register page spec | 2026-01-28 |
| `docs/pages/08-forgot-password.md` | Password reset spec | 2026-01-28 |
| `docs/pages/09-user-dashboard.md` | User dashboard spec | 2026-01-28 |
| `docs/pages/10-profile.md` | Profile page spec | 2026-01-28 |
| `docs/pages/11-wallet.md` | Wallet page spec | 2026-01-28 |
| `docs/pages/12-my-tickets.md` | Tickets page spec | 2026-01-28 |
| `docs/pages/13-my-wins.md` | Wins page spec | 2026-01-28 |
| `docs/pages/14-winners.md` | Public winners page spec | 2026-01-28 |
| `docs/pages/15-admin-dashboard.md` | Admin dashboard spec | 2026-01-28 |
| `docs/pages/16-admin-competitions.md` | Admin competitions spec | 2026-01-28 |
| `docs/pages/17-admin-users.md` | Admin users spec | 2026-01-28 |
| `docs/pages/18-admin-orders.md` | Admin orders spec | 2026-01-28 |
| `docs/pages/19-admin-draws.md` | Admin draws spec | 2026-01-28 |
| `docs/pages/20-admin-content.md` | Admin content spec | 2026-01-28 |
| `docs/pages/21-static-pages.md` | Static pages spec | 2026-01-28 |
| `frontend/` | Next.js frontend scaffold | 2026-01-28 |
| `backend/` | Node.js backend scaffold | 2026-01-28 |

---

## Agent Communication Log

> Use this section to leave notes for the next agent.

```
[2026-01-28 - Chief Technical Architect]
Phase 0 COMPLETE. Full documentation system created.

COMPLETED:
- Master Development Plan with architecture, security, and API specs
- 17 detailed page specifications in docs/pages/
- Agent roles and workflow documentation
- Frontend Next.js project scaffolded
- Backend Node.js project scaffolded

NEXT AGENT (SQL Architect):
1. Read MASTER_DEVELOPMENT_PLAN.md Section 6 for database schemas
2. Create migration files in backend/database/migrations/
3. Tables to create: users, competitions, competition_images, tickets,
   orders, order_items, wallets, wallet_transactions, promo_codes,
   content_pages, winners_gallery, refresh_tokens
4. Create seed data for testing
5. Update this context.md when done

HOW TO START:
You are the SQL Architect. Create all database migrations for the raffle platform.
Reference: MASTER_DEVELOPMENT_PLAN.md Section 6 for complete schemas.
```

---

## Update Protocol

**After completing ANY task, the agent MUST:**

1. Update `Project Status` section with new phase/progress
2. Update `Current Active Task` with the next task
3. Add entry to `Recent Changes` table
4. Update `Next Steps` queue
5. Log any new `Known Issues`
6. Add communication note in `Agent Communication Log`
7. Update `File Registry` if new files were created

**Failure to update this file will cause context loss for future agents.**
