# Page Specification: My Tickets Page

> **Page Route:** `/tickets`
> **Role Access:** Authenticated User
> **Priority:** High
> **Spec Version:** 1.0

---

## 1. Page Overview

The tickets page displays all tickets the user has purchased, organized by competition. Users can view active entries, check ticket numbers, and access their entry history.

---

## 2. Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                         Header                                   │
├────────────────┬────────────────────────────────────────────────┤
│                │                                                 │
│   Sidebar      │  My Tickets                                     │
│                │                                                 │
│                │  [Active Tickets] [History]                     │
│                │                                                 │
│                │  ── ACTIVE ENTRIES ──────────────────────────   │
│                │                                                 │
│                │  ┌─────────────────────────────────────────┐   │
│                │  │ 🏎️ Porsche 911 GT3 Competition          │   │
│                │  │                                          │   │
│                │  │ Draw Date: Feb 15, 2026                  │   │
│                │  │ ⏱️ 5d 12h 30m remaining                   │   │
│                │  │                                          │   │
│                │  │ Your Tickets (12):                       │   │
│                │  │ [142] [143] [144] [567] [568] [569]      │   │
│                │  │ [890] [891] [892] [1001] [1002] [1003]   │   │
│                │  │                                          │   │
│                │  │                    [View Competition]    │   │
│                │  └─────────────────────────────────────────┘   │
│                │                                                 │
│                │  ┌─────────────────────────────────────────┐   │
│                │  │ ⌚ Rolex Submariner Draw                 │   │
│                │  │                                          │   │
│                │  │ Draw Date: Feb 20, 2026                  │   │
│                │  │ ⏱️ 10d 6h 15m remaining                   │   │
│                │  │                                          │   │
│                │  │ Your Tickets (5):                        │   │
│                │  │ [45] [46] [47] [48] [49]                 │   │
│                │  │                                          │   │
│                │  │                    [View Competition]    │   │
│                │  └─────────────────────────────────────────┘   │
│                │                                                 │
│                │  Showing 2 of 2 active competitions             │
│                │                                                 │
├────────────────┴────────────────────────────────────────────────┤
│                         Footer                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Tree

```
MyTicketsPage
├── DashboardLayout
├── PageHeader
├── TabNavigation
│   ├── ActiveTab
│   └── HistoryTab
├── ActiveTicketsView (default)
│   ├── CompetitionTicketCard[]
│   │   ├── CompetitionHeader
│   │   │   ├── Image
│   │   │   ├── Title
│   │   │   ├── DrawDate
│   │   │   └── Countdown
│   │   ├── TicketNumberGrid
│   │   │   └── TicketNumber[]
│   │   └── ViewCompetitionLink
│   └── EmptyState
├── HistoryView (tab)
│   ├── CompetitionHistoryCard[]
│   │   ├── CompetitionHeader
│   │   ├── Result (Won/Lost)
│   │   ├── TicketNumbers
│   │   └── WinningNumber (if completed)
│   ├── Pagination
│   └── EmptyState
└── Footer
```

---

## 4. API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/tickets/my-tickets?status=active` | GET | Get active tickets |
| `GET /api/tickets/history` | GET | Get ticket history |

---

## 5. Data Models

### Active Tickets Response

```typescript
interface MyTicketsResponse {
  competitions: CompetitionTickets[];
  totalTickets: number;
}

interface CompetitionTickets {
  competitionId: string;
  competitionTitle: string;
  competitionSlug: string;
  competitionImage: string;
  endDate: string;
  drawDate: string;
  status: 'live' | 'ended' | 'completed';
  tickets: TicketInfo[];
  winningNumber?: number; // Only for completed
  isWinner?: boolean;
}

interface TicketInfo {
  id: string;
  ticketNumber: number;
  isInstantWin: boolean;
  instantWinPrize?: string;
  purchasedAt: string;
}
```

### History Response

```typescript
interface HistoryResponse {
  entries: HistoryEntry[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

interface HistoryEntry {
  competitionId: string;
  competitionTitle: string;
  competitionImage: string;
  drawDate: string;
  completedAt: string;
  ticketCount: number;
  ticketNumbers: number[];
  winningNumber: number;
  result: 'won' | 'lost';
  prize?: string;
}
```

