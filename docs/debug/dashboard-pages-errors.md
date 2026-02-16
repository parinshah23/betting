# Dashboard Pages — Error Analysis

> All 5 dashboard pages show "Try Again" errors when accessed by a logged-in user.

## Affected Pages

| Page | Frontend File | SWR Fetch URL | Status |
|------|---------------|---------------|--------|
| Competitions | `(public)/competitions/page.tsx` | `/competitions?status=live` | ❌ Shows 0 |
| Dashboard Stats | `(dashboard)/dashboard/page.tsx` | None (hardcoded mock) | ❌ Fake data |
| Active Tickets | `(dashboard)/my-tickets/page.tsx` | `/api/tickets/my-tickets` | ❌ Broken |
| Ticket History | `(dashboard)/my-tickets/history/page.tsx` | `/api/tickets/history` | ❌ Broken |
| My Wins | `(dashboard)/my-wins/page.tsx` | `/api/winners/my-wins` | ❌ Broken |
| Wallet | `(dashboard)/wallet/page.tsx` | `/api/wallet` | ❌ Broken |
| Profile | `(dashboard)/profile/page.tsx` | `/api/users/profile` | ❌ Broken |

---

## Root Causes Identified

### 🔴 Bug 1: Double `/api` Prefix (ALL dashboard pages)

**The Problem:**
- `api.ts` client already sets `baseUrl = http://localhost:3001`
- Backend mounts routes at `app.use('/api', routes)` → so the correct endpoint is e.g. `http://localhost:3001/api/tickets/my-tickets`
- But SWR fetchers pass `/api/tickets/my-tickets` to `api.get()`
- `api.get()` prepends `http://localhost:3001` → final URL = `http://localhost:3001/api/tickets/my-tickets`

**Verdict:** This actually results in the **correct** URL! The `api.ts` `baseUrl` is just `http://localhost:3001` (no `/api` suffix), and the backend mounts at `/api`. So `/api/tickets/my-tickets` passed to `api.get()` becomes `http://localhost:3001/api/tickets/my-tickets` ✅.

**Wait — re-checking:** The `api.ts` line: `const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'`. If `NEXT_PUBLIC_API_URL` is set to `http://localhost:3001/api` (common pattern), then we'd get double `/api`. Need to verify the env var value.

> **Action needed:** Check actual `NEXT_PUBLIC_API_URL` value at runtime.

### 🔴 Bug 2: Missing Backend Route — `/winners/my-wins`

**The Problem:**
- `my-wins/page.tsx` fetches `/api/winners/my-wins`
- Backend `winner.routes.ts` only defines:
  - `GET /` → `getWinners`
  - `GET /recent` → `getRecentWinners`
- **There is NO `/my-wins` route.** This endpoint doesn't exist.

**Impact:** My Wins page will always 404.

### 🔴 Bug 3: Response Shape Mismatches (ALL pages)

Frontend pages expect **wrapped, camelCase** response objects. Backend returns **flat, snake_case** data.

| Page | Frontend Expects | Backend Actually Returns |
|------|-----------------|------------------------|
| Active Tickets | `{ tickets: TicketWithCompetition[] }` | Flat array in `data` (snake_case fields) |
| Ticket History | `{ history: TicketHistoryItem[] }` | Flat array in `data` (snake_case fields) |
| My Wins | `{ wins: Win[] }` | Route doesn't exist |
| Wallet | `{ wallet: WalletType, transactions: WalletTransaction[] }` | Wallet returns `{ id, balance, ... }` only. Transactions are a **separate endpoint** `/wallet/transactions`. |
| Profile | `{ user: User }` (camelCase: `firstName`) | `{ id, email, first_name, last_name, ... }` (snake_case) |

### 🟡 Bug 4: Frontend Type Expectation vs Backend Field Names

Frontend `types/index.ts` defines `User` with camelCase (`firstName`, `lastName`, `emailVerified`), `Ticket` with `competitionId`, etc. But the backend consistently returns snake_case (`first_name`, `last_name`, `email_verified`, `competition_id`).

There is **no transformation layer** between backend responses and frontend types. Every page that reads these fields will show `undefined` values even if the API call succeeds.

### 🟡 Bug 5: Wallet Page Combines Two Endpoints Into One Call

- `wallet/page.tsx` does a single SWR fetch to `/api/wallet` expecting both `wallet` and `transactions` in one response.
- Backend has **2 separate endpoints**: `GET /wallet` (balance only) and `GET /wallet/transactions`.
- The page will never get transactions data from the single call.

### 🟡 Bug 6: Profile Page Sends camelCase to Backend

- `profile/page.tsx` sends `{ firstName, lastName, ... }` to update profile.
- Backend `user.controller.ts` reads `{ first_name, last_name, phone }` from `req.body`.
- Profile updates will silently fail (no fields matched → "No fields to update" error).

### 🔴 Bug 7: Competitions Page Always Shows Zero Competitions

**The Problem:**
- `competitions/page.tsx` fetches `/competitions?status=live` using `api.get<CompetitionsApiResponse>()`
- The fetcher types the response as `{ competitions: Competition[] }` and accesses `data?.data?.competitions`
- But the backend `getCompetitions` uses `sendPaginated()` which returns the array **directly** in `data` — NOT wrapped in a `competitions` key
- So `data.data.competitions` is always `undefined`, falling back to the empty array `[]`

**Backend returns:** `{ success: true, data: [...competitions], meta: { page, limit, total } }`
**Frontend expects:** `{ success: true, data: { competitions: [...] }, meta: ... }`

**Impact:** Competitions page always shows "0 of 0 competitions" even when database has competitions.

### 🔴 Bug 8: Dashboard Stats Use Hardcoded Mock Data

**The Problem:**
- `dashboard/page.tsx` uses 100% hardcoded mock data:
  - `MOCK_STATS = { balance: 125.50, activeTicketsCount: 27, totalWins: 3 }` — always fake
  - `MOCK_COMPETITIONS` — 3 hardcoded fake competitions (Tesla, PS5, Cash)
  - `MOCK_ACTIVITY` — 3 hardcoded fake activities
- The `StatsCards` component (balance, active tickets, wins) receives these hardcoded values
- **No API calls are made.** The dashboard never contacts the backend.

**Impact:** Dashboard always shows £125.50 balance, 27 active tickets, 3 wins — regardless of actual user data.

---

## Summary of Issues by Category

### Category A: API URL Path Issues
- Need to verify `NEXT_PUBLIC_API_URL` env var to confirm if double-prefix issue exists

### Category B: Missing Backend Endpoints
1. `GET /api/winners/my-wins` — does not exist

### Category C: Response Shape Mismatches (Frontend ↔ Backend)
1. **Competitions page** — expects `{ competitions: [] }`, gets flat array
2. Active Tickets — expects `{ tickets: [] }`, gets flat array
3. Ticket History — expects `{ history: [] }`, gets flat array
4. My Wins — route missing entirely
5. Wallet — expects combined `{ wallet, transactions }`, gets only wallet data
6. Profile — expects camelCase `User`, gets snake_case

### Category D: Field Name Convention (snake_case vs camelCase)
- All pages affected — no transformation layer between API and frontend types

### Category E: Mock/Placeholder Data
1. **Dashboard page** — balance, tickets, wins all hardcoded, not from API
