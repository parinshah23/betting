# Page Specification: Cart Page

> **Page Route:** `/cart`
> **Role Access:** Authenticated User
> **Priority:** High
> **Spec Version:** 1.0

---

## 1. Page Overview

The cart page displays all ticket items the user has added, allows quantity adjustments, promo code application, and provides the path to checkout.

---

## 2. Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                         Header                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Page Title: "Your Cart" (3 items)                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ CART ITEM                                                 │   │
│  │ ┌────────┐  Competition Title                            │   │
│  │ │  IMG   │  £2.50 per ticket                             │   │
│  │ │        │  Qty: [-] [5] [+]        Subtotal: £12.50     │   │
│  │ └────────┘                                    [Remove]    │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ ┌────────┐  Competition Title 2                          │   │
│  │ │  IMG   │  £5.00 per ticket                             │   │
│  │ │        │  Qty: [-] [3] [+]        Subtotal: £15.00     │   │
│  │ └────────┘                                    [Remove]    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ PROMO CODE                                                │   │
│  │ [          Enter code          ]  [Apply]                 │   │
│  │ ✓ "SAVE10" applied - 10% off                              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ORDER SUMMARY                                             │   │
│  │                                                           │   │
│  │ Subtotal                              £27.50              │   │
│  │ Discount (SAVE10)                     -£2.75              │   │
│  │ ─────────────────────────────────────────────             │   │
│  │ Total                                 £24.75              │   │
│  │                                                           │   │
│  │           [ PROCEED TO CHECKOUT ]                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [Continue Shopping]                                             │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                         Footer                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Tree

```
CartPage
├── Header (from layout)
├── PageHeader
│   └── Title + Item Count
├── CartItemsList
│   └── CartItem[]
│       ├── ItemImage
│       ├── ItemDetails
│       ├── QuantityControl
│       ├── ItemSubtotal
│       └── RemoveButton
├── PromoCodeSection
│   ├── PromoInput
│   ├── ApplyButton
│   └── AppliedPromoDisplay
├── OrderSummary
│   ├── SubtotalRow
│   ├── DiscountRow (conditional)
│   ├── TotalRow
│   └── CheckoutButton
├── ContinueShoppingLink
├── EmptyCartState (conditional)
└── Footer (from layout)
```

---

## 4. API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/cart` | GET | Fetch current cart |
| `PUT /api/cart/update` | PUT | Update item quantity |
| `DELETE /api/cart/:itemId` | DELETE | Remove item from cart |
| `POST /api/cart/apply-promo` | POST | Apply promo code |
| `DELETE /api/cart/promo` | DELETE | Remove promo code |

---

## 5. Data Models

### Cart Response

```typescript
interface CartResponse {
  id: string;
  items: CartItem[];
  promoCode: AppliedPromo | null;
  subtotal: number;
  discountAmount: number;
  total: number;
}

interface CartItem {
  id: string;
  competitionId: string;
  competitionTitle: string;
  competitionSlug: string;
  competitionImage: string;
  ticketPrice: number;
  quantity: number;
  maxQuantity: number; // Remaining allowed for user
  subtotal: number;
  competitionEndDate: string;
  competitionStatus: 'live' | 'ended' | 'sold_out';
}

interface AppliedPromo {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  savings: number;
}
```

---

## 6. State Management

```typescript
// Cart data from API
const { data: cart, mutate: refreshCart, isLoading } = useSWR('/api/cart');

// Promo code state
const [promoCode, setPromoCode] = useState('');
const [promoError, setPromoError] = useState('');
const [isApplyingPromo, setIsApplyingPromo] = useState(false);

// Update quantity
const updateQuantity = async (itemId: string, newQty: number) => {
  await fetch(`/api/cart/update`, {
    method: 'PUT',
    body: JSON.stringify({ itemId, quantity: newQty })
  });
  refreshCart();
};

// Remove item
const removeItem = async (itemId: string) => {
  await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
  refreshCart();
};
```

---

## 7. UI States

### Empty Cart
```
┌────────────────────────────────────┐
│         🛒 Your Cart is Empty      │
│                                    │
│  Looks like you haven't added      │
│  any tickets yet.                  │
│                                    │
│    [Browse Competitions]           │
└────────────────────────────────────┘
```

### Loading State
- Show skeleton for cart items
- Disable all interactive elements

### Item Updating State
- Show spinner on quantity buttons
- Optimistically update totals

### Promo Code States
- **Success:** Green checkmark with savings amount
- **Error:** Red text "Invalid or expired code"
- **Loading:** Spinner on Apply button

---

## 8. Validation Rules

### Quantity Limits
```typescript
// On quantity change
const validateQuantity = (newQty: number, item: CartItem) => {
  if (newQty < 1) return { valid: false, message: 'Minimum 1 ticket' };
  if (newQty > item.maxQuantity) return {
    valid: false,
    message: `Maximum ${item.maxQuantity} tickets allowed`
  };
  return { valid: true };
};
```

### Competition Status Checks
- If competition ended while in cart: Show warning, disable checkout for that item
- If competition sold out: Show warning, suggest removal

---

## 9. Promo Code Logic

```typescript
// Apply promo code
const applyPromo = async () => {
  setIsApplyingPromo(true);
  setPromoError('');

  try {
    const res = await fetch('/api/cart/apply-promo', {
      method: 'POST',
      body: JSON.stringify({ code: promoCode })
    });

    if (!res.ok) {
      const error = await res.json();
      setPromoError(error.message);
    } else {
      refreshCart();
      setPromoCode('');
    }
  } finally {
    setIsApplyingPromo(false);
  }
};
```

---

## 10. Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| Mobile (<640px) | Stacked: Image on top, details below |
| Tablet+ (640px+) | Side by side: Image left, details right |

---

## 11. Agent Task

```markdown
## Task: Build Cart Page

You are assigned to build the Cart Page (/cart).

### Prerequisites
1. Read .ai/context.md
2. Ensure auth middleware protects route
3. Ensure cart API endpoints are working

### Implementation Steps
1. Create `src/app/cart/page.tsx`
2. Implement CartItemsList component
3. Create CartItem component with quantity controls
4. Build PromoCodeSection with apply/remove
5. Create OrderSummary component
6. Implement empty cart state
7. Add loading states
8. Handle competition status warnings
9. Add "Proceed to Checkout" button

### Acceptance Criteria
- [ ] Cart items display correctly
- [ ] Quantity can be updated
- [ ] Items can be removed
- [ ] Promo codes work
- [ ] Totals update correctly
- [ ] Empty cart shows proper state
- [ ] Checkout button navigates correctly

### After Completion
Update .ai/context.md with your changes.
```

---

## 12. Component Specifications

### CartItem

```typescript
interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (qty: number) => void;
  onRemove: () => void;
  isUpdating?: boolean;
}

// Features:
// - Competition image (linked to competition)
// - Title (linked to competition)
// - Price per ticket
// - Quantity controls (+/-)
// - Subtotal display
// - Remove button
// - Warning if competition ended/sold out
```

### OrderSummary

```typescript
interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  total: number;
  promoCode?: string;
  onCheckout: () => void;
  isCheckoutDisabled?: boolean;
}
```
