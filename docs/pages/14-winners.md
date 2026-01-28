# Page Specification: Winners Page

> **Page Route:** `/winners`
> **Role Access:** Public
> **Priority:** Medium
> **Spec Version:** 1.0

---

## 1. Page Overview

The winners page showcases past competition winners, building trust and social proof. It displays winner photos, testimonials, and prize details in an engaging gallery format.

---

## 2. Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                         Header                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    🏆 Our Winners                                │
│           Real people, real prizes, real wins!                   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ FEATURED WINNERS                                         │    │
│  │ ┌──────────────────────────────────────────────────────┐│    │
│  ││  [Large Photo]                                        ││    │
│  ││                                                       ││    │
│  ││  "I couldn't believe it when I got the call..."       ││    │
│  ││                                                       ││    │
│  ││  - John D., won Porsche 911 GT3                       ││    │
│  │└──────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ── ALL WINNERS ─────────────────────────────────────────────   │
│                                                                  │
│  Filter: [All Time ▼]  [All Categories ▼]                       │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  [📷]    │  │  [📷]    │  │  [📷]    │  │  [📷]    │        │
│  │ Sarah M. │  │ Mike T.  │  │ Emma R.  │  │ James K. │        │
│  │ Rolex    │  │ MacBook  │  │ iPhone   │  │ PS5      │        │
│  │ Jan 2026 │  │ Jan 2026 │  │ Dec 2025 │  │ Dec 2025 │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  [📷]    │  │  [📷]    │  │  [📷]    │  │  [📷]    │        │
│  │ Lisa P.  │  │ David W. │  │ Anna S.  │  │ Tom B.   │        │
│  │ £5,000   │  │ Watch    │  │ Laptop   │  │ Console  │        │
│  │ Nov 2025 │  │ Nov 2025 │  │ Oct 2025 │  │ Oct 2025 │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                  │
│                       [Load More]                                │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                         Footer                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Tree

```
WinnersPage
├── Header (from layout)
├── HeroSection
│   ├── Title
│   └── Subtitle
├── FeaturedWinnersCarousel
│   └── FeaturedWinnerSlide[]
│       ├── WinnerPhoto
│       ├── Testimonial
│       └── WinnerDetails
├── WinnersGallerySection
│   ├── FilterBar
│   │   ├── TimeFilter
│   │   └── CategoryFilter
│   ├── WinnersGrid
│   │   └── WinnerCard[]
│   └── LoadMoreButton
└── Footer (from layout)
```

---

## 4. API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/winners` | GET | Get all winners |
| `GET /api/winners/featured` | GET | Get featured winners |

### Query Parameters

```typescript
interface WinnersQuery {
  page?: number;
  limit?: number;
  category?: string;
  period?: 'all' | 'month' | 'year';
}
```

---

## 5. Data Models

### Winner

```typescript
interface Winner {
  id: string;
  displayName: string; // "John D." for privacy
  competitionTitle: string;
  prizeValue: number;
  prizeImage: string;
  winnerPhoto?: string; // If provided
  testimonial?: string;
  wonDate: string;
  category: string;
  featured: boolean;
}
```

---

## 6. State Management

```typescript
// Featured winners
const { data: featured } = useSWR('/api/winners/featured');

// All winners with pagination
const [page, setPage] = useState(1);
const [filters, setFilters] = useState({ period: 'all', category: '' });
const queryParams = new URLSearchParams({ page, ...filters });
const { data: winners, isLoading } = useSWR(`/api/winners?${queryParams}`);

// Infinite scroll or load more
const loadMore = () => setPage(prev => prev + 1);
```

---

## 7. Featured Winner Card (Large)

```
┌────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌─────────────────────┐                                       │
│  │                     │  "I've entered competitions for        │
│  │    [Winner Photo]   │  years but never won anything. When   │
│  │                     │  I got the call saying I'd won the    │
│  │                     │  Porsche, I thought it was a prank!"   │
│  │                     │                                        │
│  └─────────────────────┘  - John D.                             │
│                           Won: Porsche 911 GT3                  │
│                           Worth: £150,000                       │
│                           Date: January 15, 2026                │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## 8. Winner Card (Grid)

```typescript
interface WinnerCardProps {
  winner: Winner;
  onClick?: () => void;
}

// Display:
// - Photo (prize or winner)
// - Winner name (masked)
// - Prize name
// - Date won
// - Click to view testimonial (modal)
```

---

## 9. Responsive Behavior

| Breakpoint | Grid Columns | Featured Cards |
|------------|--------------|----------------|
| Mobile (<640px) | 2 | 1 full width |
| Tablet (640-1024px) | 3 | 1 full width |
| Desktop (>1024px) | 4 | Carousel |

---

## 10. Agent Task

```markdown
## Task: Build Winners Page

You are assigned to build the Winners Page (/winners).

### Prerequisites
1. Read .ai/context.md
2. Ensure layout components exist
3. Verify winners API endpoints work

### Implementation Steps
1. Create `src/app/(public)/winners/page.tsx`
2. Build HeroSection with title
3. Create FeaturedWinnersCarousel
4. Implement FeaturedWinnerSlide with testimonial
5. Build WinnersGrid with filter bar
6. Create WinnerCard component
7. Add Load More pagination
8. Handle empty state
9. Add SEO meta tags

### Acceptance Criteria
- [ ] Featured winners carousel works
- [ ] Winners grid displays correctly
- [ ] Filters work
- [ ] Pagination loads more
- [ ] Testimonials display properly
- [ ] Responsive on all devices
- [ ] Privacy preserved (masked names)

### After Completion
Update .ai/context.md with your changes.
```

---

## 11. SEO Requirements

```html
<title>Our Winners | Real People Winning Real Prizes | RaffleSite</title>
<meta name="description" content="Meet our lucky winners! Browse testimonials and photos from people who have won amazing prizes in our competitions." />
```

---

## 12. Privacy Considerations

- Always use masked names: "John D." not "John Doe"
- Winner photos are optional (use prize image if none)
- Testimonials require winner consent
- Don't display email or full personal details
