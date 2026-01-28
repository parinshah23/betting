# Page Specification: Home Page

> **Page Route:** `/`
> **Role Access:** Public (No authentication required)
> **Priority:** High
> **Spec Version:** 1.0

---

## 1. Page Overview

The home page is the primary landing page for the raffle platform. It showcases featured competitions, highlights recent winners, and provides clear CTAs for user engagement.

---

## 2. Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                         Header                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                      Hero Slider                                 │
│              (Featured Competitions Carousel)                    │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Section: "Live Competitions"                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │   Card   │  │   Card   │  │   Card   │  │   Card   │        │
│  │          │  │          │  │          │  │          │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                  │
│                    [View All Competitions]                       │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Section: "Ending Soon" (Urgency Cards)                         │
│  ┌──────────────────────┐  ┌──────────────────────┐             │
│  │  Countdown Timer     │  │  Countdown Timer     │             │
│  └──────────────────────┘  └──────────────────────┘             │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Section: "Recent Winners"                                       │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                        │
│  │Winner│  │Winner│  │Winner│  │Winner│                        │
│  └──────┘  └──────┘  └──────┘  └──────┘                        │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Section: "How It Works" (3-step explainer)                     │
│  [1. Browse]    [2. Answer & Buy]    [3. Win!]                  │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                         Footer                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Tree

```
HomePage
├── Header (from layout)
├── HeroSlider
│   └── HeroSlide[] (max 5)
├── Section: LiveCompetitions
│   ├── SectionHeader
│   ├── CompetitionGrid
│   │   └── CompetitionCard[] (max 8)
│   └── ViewAllButton
├── Section: EndingSoon
│   ├── SectionHeader
│   └── UrgencyCardGrid
│       └── UrgencyCard[] (max 4)
├── Section: RecentWinners
│   ├── SectionHeader
│   └── WinnersCarousel
│       └── WinnerCard[]
├── Section: HowItWorks
│   └── StepCard[] (3 steps)
└── Footer (from layout)
```

---

## 4. API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/competitions/featured` | GET | Fetch featured competitions for hero slider |
| `/api/competitions?status=live&limit=8` | GET | Fetch live competitions for grid |
| `/api/competitions?status=live&ending_soon=true&limit=4` | GET | Fetch competitions ending soon |
| `/api/winners/recent?limit=8` | GET | Fetch recent winners |

---

## 5. Data Models

### Featured Competition (Hero Slider)

```typescript
interface FeaturedCompetition {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  prizeValue: number;
  ticketPrice: number;
  primaryImage: string;
  endDate: string; // ISO date
}
```

### Competition Card

```typescript
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
}
```

### Winner Card

```typescript
interface WinnerCard {
  id: string;
  displayName: string; // "John D."
  prizeName: string;
  prizeImage: string;
  wonDate: string;
}
```

---

## 6. State Management

```typescript
// Client-side state (SWR or React Query)
const { data: featured, isLoading: featuredLoading } = useSWR('/api/competitions/featured');
const { data: liveComps, isLoading: compsLoading } = useSWR('/api/competitions?status=live&limit=8');
const { data: endingSoon } = useSWR('/api/competitions?status=live&ending_soon=true&limit=4');
const { data: winners } = useSWR('/api/winners/recent?limit=8');
```

---

## 7. UI States

### Loading State
- Show skeleton loaders for:
  - Hero slider (full-width skeleton)
  - Competition cards (grid of skeleton cards)
  - Winner cards (skeleton avatars)

### Empty State
- If no live competitions: Show "Coming Soon" message with email signup
- If no winners yet: Show "Be the first winner!" message

### Error State
- Show friendly error message with retry button
- Log error to monitoring service

---

## 8. Responsive Behavior

| Breakpoint | Grid Columns | Hero Height |
|------------|--------------|-------------|
| Mobile (<640px) | 1 | 300px |
| Tablet (640-1024px) | 2 | 400px |
| Desktop (>1024px) | 4 | 500px |

---

## 9. SEO Requirements

```html
<title>Win Amazing Prizes | RaffleSite - Online Competitions</title>
<meta name="description" content="Enter our exciting online raffles and win incredible prizes. Browse live competitions, purchase tickets, and become our next winner!" />
<meta property="og:title" content="Win Amazing Prizes | RaffleSite" />
<meta property="og:description" content="Enter our exciting online raffles..." />
<meta property="og:image" content="/images/og-image.jpg" />
```

---

## 10. Agent Task

```markdown
## Task: Build Home Page

You are assigned to build the Home Page (/).

### Prerequisites
1. Read .ai/context.md
2. Ensure Header and Footer components exist
3. Ensure CompetitionCard component exists
4. Ensure API endpoints are working

### Implementation Steps
1. Create `src/app/page.tsx`
2. Implement HeroSlider component with Swiper.js
3. Create LiveCompetitions section with CompetitionGrid
4. Create EndingSoon section with countdown timers
5. Create RecentWinners carousel
6. Create HowItWorks static section
7. Add loading skeletons for all data sections
8. Implement responsive grid layouts
9. Add SEO meta tags

### Acceptance Criteria
- [ ] Hero slider shows featured competitions
- [ ] Live competitions grid displays correctly
- [ ] Countdown timers work and update in real-time
- [ ] Winners carousel is scrollable
- [ ] All sections are responsive
- [ ] Loading states are smooth

### After Completion
Update .ai/context.md with your changes.
```

---

## 11. Component Specifications

### HeroSlider

```typescript
interface HeroSliderProps {
  slides: FeaturedCompetition[];
}

// Features:
// - Auto-play every 5 seconds
// - Manual navigation dots
// - Swipe on mobile
// - Pause on hover
// - Each slide links to competition page
```

### CompetitionCard

```typescript
interface CompetitionCardProps {
  competition: CompetitionCard;
  variant?: 'default' | 'compact';
}

// Display:
// - Prize image (top)
// - Title
// - Price badge
// - Progress bar (sold/total)
// - "Enter Now" button
```

### CountdownTimer

```typescript
interface CountdownTimerProps {
  endDate: string;
  onComplete?: () => void;
  variant?: 'large' | 'compact';
}

// Display: DD : HH : MM : SS
// Updates every second
// Shows "Ended" when complete
```

---

## 12. Dependencies

- `swiper` - For hero carousel
- `date-fns` - For countdown calculations
- `swr` - For data fetching
- `clsx` - For conditional classes
