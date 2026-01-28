# Page Specification: Single Competition Page

> **Page Route:** `/competitions/[slug]`
> **Role Access:** Public (Authentication required for purchase)
> **Priority:** High
> **Spec Version:** 1.0

---

## 1. Page Overview

The single competition page is the most critical page for conversions. It displays full details of a prize, handles the skill-based entry question, ticket selection, and add-to-cart functionality. This page also shows real-time ticket availability and instant win status.

---

## 2. Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                         Header                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Breadcrumb: Home > Competitions > [Prize Name]                  │
│                                                                  │
│  ┌────────────────────────────┬─────────────────────────────┐   │
│  │                            │                              │   │
│  │                            │  Prize Title                 │   │
│  │      Image Gallery         │  Price: £X.XX per ticket     │   │
│  │                            │                              │   │
│  │  [Main Image]              │  ┌──────────────────────┐    │   │
│  │                            │  │ Countdown Timer      │    │   │
│  │  [thumb][thumb][thumb]     │  │ 2d : 14h : 32m : 15s │    │   │
│  │                            │  └──────────────────────┘    │   │
│  │                            │                              │   │
│  │                            │  Progress: 450/1000 sold     │   │
│  │                            │  ████████░░░░░ 45%           │   │
│  │                            │                              │   │
│  │                            │  Instant Wins: 5 remaining   │   │
│  │                            │                              │   │
│  └────────────────────────────┴─────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ SKILL QUESTION (Must answer correctly)                    │   │
│  │                                                           │   │
│  │ "What is 15 + 27?"                                        │   │
│  │                                                           │   │
│  │ [   Your Answer   ]                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ SELECT TICKETS                                            │   │
│  │                                                           │   │
│  │ [-]  [  5  ]  [+]     [+5] [+10] [+25] [MAX]              │   │
│  │                                                           │   │
│  │ Total: £12.50                                             │   │
│  │                                                           │   │
│  │        [ ADD TO CART ]                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ PRIZE DESCRIPTION                                         │   │
│  │                                                           │   │
│  │ [Rich text content about the prize...]                    │   │
│  │ • Feature 1                                               │   │
│  │ • Feature 2                                               │   │
│  │ • Feature 3                                               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                         Footer                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Tree

```
CompetitionDetailPage
├── Header (from layout)
├── Breadcrumbs
├── CompetitionContent
│   ├── ImageGallery
│   │   ├── MainImage
│   │   └── ThumbnailRow
│   └── CompetitionInfo
│       ├── Title
│       ├── PriceBadge
│       ├── CountdownTimer
│       ├── ProgressBar
│       ├── InstantWinBadge
│       └── StatsRow
├── SkillQuestion
│   ├── QuestionText
│   ├── AnswerInput
│   └── ValidationMessage
├── TicketSelector
│   ├── QuantityInput
│   ├── QuickSelectButtons
│   ├── TotalPrice
│   └── AddToCartButton
├── DescriptionSection
│   └── RichTextContent
├── RelatedCompetitions (optional)
└── Footer (from layout)
```

---

## 4. API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/competitions/:slug` | GET | Fetch competition details |
| `/api/tickets/verify-answer` | POST | Verify skill question answer |
| `/api/cart/add` | POST | Add tickets to cart |

---

## 5. Data Models

### Competition Detail

```typescript
interface CompetitionDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  prizeValue: number;
  ticketPrice: number;
  totalTickets: number;
  soldTickets: number;
  maxTicketsPerUser: number;
  category: string;
  status: 'live' | 'ended' | 'sold_out' | 'completed';
  endDate: string;
  drawDate: string | null;
  skillQuestion: string;
  images: CompetitionImage[];
  instantWinsRemaining: number;
  winner?: {
    displayName: string;
    ticketNumber: number;
  };
}

interface CompetitionImage {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
}
```

### Verify Answer Request/Response

```typescript
// Request
interface VerifyAnswerRequest {
  competitionId: string;
  answer: string;
}

// Response
interface VerifyAnswerResponse {
  success: boolean;
  correct: boolean;
  message?: string;
}
```

### Add to Cart Request

```typescript
interface AddToCartRequest {
  competitionId: string;
  quantity: number;
  skillAnswer: string; // Must be verified first
}
```

---

## 6. State Management

```typescript
// Component State
const [selectedQuantity, setSelectedQuantity] = useState(1);
const [skillAnswer, setSkillAnswer] = useState('');
const [isAnswerVerified, setIsAnswerVerified] = useState(false);
const [isVerifying, setIsVerifying] = useState(false);
const [isAddingToCart, setIsAddingToCart] = useState(false);

// Computed
const totalPrice = competition.ticketPrice * selectedQuantity;
const remainingTickets = competition.totalTickets - competition.soldTickets;
const maxCanBuy = Math.min(remainingTickets, competition.maxTicketsPerUser);

// Data Fetching
const { data: competition, isLoading, error } = useSWR(`/api/competitions/${slug}`);
```

---

## 7. UI States

### Loading State
- Skeleton for image gallery
- Skeleton for info panel
- Skeleton for description

