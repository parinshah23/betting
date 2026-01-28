# Page Specification: Admin Users Management

> **Page Route:** `/admin/users`
> **Role Access:** Admin Only
> **Priority:** Medium
> **Spec Version:** 1.0

---

## 1. API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/admin/users` | GET | List all users |
| `GET /api/admin/users/:id` | GET | Get user details |
| `PUT /api/admin/users/:id` | PUT | Update user |
| `POST /api/admin/users/:id/ban` | POST | Ban/unban user |
| `POST /api/admin/users/:id/wallet` | POST | Adjust wallet |

---

## 2. Data Models

```typescript
interface AdminUserView {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'user' | 'admin';
  walletBalance: number;
  ticketsPurchased: number;
  totalSpent: number;
  registeredAt: string;
  lastLoginAt: string;
  isBanned: boolean;
}
```

---

## 3. Features

- Search users by email/name
- Filter by status (active, banned)
- View user details
- Reset password
- Ban/unban user
- Adjust wallet balance (credit/debit)
- View purchase history

---

## 4. Agent Task

```markdown
## Task: Build Admin Users Management

### Implementation Steps
1. Create `src/app/(admin)/admin/users/page.tsx`
2. Create `src/app/(admin)/admin/users/[id]/page.tsx`
3. Build users table with search
4. Implement filters
5. Create user detail view
6. Add ban/unban functionality
7. Build wallet adjustment modal

### Acceptance Criteria
- [ ] User list loads correctly
- [ ] Search and filters work
- [ ] User details show all info
- [ ] Ban/unban works
- [ ] Wallet adjustments work
```
