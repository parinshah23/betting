# Page Specification: Admin Orders Management

> **Page Route:** `/admin/orders`
> **Role Access:** Admin Only
> **Priority:** Medium
> **Spec Version:** 1.0

---

## 1. API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/admin/orders` | GET | List all orders |
| `GET /api/admin/orders/:id` | GET | Get order details |
| `POST /api/admin/orders/:id/refund` | POST | Refund order |

---

## 2. Data Models

```typescript
interface AdminOrderView {
  id: string;
  orderNumber: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  walletUsed: number;
  cardPaid: number;
  total: number;
  status: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentMethod: string;
  createdAt: string;
}
```

---

## 3. Features

- List all orders with pagination
- Filter by status, date range
- Search by order number or email
- View order details
- Process refunds
- Export orders to CSV

---

## 4. Agent Task

```markdown
## Task: Build Admin Orders Management

### Implementation Steps
1. Create `src/app/(admin)/admin/orders/page.tsx`
2. Build orders table with pagination
3. Add filters and search
4. Create order detail modal
5. Implement refund functionality
6. Add CSV export

### Acceptance Criteria
- [ ] Orders list correctly
- [ ] Filters and search work
- [ ] Order details show correctly
- [ ] Refund processing works
- [ ] Export generates CSV
```
