# Page Specification: Admin Dashboard

> **Page Route:** `/admin`
> **Role Access:** Admin Only
> **Priority:** High
> **Spec Version:** 1.0

---

## 1. Page Overview

The admin dashboard provides a high-level overview of platform performance, recent activity, and quick access to management functions. It's the control center for platform administrators.

---

## 2. Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                         Admin Header                             │
├────────────────┬────────────────────────────────────────────────┤
│                │                                                 │
│  Admin         │  Dashboard Overview                             │
│  Sidebar       │                                                 │
│                │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────┐ │
│  Dashboard     │  │ REVENUE │ │ ORDERS  │ │ USERS   │ │TICKETS│ │
│  Competitions  │  │ £12,450 │ │   156   │ │  1,234  │ │ 5,670 │ │
│  Users         │  │ +15%    │ │ +8%     │ │ +12%    │ │ +22%  │ │
│  Orders        │  └─────────┘ └─────────┘ └─────────┘ └───────┘ │
│  Draws         │                                                 │
│  Content       │  ┌─────────────────────────────────────────┐   │
│  ─────────     │  │ ACTIVE COMPETITIONS                      │   │
│  Settings      │  │                                          │   │
│                │  │ Competition        Sold    Progress      │   │
│                │  │ ───────────────────────────────────────  │   │
│                │  │ Porsche GT3       450/1000  ██████░░ 45% │   │
│                │  │ Rolex Watch       890/1000  █████████ 89%│   │
│                │  │ MacBook Pro       200/500   ████░░░░ 40% │   │
│                │  │                                          │   │
│                │  │                    [Manage Competitions]  │   │
│                │  └─────────────────────────────────────────┘   │
│                │                                                 │
│                │  ┌──────────────────────┬──────────────────┐   │
│                │  │ RECENT ORDERS        │ PENDING DRAWS    │   │
│                │  │                      │                  │   │
│                │  │ #ORD-1234 - £45.00   │ Rolex Watch      │   │
│                │  │ John D. - 2m ago     │ Ends in 2 hours  │   │
│                │  │                      │ [Run Draw]       │   │
│                │  │ #ORD-1233 - £25.00   │                  │   │
│                │  │ Sarah M. - 5m ago    │ Car Competition  │   │
│                │  │                      │ Ends tomorrow    │   │
│                │  │ [View All Orders]    │ [View All Draws] │   │
│                │  └──────────────────────┴──────────────────┘   │
│                │                                                 │
├────────────────┴────────────────────────────────────────────────┤
│                         Footer                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Tree

```
AdminDashboardPage
├── AdminLayout
│   ├── AdminHeader
│   │   ├── Logo
│   │   ├── SearchBar
│   │   ├── NotificationBell
│   │   └── AdminProfile
│   └── AdminSidebar
│       ├── NavItem: Dashboard
│       ├── NavItem: Competitions
│       ├── NavItem: Users
│       ├── NavItem: Orders
│       ├── NavItem: Draws
│       ├── NavItem: Content
│       └── NavItem: Settings
├── PageHeader
├── StatsGrid
│   ├── StatCard (Revenue)
│   ├── StatCard (Orders)
│   ├── StatCard (Users)
│   └── StatCard (Tickets)
├── ActiveCompetitionsTable
├── TwoColumnSection
│   ├── RecentOrdersPanel
│   └── PendingDrawsPanel
└── Footer
```

---

## 4. API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/admin/stats` | GET | Get dashboard statistics |
| `GET /api/admin/competitions?status=live&limit=5` | GET | Get active competitions |
| `GET /api/admin/orders?limit=5` | GET | Get recent orders |
| `GET /api/admin/draws/pending` | GET | Get pending draws |

---

## 5. Data Models

### Dashboard Stats

```typescript
interface AdminDashboardStats {
  revenue: {
    total: number;
    change: number; // Percentage change from last period
    period: 'today' | 'week' | 'month';
  };
  orders: {
    total: number;
    change: number;
  };
  users: {
    total: number;
    newThisPeriod: number;
    change: number;
  };
  tickets: {
    soldToday: number;
    soldThisWeek: number;
    change: number;
  };
}
```

### Active Competition Summary

