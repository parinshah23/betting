# Page Specification: Forgot Password Page

> **Page Route:** `/forgot-password`
> **Role Access:** Public
> **Priority:** Medium
> **Spec Version:** 1.0

---

## 1. Page Overview

Allows users to request a password reset link sent to their email.

---

## 2. API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `POST /api/auth/forgot-password` | POST | Send reset email |
| `POST /api/auth/reset-password` | POST | Reset with token |

---

## 3. Flow

```
1. User enters email
2. Click "Send Reset Link"
3. Show success message (always - for security)
4. Email contains link: /reset-password?token=xxx
5. Reset password page validates token
6. User enters new password
7. Redirect to login
```

---

## 4. Agent Task

```markdown
## Task: Build Forgot Password Flow

### Implementation Steps
1. Create `src/app/(auth)/forgot-password/page.tsx`
2. Create `src/app/(auth)/reset-password/page.tsx`
3. Build email input form
4. Show success state
5. Build reset password form with token
6. Handle token validation
7. Handle expired token error

### Acceptance Criteria
- [ ] Email form submits correctly
- [ ] Success shown regardless of email existence
- [ ] Reset page validates token
- [ ] New password form works
- [ ] Redirects to login on success
```
