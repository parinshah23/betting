# Page Specification: Profile Page

> **Page Route:** `/profile`
> **Role Access:** Authenticated User
> **Priority:** Medium
> **Spec Version:** 1.0

---

## 1. Page Overview

The profile page allows users to view and edit their personal information, change password, and manage account settings.

---

## 2. API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/users/profile` | GET | Get user profile |
| `PUT /api/users/profile` | PUT | Update profile |
| `PUT /api/users/password` | PUT | Change password |

---

## 3. Data Models

```typescript
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: string;
  emailVerified: boolean;
}

interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phone?: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
```

---

## 4. Sections

### Personal Information
- First Name (editable)
- Last Name (editable)
- Email (read-only, display only)
- Phone (optional, editable)

### Security
- Current Password
- New Password
- Confirm New Password
- Password strength indicator

---

## 5. Agent Task

```markdown
## Task: Build Profile Page

### Implementation Steps
1. Create `src/app/(dashboard)/profile/page.tsx`
2. Build PersonalInfoForm section
3. Create ChangePasswordForm section
4. Add form validation
5. Handle success/error states
6. Show toast notifications on save

### Acceptance Criteria
- [ ] Profile data loads correctly
- [ ] Personal info can be updated
- [ ] Password can be changed
- [ ] Validation works correctly
- [ ] Success/error feedback shown
```