---

## 6. State Management

```typescript
// Tab state
const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

// Active tickets
const { data: activeTickets, isLoading: activeLoading } = useSWR(
  '/api/tickets/my-tickets?status=active'
);

// History with pagination
const [historyPage, setHistoryPage] = useState(1);
const { data: history, isLoading: historyLoading } = useSWR(
  activeTab === 'history' ? `/api/tickets/history?page=${historyPage}` : null
);
```

---

## 7. UI States

### Loading State
- Skeleton cards for competitions
- Skeleton chips for ticket numbers

### Empty States

**No Active Tickets:**
```
┌────────────────────────────────────┐
│       🎟️ No Active Tickets         │
│                                    │
│   You don't have any tickets for   │
│   upcoming draws.                  │
│                                    │
│   [Browse Competitions]            │
└────────────────────────────────────┘
```

**No History:**
```
┌────────────────────────────────────┐
│       📜 No History Yet            │
│                                    │
│   Your completed competition       │
│   entries will appear here.        │
└────────────────────────────────────┘
```

---

## 8. Ticket Number Display

```typescript
// Ticket number chip styles
const getTicketStyle = (ticket: TicketInfo, competition: CompetitionTickets) => {
  if (competition.isWinner && ticket.ticketNumber === competition.winningNumber) {
    return 'bg-green-500 text-white'; // Winner!
  }
  if (ticket.isInstantWin) {
    return 'bg-yellow-400 text-black'; // Instant win
  }
  return 'bg-gray-100 text-gray-800'; // Normal
};

// Display as grid of chips
// Collapse if more than 20 tickets: "Show all 50 tickets"
```

---

## 9. Competition Status Indicators

| Status | Display |
|--------|---------|
| Live | Green badge + countdown |
| Ended | Orange badge + "Awaiting draw" |
| Completed (won) | Gold badge + winning ticket highlighted |
| Completed (lost) | Gray badge + "Better luck next time" |

---

## 10. History Entry Display

```
┌─────────────────────────────────────────┐
│ 🏆 Luxury Watch Competition             │
│                                         │
│ Drawn: Jan 15, 2026                     │
│ Your tickets: 23, 45, 67, 89, 101       │
│ Winning number: 234                     │
│                                         │
│ Result: ❌ Not a winner                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🏆 MacBook Pro Raffle                   │
│                                         │
│ Drawn: Jan 10, 2026                     │
│ Your tickets: 156, 157, 158             │
│ Winning number: 157                     │
│                                         │
│ Result: 🎉 YOU WON!                      │
│ Prize: MacBook Pro 16"                   │
└─────────────────────────────────────────┘
```

---

## 11. Agent Task

```markdown
## Task: Build My Tickets Page

You are assigned to build the My Tickets Page (/tickets).

### Prerequisites
1. Read .ai/context.md
2. Ensure DashboardLayout exists
3. Verify tickets APIs work

### Implementation Steps
1. Create `src/app/(dashboard)/tickets/page.tsx`
2. Implement TabNavigation component
3. Build CompetitionTicketCard for active view
4. Create TicketNumberGrid component
5. Implement HistoryView with results
6. Add pagination for history
7. Handle loading and empty states
8. Style winner/instant-win tickets specially

### Acceptance Criteria
- [ ] Tab switching works
- [ ] Active tickets grouped by competition
- [ ] Ticket numbers display correctly
- [ ] Countdown timers work
- [ ] History shows past entries
- [ ] Winner status highlighted
- [ ] Pagination works
- [ ] Responsive layout

### After Completion
Update .ai/context.md with your changes.
```

---

## 12. Component Specifications

### CompetitionTicketCard

```typescript
interface CompetitionTicketCardProps {
  competition: CompetitionTickets;
  variant: 'active' | 'history';
}

// Features:
// - Competition image
// - Title and draw date
// - Countdown (if active)
// - Ticket number grid
// - Winner highlight (if completed)
// - Link to competition
```

### TicketNumber

```typescript
interface TicketNumberProps {
  number: number;
  isWinner?: boolean;
  isInstantWin?: boolean;
  size?: 'sm' | 'md';
}

// Display:
// - Number in chip/badge style
// - Color coding based on status
// - Tooltip for instant win prize
```
