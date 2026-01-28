# Page Specification: Checkout Page

> **Page Route:** `/checkout`
> **Role Access:** Authenticated User
> **Priority:** High
> **Spec Version:** 1.0

---

## 1. Page Overview

The checkout page handles payment processing. Users can pay using their wallet balance, Stripe card payment, or a combination of both. Ticket allocation happens after successful payment.

---

## 2. Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                         Header                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Page Title: "Checkout"                                          │
│                                                                  │
│  ┌────────────────────────────┬─────────────────────────────┐   │
│  │                            │                              │   │
│  │  ORDER SUMMARY             │  PAYMENT METHOD              │   │
│  │                            │                              │   │
│  │  Item 1           £12.50   │  ┌────────────────────────┐ │   │
│  │  Item 2           £15.00   │  │ WALLET BALANCE         │ │   │
│  │  ─────────────────────     │  │ Available: £20.00      │ │   │
│  │  Subtotal         £27.50   │  │                        │ │   │
│  │  Discount         -£2.75   │  │ [✓] Use £20.00         │ │   │
│  │  ─────────────────────     │  └────────────────────────┘ │   │
│  │  Wallet Used     -£20.00   │                              │   │
│  │  ─────────────────────     │  Remaining: £4.75            │   │
│  │  TO PAY           £4.75    │                              │   │
│  │                            │  ┌────────────────────────┐ │   │
│  │                            │  │ CARD PAYMENT           │ │   │
│  │                            │  │ [Stripe Card Element]  │ │   │
│  │                            │  │                        │ │   │
│  │                            │  └────────────────────────┘ │   │
│  │                            │                              │   │
│  │                            │  [ PAY £4.75 ]              │   │
│  │                            │                              │   │
│  └────────────────────────────┴─────────────────────────────┘   │
│                                                                  │
│  🔒 Secure payment powered by Stripe                            │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                         Footer                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Tree

```
CheckoutPage
├── Header (from layout)
├── PageHeader
├── CheckoutContent
│   ├── OrderSummaryPanel
│   │   ├── ItemsList
│   │   ├── Subtotal
│   │   ├── Discount
│   │   ├── WalletDeduction
│   │   └── FinalTotal
│   └── PaymentPanel
│       ├── WalletSection
│       │   ├── BalanceDisplay
│       │   └── UseWalletCheckbox
│       ├── RemainingAmount
│       ├── CardPaymentSection (if remaining > 0)
│       │   └── StripeCardElement
│       └── PayButton
├── SecurePaymentBadge
├── ErrorDisplay
└── Footer (from layout)
```

---

## 4. API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/cart` | GET | Fetch cart for summary |
| `GET /api/wallet` | GET | Fetch wallet balance |
| `POST /api/orders/create` | POST | Create order record |
| `POST /api/orders/payment-intent` | POST | Create Stripe PaymentIntent |
| `POST /api/orders/confirm` | POST | Confirm order after payment |

---

## 5. Data Models

### Checkout State

```typescript
interface CheckoutState {
  cart: Cart;
  walletBalance: number;
  useWallet: boolean;
  walletAmountToUse: number;
  remainingToPay: number;
  isProcessing: boolean;
  error: string | null;
}
```

### Create Order Request

```typescript
interface CreateOrderRequest {
  useWallet: boolean;
  walletAmount: number;
}

interface CreateOrderResponse {
  orderId: string;
  amountDue: number; // Amount to pay via Stripe (0 if wallet covers all)
  clientSecret?: string; // Stripe PaymentIntent client secret
}
```

### Confirm Order Request

```typescript
interface ConfirmOrderRequest {
  orderId: string;
  paymentIntentId?: string;
}

interface ConfirmOrderResponse {
  success: boolean;
  order: {
    id: string;
    orderNumber: string;
    tickets: AllocatedTicket[];
    instantWins: InstantWin[];
  };
}

interface AllocatedTicket {
  competitionId: string;
  competitionTitle: string;
  ticketNumbers: number[];
}

interface InstantWin {
  competitionTitle: string;
  ticketNumber: number;
  prize: string;
}
```

---

## 6. Payment Flow

```
┌─────────────────┐
│ Load Checkout   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Fetch Cart &    │
│ Wallet Balance  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ User Selects    │──────────────────────┐
│ Payment Method  │                      │
└────────┬────────┘                      │
         │                               │
    ┌────┴────┐                          │
    ▼         ▼                          │
┌───────┐  ┌─────────────┐               │
│Wallet │  │ Wallet +    │               │
│Only   │  │ Card        │               │
└───┬───┘  └──────┬──────┘               │
    │             │                      │
    │             ▼                      │
    │      ┌─────────────┐               │
    │      │ Collect Card│               │
    │      │ via Stripe  │               │
    │      └──────┬──────┘               │
    │             │                      │
    └──────┬──────┘                      │
           │                             │
           ▼                             │
┌─────────────────┐                      │
│ POST /orders/   │                      │
│ create          │                      │
└────────┬────────┘                      │
         │                               │
         ▼                               │
┌─────────────────┐                      │
│ If card payment │                      │
│ confirmPayment()│                      │
└────────┬────────┘                      │
         │                               │
         ▼                               │
┌─────────────────┐                      │
│ POST /orders/   │                      │
│ confirm         │                      │
└────────┬────────┘                      │
         │                               │
         ▼                               │
┌─────────────────┐                      │
│ Show Success    │                      │
│ + Tickets       │                      │
│ + Instant Wins  │                      │
└─────────────────┘                      │
```