### Sold Out State
```
┌────────────────────────────────┐
│      SOLD OUT                  │
│                                │
│  All tickets have been sold.   │
│  Draw date: [DATE]             │
│                                │
│  [Notify Me of Similar Prizes] │
└────────────────────────────────┘
```

### Competition Ended State
- Hide ticket selector
- Show winner announcement (if completed)
- Show "Competition Ended" badge

### Answer Verification States
- **Pending:** Input enabled, button says "Verify"
- **Verifying:** Input disabled, spinner showing
- **Correct:** Green checkmark, proceed to quantity
- **Incorrect:** Red error message, allow retry

---

## 8. Skill Question Flow

```
┌─────────────────┐
│  Enter Answer   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Click "Verify"  │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐  ┌───────┐
│Correct│  │Wrong  │
└───┬───┘  └───┬───┘
    │          │
    ▼          ▼
┌─────────┐  ┌──────────────┐
│ Enable  │  │ Show error,  │
│ Tickets │  │ allow retry  │
└─────────┘  └──────────────┘
```

**Validation Rules:**
- Answer must not be empty
- Answer is case-insensitive
- Trim whitespace before comparison
- Rate limit: Max 5 attempts per minute

---

## 9. Ticket Selector Logic

```typescript
// Quick select buttons
const quickButtons = [5, 10, 25, 'MAX'];

// Quantity constraints
const MIN_QUANTITY = 1;
const maxQuantity = Math.min(
  competition.maxTicketsPerUser,
  remainingTickets,
  userRemainingAllowance // If logged in
);

// Handle quantity change
const handleQuantityChange = (newQty: number) => {
  const clamped = Math.max(MIN_QUANTITY, Math.min(newQty, maxQuantity));
  setSelectedQuantity(clamped);
};

// Add to cart validation
const canAddToCart = isAnswerVerified && selectedQuantity > 0 && remainingTickets > 0;
```

---

## 10. Responsive Behavior

| Breakpoint | Layout | Image Size |
|------------|--------|------------|
| Mobile (<640px) | Single column, stacked | Full width |
| Tablet (640-1024px) | Two columns (60/40) | 60% width |
| Desktop (>1024px) | Two columns (55/45) | Fixed 500px |

---

## 11. SEO Requirements

```html
<title>{Prize Name} - Win Now | RaffleSite</title>
<meta name="description" content="{shortDescription}" />
<meta property="og:title" content="{Prize Name} - Win Now!" />
<meta property="og:description" content="{shortDescription}" />
<meta property="og:image" content="{primaryImage}" />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{Prize Name}",
  "image": "{primaryImage}",
  "offers": {
    "@type": "Offer",
    "price": "{ticketPrice}",
    "priceCurrency": "GBP"
  }
}
</script>
```

---

## 12. Agent Task

```markdown
## Task: Build Single Competition Page

You are assigned to build the Single Competition Page (/competitions/[slug]).

### Prerequisites
1. Read .ai/context.md
2. Ensure CountdownTimer component exists
3. Ensure ProgressBar component exists
4. Ensure ImageGallery component exists
5. Verify API endpoints are working

### Implementation Steps
1. Create `src/app/(public)/competitions/[slug]/page.tsx`
2. Implement ImageGallery with thumbnails
3. Create CompetitionInfo section with all stats
4. Implement SkillQuestion component with verification
5. Create TicketSelector with quantity controls
6. Implement Add to Cart functionality
7. Add loading and error states
8. Handle sold out / ended states
9. Add SEO meta tags and structured data
10. Ensure responsive layout

### Acceptance Criteria
- [ ] Competition data loads correctly
- [ ] Image gallery works with thumbnails
- [ ] Countdown timer updates in real-time
- [ ] Progress bar shows accurate ticket counts
- [ ] Skill question verification works
- [ ] Ticket quantity controls work correctly
- [ ] Add to cart works (requires auth)
- [ ] Sold out state displays properly
- [ ] Page is fully responsive

### After Completion
Update .ai/context.md with your changes.
```

---

## 13. Component Specifications

### ImageGallery

```typescript
interface ImageGalleryProps {
  images: CompetitionImage[];
}

// Features:
// - Main image display
// - Thumbnail navigation
// - Click to enlarge (modal)
// - Swipe on mobile
```

### SkillQuestion

```typescript
interface SkillQuestionProps {
  question: string;
  competitionId: string;
  onVerified: (answer: string) => void;
  disabled?: boolean;
}

// Features:
// - Text input
// - Verify button
// - Loading state during verification
// - Success/error feedback
// - Rate limiting warning
```

### TicketSelector

```typescript
interface TicketSelectorProps {
  ticketPrice: number;
  maxQuantity: number;
  onAddToCart: (quantity: number) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

// Features:
// - +/- buttons
// - Direct input
// - Quick select buttons
// - Real-time total calculation
// - Max quantity enforcement
```

---

## 14. Instant Win Display

```typescript
// If user wins instantly after purchase
interface InstantWinNotification {
  isWinner: boolean;
  prize: string;
  ticketNumber: number;
}

// Display:
// - Modal popup with celebration animation
// - Prize details
// - "Claim Prize" button (links to My Wins)
```
