# Project Context - Living Memory

> **CRITICAL RULE:** Every AI agent MUST read this file at the start of their task and UPDATE it after completing their task. This prevents hallucinations, context loss, and ensures continuity across autonomous agents.

---

## Project Status

| Field | Value |
|-------|-------|
| **Current Phase** | Phase 4: Page-by-Page Implementation |
| **Phase Progress** | 35% (User Dashboard Main Page complete) |
| **Last Updated** | 2026-01-31 |
| **Last Agent** | Frontend Developer |

---

## Current Active Task



```

Task: Implement User Dashboard Pages

Status: Pending

Assigned To: Frontend Developer

Blockers: None

Prerequisites: Core User Pages complete

```



---



## Recent Changes



| Date | File/Component | Change Description | Agent |

|------|----------------|-------------------|-------|

| 2026-01-31 | `frontend/src/app/(public)/competitions/[slug]/*` | Implemented Single Competition Page | Frontend Developer |

| 2026-01-31 | `frontend/src/app/cart/page.tsx` | Implemented Cart Page | Frontend Developer |

| 2026-01-31 | `frontend/src/app/checkout/page.tsx` | Implemented Checkout Page with Stripe | Frontend Developer |

| 2026-01-31 | `frontend/src/components/cart/*` | Created CartItem, PromoCode, OrderSummary | Frontend Developer |

| 2026-01-31 | `frontend/src/components/checkout/*` | Created Checkout components | Frontend Developer |



---



## Next Steps



### Phase 4: Page-by-Page Implementation (IN PROGRESS)



**Completed:**

1. **Authentication Pages** ✅

   - Login page (`/login`)

   - Register page (`/register`)

   - Forgot password page (`/forgot-password`)

   - Reset password page (`/reset-password`)



2. **Core User Pages** ✅

   - Competitions listing (`/competitions`)

   - Single competition details (`/competitions/[slug]`)

   - Cart page (`/cart`)

   - Checkout page (`/checkout`)



3. **User Dashboard** (Next)

   - Dashboard (`/dashboard`)

   - My tickets (`/my-tickets`)

   - My wins (`/my-wins`)

   - Wallet (`/wallet`)

   - Profile (`/profile`)



4. **Public Pages**

   - Winners gallery (`/winners`)

   - How it works (`/how-it-works`)

   - FAQ (`/faq`)

   - Terms (`/terms`)

   - Privacy (`/privacy`)



5. **Admin Dashboard**

   - Admin overview (`/admin`)

   - Admin competitions (`/admin/competitions`)

   - Admin users (`/admin/users`)

   - Admin orders (`/admin/orders`)

   - Admin draws (`/admin/draws`)

   - Admin content (`/admin/content`)



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

| Phase 1 | Database & Schemas | 2026-01-30 | 12 tables created, 3 seed files, test data populated |

| Phase 2 | Backend API & Auth | 2026-01-31 | All API routes implemented, 9/9 tests passing |

| Phase 3 | Frontend Skeleton | 2026-01-31 | UI library, contexts, layout, home page complete |



---



## File Registry



> Key files and their purposes. Update when creating new significant files.



| Path | Purpose | Last Modified |

|------|---------|---------------|

| `.ai/context.md` | Project brain - living memory | 2026-01-31 |

| `MASTER_DEVELOPMENT_PLAN.md` | Architecture & execution plan | 2026-01-28 |

| `docs/AGENT_ROLES.md` | Agent personas and workflows | 2026-01-28 |

| `backend/database/migrations/*` | Database schema migrations | 2026-01-30 |

| `backend/database/seeds/*` | Database seed scripts | 2026-01-30 |

| `backend/.env` | Backend config | 2026-01-30 |

| `frontend/.env.local` | Frontend config | 2026-01-30 |

| `frontend/src/components/ui/*` | Base UI component library | 2026-01-31 |

| `frontend/src/context/*` | Auth, Cart, Toast contexts | 2026-01-31 |

| `frontend/src/components/layout/*` | Header and Footer components | 2026-01-31 |

| `frontend/src/components/competition/*` | CompetitionCard and CompetitionGrid | 2026-01-31 |

| `frontend/src/app/page.tsx` | Home page implementation | 2026-01-31 |

| `frontend/src/app/providers.tsx` | App providers wrapper | 2026-01-31 |

| `frontend/src/validators/auth.ts` | Zod validation schemas for auth | 2026-01-31 |

| `frontend/src/app/(auth)/login/page.tsx` | Login page | 2026-01-31 |

| `frontend/src/app/(auth)/register/page.tsx` | Register page | 2026-01-31 |

