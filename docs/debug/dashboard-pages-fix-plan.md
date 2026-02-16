# Dashboard Pages — Debug Fix Plan

> **Status:** Plan only — do NOT implement yet.

---

## Fix Strategy

There are two approaches. We recommend **Option A** (fix frontend) as it's less risky and doesn't change backend API contracts.

### Option A: Fix Frontend (Recommended ✅)
Adjust the frontend SWR fetchers and data access to match what the backend actually returns. This avoids breaking any other consumers of the backend API.

### Option B: Fix Backend
Add transformation/wrapper layers to backend responses. Riskier — could break admin pages or other API consumers.

---

## Fixes Required (Option A — Frontend-Side)

### Fix 1: Verify & Correct API URL Prefix
**File:** `frontend/src/lib/api.ts` (or `.env`)
- Check if `NEXT_PUBLIC_API_URL` includes `/api` suffix at runtime
- If `NEXT_PUBLIC_API_URL = http://localhost:3001/api`, then SWR keys like `/api/tickets/my-tickets` → `http://localhost:3001/api/api/tickets/my-tickets` (BROKEN)
- **Decision:** Standardize so `api.ts` base URL = `http://localhost:3001/api` and all SWR keys drop the `/api` prefix (e.g., `/tickets/my-tickets`)
- OR keep base URL as `http://localhost:3001` and keep SWR keys as `/api/tickets/my-tickets`

### Fix 2: Active Tickets Page
**File:** `frontend/src/app/(dashboard)/my-tickets/page.tsx`

| What | Current | Fix |
|------|---------|-----|
| SWR key | `/api/tickets/my-tickets` | Adjust based on Fix 1 |
| Fetcher expects | `res.data.tickets` (wrapped) | `res.data` (flat array) |
| Field names | `ticket.competitionId`, `ticket.ticketNumber`, `ticket.isInstantWin`, `ticket.purchasedAt` | Map from snake_case: `competition_id`, `ticket_number`, `is_instant_win`, `purchased_at` |
| Competition fields | `competition.endDate`, `competition.images` | `competition.draw_date` (no images returned by backend) |

### Fix 3: Ticket History Page
**File:** `frontend/src/app/(dashboard)/my-tickets/history/page.tsx`

| What | Current | Fix |
|------|---------|-----|
| SWR key | `/api/tickets/history` | Adjust based on Fix 1 |
| Fetcher expects | `res.data.history` (wrapped) | `res.data` (flat array) |
| Interface | `TicketHistoryItem` (custom shape) | Map backend ticket shape to match, or restructure the component |

### Fix 4: My Wins Page — MOST COMPLEX
**File:** `frontend/src/app/(dashboard)/my-wins/page.tsx`
**Backend:** `backend/src/routes/winner.routes.ts` + `backend/src/controllers/winner.controller.ts`

**Two sub-fixes needed:**
1. **Add backend route:** Create `GET /api/winners/my-wins` (requires auth middleware). This route should query completed competitions where the user's ticket was the winner.
2. **Fix response mapping:** Adjust frontend fetcher to match new route's actual response shape.

### Fix 5: Wallet Page
**File:** `frontend/src/app/(dashboard)/wallet/page.tsx`

| What | Current | Fix |
|------|---------|-----|
| SWR key | `/api/wallet` | Adjust based on Fix 1 |
| Fetcher expects | `{ wallet: WalletType, transactions: WalletTransaction[] }` | Backend returns wallet data only (no transactions). Need **2 SWR calls**: one for `/wallet` and one for `/wallet/transactions` |
| Transaction fields | `transaction.createdAt`, `transaction.balanceAfter` | Map from `created_at`, `balance_after` |

### Fix 6: Profile Page
**File:** `frontend/src/app/(dashboard)/profile/page.tsx`

| What | Current | Fix |
|------|---------|-----|
| SWR key | `/api/users/profile` | Adjust based on Fix 1 |
| Fetcher expects | `{ user: User }` (camelCase) | Backend returns flat object with `first_name`, `last_name`, etc. |
| Profile save sends | `{ firstName, lastName }` | Must map to `{ first_name, last_name }` |
| Password change URL | `/api/users/password` | Adjust based on Fix 1 |

### Fix 7: Global — Add snake_case → camelCase Utility (Optional)
**File:** `frontend/src/lib/utils.ts` (new function)
- Add a `toCamelCase(obj)` helper to transform all snake_case keys
- Apply in SWR fetchers or in the API client centrally
- This would reduce per-page mapping work

### Fix 8: Competitions Page — Zero Count
**File:** `frontend/src/app/(public)/competitions/page.tsx`

| What | Current | Fix |
|------|---------|-----|
| Fetcher return type | `CompetitionsApiResponse = { competitions: Competition[] }` | Remove wrapper — backend returns flat array |
| Data access | `data?.data?.competitions \|\| []` | `data?.data \|\| []` (array is directly in `data`) |
| Meta access | `data?.meta` | Works correctly ✅ (meta is at top level) |
| Field names | Uses both `snake_case` and `camelCase` via `\|\|` fallbacks | Already handled ✅ in `CompetitionCard` |

### Fix 9: Dashboard Stats — Replace Mock Data With Real API Calls
**File:** `frontend/src/app/(dashboard)/dashboard/page.tsx`

**What needs to change:**
- Remove all `MOCK_STATS`, `MOCK_COMPETITIONS`, `MOCK_ACTIVITY` constants
- Add 3 SWR calls to fetch real data:
  1. `GET /api/wallet` → get user's actual balance
  2. `GET /api/tickets/my-tickets` → get count of active tickets
  3. `GET /api/winners/my-wins` → get count of wins (depends on Fix 4 adding this route)
- Pass real data to `StatsCards` component
- Fetch real active competitions and recent activity from API

---

## Implementation Order

```
1.  Fix 1  — Verify URL prefix (5 min)
2.  Fix 7  — Add camelCase utility (optional, 10 min)
3.  Fix 8  — Competitions page zero count (10 min)
4.  Fix 5  — Wallet page (split SWR calls, 15 min)
5.  Fix 6  — Profile page (field mapping + save, 15 min)
6.  Fix 2  — Active Tickets page (field mapping, 15 min)
7.  Fix 3  — Ticket History page (field mapping, 15 min)
8.  Fix 4  — My Wins page (new backend route + frontend, 30 min)
9.  Fix 9  — Dashboard stats real API calls (20 min, depends on Fixes 4/5)
```

**Estimated total:** ~2 hours

---

## Verification Plan

### Manual Testing (per page)
1. Log in with a valid user account
2. Navigate to each dashboard page
3. Verify page loads without "Try Again" error
4. Verify data displays correctly (names, amounts, dates)

### Specific Checks
- **Competitions:** Verify competitions appear (not zero) with correct prices and progress
- **Dashboard:** Verify balance, active tickets, wins reflect real user data (not £125.50/27/3)
- **Wallet:** Verify balance shows, transaction history loads
- **Profile:** Edit name → save → verify updated name persists
- **My Tickets:** Verify ticket numbers and competition names display
- **My Wins:** Will show empty state (no wins yet) — verify no error
- **Ticket History:** Verify grouped-by-date display works