---

## 7. State Management

```typescript
const [useWallet, setUseWallet] = useState(true);
const [isProcessing, setIsProcessing] = useState(false);
const [error, setError] = useState<string | null>(null);

// Fetch data
const { data: cart } = useSWR('/api/cart');
const { data: wallet } = useSWR('/api/wallet');

// Calculate amounts
const walletAmount = useWallet
  ? Math.min(wallet?.balance || 0, cart?.total || 0)
  : 0;
const remainingToPay = (cart?.total || 0) - walletAmount;

// Stripe Elements
const stripe = useStripe();
const elements = useElements();

// Handle payment
const handlePayment = async () => {
  setIsProcessing(true);
  setError(null);

  try {
    // 1. Create order
    const orderRes = await createOrder({ useWallet, walletAmount });

    // 2. If card payment needed
    if (orderRes.amountDue > 0 && orderRes.clientSecret) {
      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        orderRes.clientSecret,
        { payment_method: { card: cardElement } }
      );

      if (stripeError) throw new Error(stripeError.message);
    }

    // 3. Confirm order
    const confirmRes = await confirmOrder({ orderId: orderRes.orderId });

    // 4. Redirect to success
    router.push(`/checkout/success?order=${confirmRes.order.orderNumber}`);

  } catch (err) {
    setError(err.message);
  } finally {
    setIsProcessing(false);
  }
};
```

---

## 8. UI States

### Loading
- Skeleton for order summary
- Skeleton for payment form

### Processing Payment
- Disable all inputs
- Show spinner on pay button
- Display "Processing payment..."

### Payment Error
```
┌────────────────────────────────────┐
│  ❌ Payment Failed                 │
│                                    │
│  Your card was declined. Please    │
│  try a different payment method.   │
│                                    │
│  [Try Again]                       │
└────────────────────────────────────┘
```

### Success (Redirect to success page)
- Show order confirmation
- Display allocated ticket numbers
- Show instant win notifications (if any)

---

## 9. Wallet Payment Logic

```typescript
// Wallet covers entire order
if (walletBalance >= cartTotal) {
  // No Stripe needed
  // Show only wallet section
  // Button: "Pay with Wallet (£X.XX)"
}

// Wallet partial payment
if (walletBalance > 0 && walletBalance < cartTotal) {
  // Show wallet section with checkbox
  // Show remaining amount
  // Show Stripe card input
  // Button: "Pay £Y.YY"
}

// No wallet balance
if (walletBalance === 0) {
  // Hide wallet section
  // Show only Stripe card input
  // Button: "Pay £X.XX"
}
```

---

## 10. Agent Task

```markdown
## Task: Build Checkout Page

You are assigned to build the Checkout Page (/checkout).

### Prerequisites
1. Read .ai/context.md
2. Ensure Stripe is configured
3. Ensure cart and wallet APIs work
4. Ensure order APIs are implemented

### Implementation Steps
1. Create `src/app/checkout/page.tsx`
2. Implement OrderSummaryPanel
3. Create WalletSection with toggle
4. Integrate Stripe Elements (CardElement)
5. Build payment flow logic
6. Handle all error states
7. Create success redirect logic
8. Add secure payment badges

### Acceptance Criteria
- [ ] Order summary displays correctly
- [ ] Wallet balance shows and works
- [ ] Stripe card input works
- [ ] Combined payment works
- [ ] Loading states are smooth
- [ ] Errors display correctly
- [ ] Redirects to success on completion

### After Completion
Update .ai/context.md with your changes.
```

---

## 11. Component Specifications

### WalletSection

```typescript
interface WalletSectionProps {
  balance: number;
  orderTotal: number;
  useWallet: boolean;
  onToggle: (use: boolean) => void;
  disabled?: boolean;
}
```

### StripeCardSection

```typescript
// Uses @stripe/react-stripe-js
// CardElement with custom styling
const cardStyle = {
  base: {
    fontSize: '16px',
    color: '#424770',
    '::placeholder': { color: '#aab7c4' },
  },
  invalid: {
    color: '#9e2146',
  },
};
```

---

## 12. Security Considerations

- Never expose Stripe secret key to frontend
- Validate order totals on backend before charging
- Use webhooks to confirm payment (backup)
- Rate limit checkout attempts
- Log all payment attempts for audit