| `frontend/src/app/(auth)/forgot-password/page.tsx` | Forgot password page | 2026-01-31 |

| `frontend/src/app/(auth)/reset-password/page.tsx` | Reset password page | 2026-01-31 |

| `frontend/src/app/(public)/competitions/page.tsx` | Competitions listing page | 2026-01-31 |

| `frontend/src/app/(public)/competitions/[slug]/page.tsx` | Single competition page | 2026-01-31 |

| `frontend/src/app/cart/page.tsx` | Cart page | 2026-01-31 |

| `frontend/src/app/checkout/page.tsx` | Checkout page | 2026-01-31 |

| `frontend/src/app/checkout/success/page.tsx` | Checkout success page | 2026-01-31 |

| `frontend/src/components/cart/*` | Cart components (CartItem, OrderSummary) | 2026-01-31 |

| `frontend/src/components/checkout/*` | Checkout components (WalletSection, Stripe) | 2026-01-31 |



---



## Agent Communication Log



> Use this section to leave notes for the next agent.



```

[2026-01-31 - Frontend Developer]

Phase 3 Implementation Complete.



COMPLETED:

- Created complete UI component library:

  * Button (variants: primary, secondary, outline, ghost, danger; sizes: sm, md, lg)

  * Input & Textarea (with label, error, helperText support)

  * Card, CardHeader, CardTitle, CardContent, CardFooter

  * Modal & ConfirmModal (with keyboard escape, backdrop click close)

  * Badge & StatusBadge

  * Spinner, LoadingOverlay, Skeleton variants

  * ProgressBar & CircularProgress

  * CountdownTimer (variants: default, compact, large)

  * Select, RadioGroup, Checkbox

  * Toast, ToastContainer, EmptyState, Alert



- Implemented React contexts:

  * AuthContext (login, register, logout, updateProfile, changePassword)

  * CartContext (addItem, updateItem, removeItem, promo codes)

  * ToastContext (showSuccess, showError, showWarning, showInfo)



- Created layout components:

  * Header (with mobile menu, user dropdown, cart icon)

  * Footer (with navigation links, social icons)



- Created competition components:

  * CompetitionCard (variants: default, compact)

  * CompetitionGrid (with loading and empty states)



- Implemented Home Page:

  * Hero section with featured competitions

  * Live competitions grid

  * Ending Soon section

  * Recent Winners section

  * How It Works section

  * Trust badges section



VERIFIED:

- Frontend builds successfully (npm run build)

- Backend tests pass (9/9)

- All contexts properly wrapped in providers



NEXT AGENT:

Phase 4: Page-by-Page Implementation

- Auth pages complete (login, register, forgot-password, reset-password)

- Competitions listing page complete

- Next: Single competition details, Cart, Checkout



[2026-01-31 - Frontend Developer]

Phase 4 Page Implementation Update.



COMPLETED:

- Implemented Single Competition Page (`/competitions/[slug]`)

- Created required sub-components:

  * `ImageGallery` (with thumbnails)

  * `CompetitionInfo` (stats, countdown, progress)

  * `SkillQuestion` (API verification flow)

  * `TicketSelector` (quantity control, quick select, max limits)

- Created shared utility `lib/utils.ts` (cn, formatCurrency)

- Updated `Button` component to be polymorphic (supports `href`)

- Implemented SEO metadata generation for competition pages

- Implemented Cart Page (`/cart`) with `CartItem`, `PromoCodeSection`, `OrderSummary`

- Implemented Checkout Page (`/checkout`) with Stripe Elements and Wallet integration

- Created Checkout Success Page (`/checkout/success`)



NEXT ACTIONS:

1. Implement User Dashboard Pages (`/dashboard`, `/my-tickets`, `/wallet`, `/profile`)

2. Implement Public Static Pages (`/winners`, `/faq`, etc.)

3. Implement Admin Dashboard Pages

[2026-01-31 - Frontend Developer]
Phase 4 Page Implementation Update - Dashboard.

COMPLETED:
- Implemented User Dashboard Layout (`/app/(dashboard)/layout.tsx`) with Sidebar.
- Implemented Dashboard Home Page (`/dashboard/page.tsx`).
- Created Dashboard Components:
  * `StatsCards` (Wallet, Tickets, Wins)
  * `ActiveCompetitions` (List of user's active entries)
  * `RecentActivity` (Timeline of actions)

VERIFIED:
- Frontend builds successfully.

NEXT ACTIONS:
1. Implement Dashboard Subpages (`/my-tickets`, `/wallet`, `/profile`).
2. Implement Public Static Pages.
3. Implement Admin Dashboard Pages.
