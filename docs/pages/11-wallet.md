# Page Specification: Wallet Page

> **Page Route:** `/wallet`
> **Role Access:** Authenticated User
> **Priority:** High
> **Spec Version:** 1.0

---

## 1. Page Overview

The wallet page allows users to view their balance, transaction history, deposit funds, and track cashback earnings. It's a critical page for the platform's monetization.

---

## 2. Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                         Header                                   │
├────────────────┬────────────────────────────────────────────────┤
│                │                                                 │
│   Sidebar      │  My Wallet                                      │
│                │                                                 │
│                │  ┌─────────────────────────────────────────┐   │
│                │  │                                          │   │
│                │  │         Current Balance                  │   │
│                │  │                                          │   │
│                │  │            £125.50                       │   │
│                │  │                                          │   │
│                │  │          [ TOP UP WALLET ]               │   │
│                │  │                                          │   │
│                │  └─────────────────────────────────────────┘   │
│                │                                                 │
│                │  Quick Top-Up                                   │
│                │  [£10] [£25] [£50] [£100] [Custom]              │
│                │                                                 │
│                │  ┌─────────────────────────────────────────┐   │
│                │  │ TRANSACTION HISTORY                      │   │
│                │  │                                          │   │
│                │  │ Filter: [All ▼] [This Month ▼]           │   │
│                │  │                                          │   │
│                │  │ ┌─────────────────────────────────────┐ │   │
│                │  │ │ 🟢 Cashback - Watch Draw            │ │   │
│                │  │ │ +£5.00          Today, 2:30 PM      │ │   │
│                │  │ ├─────────────────────────────────────┤ │   │
│                │  │ │ 🔴 Purchase - Car Raffle            │ │   │
│                │  │ │ -£25.00         Today, 1:15 PM      │ │   │
│                │  │ ├─────────────────────────────────────┤ │   │
│                │  │ │ 🟢 Deposit                          │ │   │
│                │  │ │ +£100.00        Yesterday           │ │   │
│                │  │ └─────────────────────────────────────┘ │   │
│                │  │                                          │   │
│                │  │              [Load More]                 │   │
│                │  └─────────────────────────────────────────┘   │
│                │                                                 │
├────────────────┴────────────────────────────────────────────────┤
│                         Footer                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Tree

```
WalletPage
├── DashboardLayout
├── PageHeader
├── BalanceCard
│   ├── BalanceAmount
│   └── TopUpButton
├── QuickTopUpButtons
│   └── AmountButton[] (£10, £25, £50, £100)
├── CustomTopUpModal (triggered)
├── TransactionHistory
│   ├── FilterBar
│   │   ├── TypeFilter
│   │   └── DateFilter
│   ├── TransactionList
│   │   └── TransactionItem[]
│   └── LoadMoreButton
└── DepositModal (triggered)
```

---

## 4. API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/wallet` | GET | Get wallet balance |
| `GET /api/wallet/transactions` | GET | Get transaction history |
| `POST /api/wallet/deposit` | POST | Create deposit payment intent |

---

## 5. Data Models

### Wallet Response

```typescript
interface WalletResponse {
  id: string;
  balance: number;
  pendingCashback: number; // Cashback to be credited
  lifetimeCashback: number;
  lifetimeDeposits: number;
}
```

### Transaction History

```typescript
interface TransactionsResponse {
  transactions: WalletTransaction[];
  meta: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

interface WalletTransaction {
  id: string;
  type: 'deposit' | 'spend' | 'cashback' | 'refund' | 'admin_credit' | 'admin_debit';
  amount: number; // Positive for credits, negative for debits
  balanceAfter: number;
  description: string;
  referenceId?: string;
  createdAt: string;
}
```

### Deposit Request

```typescript
interface DepositRequest {
  amount: number;
}

interface DepositResponse {
  clientSecret: string; // Stripe PaymentIntent
  transactionId: string;
}
```

---

## 6. State Management

