# Page Specification: My Wins Page

> **Page Route:** `/my-wins`
> **Role Access:** Authenticated User
> **Priority:** Medium
> **Spec Version:** 1.0

---

## 1. Page Overview

The My Wins page displays all prizes the user has won, including both instant wins and draw wins. Users can view prize details and claim status.

---

## 2. API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/tickets/instant-wins` | GET | Get instant wins |
| `GET /api/users/draw-wins` | GET | Get draw wins |

---

## 3. Data Models

```typescript
interface Win {
  id: string;
  type: 'instant' | 'draw';
  competitionTitle: string;
  competitionImage: string;
  prize: string;
  ticketNumber: number;
  wonAt: string;
  claimed: boolean;
  claimInstructions?: string;
}
```

---

## 4. Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  My Wins (3)                                                     │
│                                                                  │
│  ── UNCLAIMED WINS ──────────────────────────────────────────   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 🎉 Instant Win!                                          │    │
│  │ Watch Competition - £50 Cashback                         │    │
│  │ Ticket #42 - Won Jan 28, 2026                            │    │
│  │ [Claim Prize]                                            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ── CLAIMED WINS ────────────────────────────────────────────   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 🏆 Draw Win!                                              │    │
│  │ iPhone Competition - iPhone 15 Pro                        │    │
│  │ Ticket #156 - Won Jan 15, 2026 - ✅ Claimed               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Agent Task

```markdown
## Task: Build My Wins Page

### Implementation Steps
1. Create `src/app/(dashboard)/my-wins/page.tsx`
2. Fetch instant wins and draw wins
3. Group by claimed/unclaimed status
4. Build WinCard component
5. Add claim prize functionality
6. Handle empty state (no wins yet)

### Acceptance Criteria
- [ ] All wins display correctly
- [ ] Grouped by claim status
- [ ] Claim button works
- [ ] Win type badges shown
- [ ] Responsive layout
```
