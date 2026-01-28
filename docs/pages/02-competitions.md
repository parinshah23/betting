# Page Specification: Competition Listing Page

> **Page Route:** `/competitions`
> **Role Access:** Public (No authentication required)
> **Priority:** High
> **Spec Version:** 1.0

---

## 1. Page Overview

The competitions listing page displays all available raffles with filtering and sorting capabilities. Users can browse competitions by status, category, and price range.

---

## 2. Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                         Header                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Page Title: "All Competitions"                                  │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Filters Bar                                              │    │
│  │ [Live] [Ending Soon] [Sold Out] [Completed]    [Sort ▼] │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │   Card   │  │   Card   │  │   Card   │  │   Card   │        │
│  │          │  │          │  │          │  │          │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │   Card   │  │   Card   │  │   Card   │  │   Card   │        │
│  │          │  │          │  │          │  │          │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │           Pagination: [1] [2] [3] ... [10]              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                         Footer                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Tree

```
CompetitionsPage
├── Header (from layout)
├── PageHeader
│   └── Title + Breadcrumbs
├── FiltersBar
│   ├── StatusTabs
│   │   └── TabButton[] (Live, Ending Soon, Sold Out, Completed)
│   ├── CategoryFilter (dropdown)
│   └── SortDropdown
├── CompetitionGrid
│   └── CompetitionCard[]
├── EmptyState (conditional)
├── Pagination
└── Footer (from layout)
```

---

## 4. API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/competitions` | GET | Fetch paginated competitions |

### Query Parameters

```typescript
interface CompetitionsQuery {
  status?: 'live' | 'ending_soon' | 'sold_out' | 'completed';
  category?: string;
  sort?: 'newest' | 'ending_soon' | 'price_low' | 'price_high';
  page?: number;
  limit?: number; // default 12
}
```

---

## 5. Data Models

### API Response

```typescript
interface CompetitionsResponse {
  success: true;
  data: CompetitionCard[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CompetitionCard {
  id: string;
  title: string;
  slug: string;
  ticketPrice: number;
  totalTickets: number;
  soldTickets: number;
  primaryImage: string;
  endDate: string;
  category: string;
  status: 'live' | 'ended' | 'sold_out' | 'completed';
}
```

---

## 6. State Management

```typescript
// URL State (searchParams)
const searchParams = useSearchParams();
const status = searchParams.get('status') || 'live';
const category = searchParams.get('category') || '';
const sort = searchParams.get('sort') || 'newest';
const page = parseInt(searchParams.get('page') || '1');

// Data Fetching
const queryString = new URLSearchParams({ status, category, sort, page: page.toString() });
const { data, isLoading, error } = useSWR(`/api/competitions?${queryString}`);

// Filter Change Handler
const updateFilter = (key: string, value: string) => {
  const params = new URLSearchParams(searchParams);
  params.set(key, value);
  params.set('page', '1'); // Reset to page 1
  router.push(`/competitions?${params.toString()}`);
};
```

---

## 7. UI States

### Loading State
- Show skeleton grid (12 skeleton cards)
- Filters remain interactive

### Empty State (No Results)
```
┌────────────────────────────────────┐
│         🎯 No Competitions         │
│                                    │
│  No competitions match your        │
│  filters. Try adjusting your       │
│  search or check back later.       │
│                                    │
│       [Clear Filters]              │
└────────────────────────────────────┘
```

### Error State
- Show error message with retry button
- Keep filters visible

---

## 8. Filter Tabs Behavior

| Tab | API Query | Description |
|-----|-----------|-------------|
| Live | `status=live` | Competitions open for entries |
| Ending Soon | `status=live&ending_soon=true` | Ending within 24 hours |
| Sold Out | `status=sold_out` | All tickets sold, awaiting draw |
| Completed | `status=completed` | Draw completed, winner announced |

---

## 9. Sorting Options

| Option | API Value | Description |
|--------|-----------|-------------|
| Newest First | `newest` | Most recently created |
| Ending Soon | `ending_soon` | Closest end date |
| Price: Low to High | `price_low` | Cheapest tickets first |
| Price: High to Low | `price_high` | Most expensive first |

---

## 10. Responsive Behavior

| Breakpoint | Grid Columns | Filters Layout |
|------------|--------------|----------------|
| Mobile (<640px) | 1 | Stacked, collapsible |
| Tablet (640-1024px) | 2 | Horizontal row |
| Desktop (>1024px) | 3-4 | Horizontal row |

---

## 11. SEO Requirements

```html
<title>Browse Competitions | RaffleSite</title>
<meta name="description" content="Browse all live raffle competitions. Enter now for your chance to win amazing prizes!" />

<!-- Dynamic based on filter -->
<title>Live Competitions | RaffleSite</title>
<title>Ending Soon - Hurry! | RaffleSite</title>
```

---

## 12. Agent Task

```markdown
## Task: Build Competition Listing Page

You are assigned to build the Competition Listing Page (/competitions).

### Prerequisites
1. Read .ai/context.md
2. Ensure CompetitionCard component exists
3. Ensure Pagination component exists
4. Verify GET /api/competitions endpoint is working

### Implementation Steps
1. Create `src/app/(public)/competitions/page.tsx`
2. Implement FiltersBar with status tabs
3. Add category dropdown filter
4. Add sort dropdown
5. Implement URL-based state management
6. Create CompetitionGrid with responsive layout
7. Add pagination component
8. Implement loading skeletons
9. Add empty state for no results
10. Add SEO meta tags

### Acceptance Criteria
- [ ] All filter tabs work correctly
- [ ] URL updates when filters change
- [ ] Page persists filter state on refresh
- [ ] Pagination works correctly
- [ ] Responsive on all screen sizes
- [ ] Loading states are smooth

### After Completion
Update .ai/context.md with your changes.
```

---

## 13. Component Specifications

### FiltersBar

```typescript
interface FiltersBarProps {
  currentStatus: string;
  currentCategory: string;
  currentSort: string;
  categories: string[];
  onFilterChange: (key: string, value: string) => void;
}
```

### Pagination

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Features:
// - Show max 5 page numbers
// - Show ellipsis for large ranges
// - Previous/Next buttons
// - Disabled state for first/last
```

---

## 14. URL Structure

```
/competitions                          # Default: live, newest
/competitions?status=live              # Filter by status
/competitions?status=live&sort=price_low
/competitions?status=ending_soon&page=2
/competitions?category=watches&sort=newest
```