```typescript
// Wallet data
const { data: wallet } = useSWR('/api/wallet');

// Transactions with pagination
const [page, setPage] = useState(1);
const [filter, setFilter] = useState({ type: 'all', period: 'all' });
const queryParams = new URLSearchParams({ page, ...filter });
const { data: txData } = useSWR(`/api/wallet/transactions?${queryParams}`);

// Deposit modal
const [isDepositOpen, setDepositOpen] = useState(false);
const [depositAmount, setDepositAmount] = useState<number | null>(null);

// Handle quick top-up
const handleQuickTopUp = (amount: number) => {
  setDepositAmount(amount);
  setDepositOpen(true);
};
```

---

## 7. Deposit Flow

```
┌─────────────────┐
│ Click Top Up    │
│ or Quick Amount │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Deposit Modal   │
│ Opens           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Enter Amount    │
│ (if custom)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ POST /deposit   │
│ Get clientSecret│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Stripe Card     │
│ Input           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ confirmPayment  │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐  ┌───────┐
│Success│  │Failed │
└───┬───┘  └───────┘
    │
    ▼
┌─────────────────┐
│ Refresh Wallet  │
│ Show Success    │
└─────────────────┘
```

---

## 8. Transaction Display

### Transaction Type Styling

| Type | Icon | Color | Label |
|------|------|-------|-------|
| deposit | ↓ | Green | Deposit |
| spend | ↑ | Red | Purchase |
| cashback | ★ | Gold | Cashback |
| refund | ↩ | Blue | Refund |
| admin_credit | + | Green | Credit (Admin) |
| admin_debit | - | Red | Debit (Admin) |

### Amount Display
```typescript
// Format: +£XX.XX or -£XX.XX
const formatAmount = (amount: number, type: string) => {
  const prefix = amount >= 0 ? '+' : '';
  const color = amount >= 0 ? 'text-green-600' : 'text-red-600';
  return <span className={color}>{prefix}£{Math.abs(amount).toFixed(2)}</span>;
};
```

---

## 9. Filter Options

### Type Filter
- All Transactions
- Deposits
- Purchases
- Cashback
- Refunds

### Date Filter
- All Time
- This Week
- This Month
- Last 3 Months

---

## 10. Agent Task

```markdown
## Task: Build Wallet Page

You are assigned to build the Wallet Page (/wallet).

### Prerequisites
1. Read .ai/context.md
2. Ensure DashboardLayout exists
3. Ensure Stripe is configured
4. Verify wallet APIs work

### Implementation Steps
1. Create `src/app/(dashboard)/wallet/page.tsx`
2. Build BalanceCard component
3. Create QuickTopUpButtons
4. Implement DepositModal with Stripe
5. Build TransactionHistory component
6. Add filters for transactions
7. Implement pagination ("Load More")
8. Handle loading and error states

### Acceptance Criteria
- [ ] Balance displays correctly
- [ ] Quick top-up buttons work
- [ ] Custom amount deposit works
- [ ] Stripe payment processes
- [ ] Transaction history loads
- [ ] Filters work correctly
- [ ] Pagination works
- [ ] Responsive layout

### After Completion
Update .ai/context.md with your changes.
```

---

## 11. Component Specifications

### BalanceCard

```typescript
interface BalanceCardProps {
  balance: number;
  onTopUp: () => void;
}

// Display:
// - Large balance amount
// - Currency symbol
// - Top Up button
```

### DepositModal

```typescript
interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: number;
  onSuccess: () => void;
}

// Features:
// - Amount input (if not preset)
// - Stripe CardElement
// - Processing state
// - Success/error handling
```

### TransactionItem

```typescript
interface TransactionItemProps {
  transaction: WalletTransaction;
}

// Display:
// - Type icon
// - Description
// - Amount (colored)
// - Timestamp
// - Balance after (subtle)
```

---

## 12. Cashback System

```typescript
// Cashback is automatically credited after purchase
// Based on competition settings

interface CashbackInfo {
  percentage: number; // e.g., 5%
  earnedOn: string; // Competition title
}

// Display pending cashback
// "£5.00 cashback pending from Watch Draw"
```