```typescript
interface CompetitionSummary {
  id: string;
  title: string;
  totalTickets: number;
  soldTickets: number;
  revenue: number;
  endDate: string;
  status: 'live' | 'ended';
}
```

### Pending Draw

```typescript
interface PendingDraw {
  competitionId: string;
  competitionTitle: string;
  endDate: string;
  ticketsSold: number;
  isReady: boolean; // Has ended and ready for draw
}
```

---

## 6. State Management

```typescript
// Parallel data fetching
const { data: stats } = useSWR('/api/admin/stats');
const { data: competitions } = useSWR('/api/admin/competitions?status=live&limit=5');
const { data: recentOrders } = useSWR('/api/admin/orders?limit=5');
const { data: pendingDraws } = useSWR('/api/admin/draws/pending');

// Period filter for stats
const [statsPeriod, setStatsPeriod] = useState<'today' | 'week' | 'month'>('today');
```

---

## 7. Stats Cards

### Revenue Card
- Display total revenue for period
- Show percentage change (green/red arrow)
- Click to go to Orders page with revenue report

### Orders Card
- Show order count for period
- Percentage change indicator
- Click to go to Orders management

### Users Card
- Total registered users
- New users this period
- Click to go to Users management

### Tickets Card
- Tickets sold in period
- Trend indicator
- Click for detailed report

---

## 8. Active Competitions Table

```typescript
// Columns
const columns = [
  { key: 'title', label: 'Competition' },
  { key: 'sold', label: 'Sold', render: (c) => `${c.soldTickets}/${c.totalTickets}` },
  { key: 'progress', label: 'Progress', render: (c) => <ProgressBar value={c.soldTickets/c.totalTickets * 100} /> },
  { key: 'revenue', label: 'Revenue', render: (c) => `£${c.revenue.toFixed(2)}` },
  { key: 'ends', label: 'Ends', render: (c) => formatRelative(c.endDate) },
];
```

---

## 9. Quick Actions

### From Recent Orders Panel
- View order details
- Issue refund
- Contact customer

### From Pending Draws Panel
- Run draw immediately
- Export entries
- View competition

---

## 10. Agent Task

```markdown
## Task: Build Admin Dashboard Page

You are assigned to build the Admin Dashboard Page (/admin).

### Prerequisites
1. Read .ai/context.md
2. Ensure AdminLayout with sidebar exists
3. Ensure admin auth middleware works
4. Verify admin API endpoints work

### Implementation Steps
1. Create `src/app/(admin)/admin/page.tsx`
2. Build StatsGrid with 4 stat cards
3. Create ActiveCompetitionsTable
4. Build RecentOrdersPanel
5. Create PendingDrawsPanel
6. Add period filter for stats
7. Implement quick action buttons
8. Add loading states

### Acceptance Criteria
- [ ] Stats display correctly
- [ ] Stats show period comparison
- [ ] Active competitions table works
- [ ] Recent orders show correctly
- [ ] Pending draws with actions
- [ ] Quick actions work
- [ ] Responsive layout
- [ ] Only accessible to admins

### After Completion
Update .ai/context.md with your changes.
```

---

## 11. Component Specifications

### AdminStatCard

```typescript
interface AdminStatCardProps {
  title: string;
  value: string | number;
  change: number; // Percentage
  icon: ReactNode;
  href: string;
}

// Display:
// - Large value
// - Title below
// - Change indicator (arrow + percentage)
// - Icon
// - Clickable to detailed page
```

### CompetitionsTable

```typescript
interface CompetitionsTableProps {
  competitions: CompetitionSummary[];
  onManage: (id: string) => void;
}

// Features:
// - Sortable columns
// - Progress bars
// - Quick actions
// - Link to full management
```

### PendingDrawCard

```typescript
interface PendingDrawCardProps {
  draw: PendingDraw;
  onRunDraw: (id: string) => void;
  onExport: (id: string) => void;
}

// Display:
// - Competition name
// - Time until/since end
// - "Run Draw" button (if ready)
// - Export entries button
```

---

## 12. Security Considerations

- Verify admin role on every API call
- Log all admin actions for audit
- Rate limit sensitive operations
- Show confirmation for destructive actions
