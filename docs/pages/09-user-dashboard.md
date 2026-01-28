# Page Specification: User Dashboard

> **Page Route:** `/dashboard`
> **Role Access:** Authenticated User
> **Priority:** High
> **Spec Version:** 1.0

---

## 1. Page Overview

The user dashboard is the central hub for logged-in users. It displays a summary of their activity, wallet balance, active tickets, recent wins, and quick actions.

---

## 2. Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                         Header                                   │
├────────────────┬────────────────────────────────────────────────┤
│                │                                                 │
│                │  Welcome back, {FirstName}!                     │
│   Sidebar      │                                                 │
│                │  ┌────────────┐ ┌────────────┐ ┌────────────┐  │
│   Dashboard    │  │  WALLET    │ │  ACTIVE    │ │   WINS     │  │
│   Profile      │  │  £125.50   │ │  TICKETS   │ │   3 Total  │  │
│   Wallet       │  │  [Top Up]  │ │     27     │ │  [View]    │  │
│   Tickets      │  └────────────┘ └────────────┘ └────────────┘  │
│   My Wins      │                                                 │
│   ──────────   │  ┌─────────────────────────────────────────┐   │
│   Logout       │  │ ACTIVE COMPETITIONS                      │   │
│                │  │                                          │   │
│                │  │ ┌─────────┐ ┌─────────┐ ┌─────────┐     │   │
│                │  │ │  Card   │ │  Card   │ │  Card   │     │   │
│                │  │ │ 5 tix   │ │ 12 tix  │ │ 10 tix  │     │   │
│                │  │ └─────────┘ └─────────┘ └─────────┘     │   │
│                │  │                                          │   │
│                │  │                    [View All Tickets]    │   │
│                │  └─────────────────────────────────────────┘   │
│                │                                                 │
│                │  ┌─────────────────────────────────────────┐   │
│                │  │ RECENT ACTIVITY                          │   │
│                │  │                                          │   │
│                │  │ • Purchased 5 tickets for Watch Draw     │   │
│                │  │ • Won £50 Instant Prize!                 │   │
│                │  │ • Added £100 to wallet                   │   │
│                │  │                                          │   │
│                │  └─────────────────────────────────────────┘   │
│                │                                                 │
├────────────────┴────────────────────────────────────────────────┤
│                         Footer                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Tree

```
DashboardPage
├── DashboardLayout
│   ├── Header
│   └── Sidebar
│       ├── NavItem: Dashboard (active)
│       ├── NavItem: Profile
│       ├── NavItem: Wallet
│       ├── NavItem: Tickets
│       ├── NavItem: My Wins
│       └── LogoutButton
├── WelcomeHeader
├── StatsCards
│   ├── WalletCard
│   ├── ActiveTicketsCard
│   └── WinsCard
├── ActiveCompetitionsSection
│   ├── SectionHeader
│   ├── CompetitionCardGrid
│   │   └── DashboardCompetitionCard[]
│   └── ViewAllLink
├── RecentActivitySection
│   ├── SectionHeader
│   └── ActivityList
│       └── ActivityItem[]
└── Footer
```

---

## 4. API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/users/profile` | GET | Get user info |
| `GET /api/wallet` | GET | Get wallet balance |
| `GET /api/tickets/my-tickets?status=active&limit=6` | GET | Get active tickets |
| `GET /api/tickets/instant-wins?limit=5` | GET | Get instant wins count |
| `GET /api/orders?limit=10` | GET | Get recent activity |

---

## 5. Data Models

### Dashboard Data

```typescript
interface DashboardData {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  wallet: {
    balance: number;
  };
  stats: {
    activeTickets: number;
    totalWins: number;
    pendingDraws: number;
  };
  activeCompetitions: ActiveCompetition[];
  recentActivity: ActivityItem[];
}

interface ActiveCompetition {
  competitionId: string;
  competitionTitle: string;
  competitionSlug: string;
  competitionImage: string;
  ticketCount: number;
  endDate: string;
  status: 'live' | 'ended';
}

interface ActivityItem {
  id: string;
  type: 'ticket_purchase' | 'instant_win' | 'wallet_deposit' | 'draw_win' | 'order';
  description: string;
  amount?: number;
  timestamp: string;
  link?: string;
}
```

---

## 6. State Management

```typescript
// Parallel data fetching
const { data: profile } = useSWR('/api/users/profile');
const { data: wallet } = useSWR('/api/wallet');
const { data: activeTickets } = useSWR('/api/tickets/my-tickets?status=active&limit=6');
const { data: stats } = useSWR('/api/dashboard/stats');
const { data: activity } = useSWR('/api/orders?limit=10');

// Derived data
const dashboardData = {
  user: profile,
  wallet,
  stats,
  activeCompetitions: groupTicketsByCompetition(activeTickets),
  recentActivity: formatActivity(activity),
};
```

---

## 7. UI States

### Loading State
- Show skeleton cards for stats
- Show skeleton list for activity
- Keep sidebar visible

### Empty States

**No Active Tickets:**
```
┌────────────────────────────────────┐
│   🎟️ No Active Tickets             │
│                                    │
│   You haven't entered any          │
│   competitions yet.                │
│                                    │
│   [Browse Competitions]            │
└────────────────────────────────────┘
```

**No Recent Activity:**
```
┌────────────────────────────────────┐
│   📋 No Recent Activity            │
│                                    │
│   Your activity will appear here   │
│   once you start participating.    │
└────────────────────────────────────┘
```

---

## 8. Stats Cards Behavior

### Wallet Card
- Shows current balance
- "Top Up" button links to /wallet
- Color: Brand primary

### Active Tickets Card
- Shows total tickets across all active competitions
- Clicking navigates to /tickets
- Shows countdown to nearest draw

### Wins Card
- Shows total wins (instant + draw)
- "View" button links to /my-wins
- Highlight if unviewed wins

---

## 9. Active Competitions Grid

```typescript
// Group tickets by competition
const groupTicketsByCompetition = (tickets) => {
  return Object.values(
    tickets.reduce((acc, ticket) => {
      if (!acc[ticket.competitionId]) {
        acc[ticket.competitionId] = {
          ...ticket,
          ticketCount: 0,
        };
      }
      acc[ticket.competitionId].ticketCount++;
      return acc;
    }, {})
  );
};

// Display max 6 competitions
// Show "View All" if more than 6
```

---

## 10. Responsive Behavior

| Breakpoint | Sidebar | Stats Grid |
|------------|---------|------------|
| Mobile (<768px) | Bottom nav | 1 column |
| Tablet (768-1024px) | Collapsible | 2 columns |
| Desktop (>1024px) | Fixed left | 3 columns |

---

## 11. Agent Task

```markdown
## Task: Build User Dashboard Page

You are assigned to build the User Dashboard Page (/dashboard).

### Prerequisites
1. Read .ai/context.md
2. Ensure DashboardLayout with sidebar exists
3. Ensure auth middleware protects route
4. Verify all dashboard APIs work

### Implementation Steps
1. Create `src/app/(dashboard)/dashboard/page.tsx`
2. Build WelcomeHeader component
3. Create StatsCards (Wallet, Tickets, Wins)
4. Build ActiveCompetitionsSection
5. Create DashboardCompetitionCard variant
6. Implement RecentActivitySection
7. Add loading skeletons
8. Handle empty states
9. Ensure responsive layout

### Acceptance Criteria
- [ ] Stats display correctly
- [ ] Active competitions show with ticket counts
- [ ] Recent activity shows chronologically
- [ ] Navigation to other dashboard pages works
- [ ] Responsive on all devices
- [ ] Empty states display appropriately

### After Completion
Update .ai/context.md with your changes.
```

---

## 12. Component Specifications

### StatsCard

```typescript
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  action?: {
    label: string;
    href: string;
  };
  variant?: 'primary' | 'secondary' | 'accent';
}
```

### DashboardCompetitionCard

```typescript
interface DashboardCompetitionCardProps {
  competition: ActiveCompetition;
}

// Display:
// - Competition image (small)
// - Title
// - "X tickets" badge
// - Countdown to draw
// - Click to view competition
```

### ActivityItem

```typescript
interface ActivityItemProps {
  activity: ActivityItem;
}

// Display:
// - Icon based on type
// - Description
// - Timestamp (relative: "2 hours ago")
// - Amount (if applicable)
// - Link (if applicable)
```
