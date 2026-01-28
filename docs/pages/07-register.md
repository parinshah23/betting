# Page Specification: Register Page

> **Page Route:** `/register`
> **Role Access:** Public (Redirect if authenticated)
> **Priority:** High
> **Spec Version:** 1.0

---

## 1. Page Overview

The registration page allows new users to create an account. It collects essential information, validates input, and creates the user account with an initial wallet.

---

## 2. Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                    Minimal Header (Logo only)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│              ┌──────────────────────────────────┐               │
│              │                                   │               │
│              │         [Logo]                    │               │
│              │                                   │               │
│              │    Create Account                 │               │
│              │    Join and start winning         │               │
│              │                                   │               │
│              │    ┌────────────┐ ┌────────────┐ │               │
│              │    │ First Name │ │ Last Name  │ │               │
│              │    └────────────┘ └────────────┘ │               │
│              │                                   │               │
│              │    ┌───────────────────────────┐ │               │
│              │    │ Email                     │ │               │
│              │    └───────────────────────────┘ │               │
│              │                                   │               │
│              │    ┌───────────────────────────┐ │               │
│              │    │ Phone (Optional)          │ │               │
│              │    └───────────────────────────┘ │               │
│              │                                   │               │
│              │    ┌───────────────────────────┐ │               │
│              │    │ Password              👁  │ │               │
│              │    └───────────────────────────┘ │               │
│              │    • Min 8 chars • 1 number      │               │
│              │                                   │               │
│              │    ┌───────────────────────────┐ │               │
│              │    │ Confirm Password      👁  │ │               │
│              │    └───────────────────────────┘ │               │
│              │                                   │               │
│              │    [✓] I agree to the Terms      │               │
│              │        and Privacy Policy         │               │
│              │                                   │               │
│              │    ┌───────────────────────────┐ │               │
│              │    │      Create Account       │ │               │
│              │    └───────────────────────────┘ │               │
│              │                                   │               │
│              │    ──────── OR ────────          │               │
│              │                                   │               │
│              │    [🔵 Continue with Google]      │               │
│              │                                   │               │
│              │    Already have an account?       │               │
│              │    [Sign In]                      │               │
│              │                                   │               │
│              └──────────────────────────────────┘               │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                    Minimal Footer                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Tree

```
RegisterPage
├── AuthLayout
├── RegisterCard
│   ├── Logo
│   ├── Heading
│   ├── Subheading
│   ├── RegisterForm
│   │   ├── NameRow
│   │   │   ├── FirstNameInput
│   │   │   └── LastNameInput
│   │   ├── EmailInput
│   │   ├── PhoneInput (optional)
│   │   ├── PasswordInput
│   │   ├── PasswordStrength
│   │   ├── ConfirmPasswordInput
│   │   ├── TermsCheckbox
│   │   └── SubmitButton
│   ├── Divider
│   ├── SocialLoginButtons
│   └── LoginLink
└── ErrorToast
```

---

## 4. API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `POST /api/auth/register` | POST | Create new user |

---

## 5. Data Models

### Register Request

```typescript
interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}
```

### Register Response

```typescript
interface RegisterResponse {
  success: true;
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: 'user';
    };
    accessToken: string;
    expiresIn: number;
  };
  message: string; // "Account created successfully"
}
```

---

## 6. Form Validation

```typescript
import { z } from 'zod';

const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name too long'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  phone: z
    .string()
    .optional()
    .refine(val => !val || /^[\d\s\-+()]+$/.test(val), 'Invalid phone number'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  agreeTerms: z
    .boolean()
    .refine(val => val === true, 'You must agree to the terms'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
```

---

## 7. Password Strength Indicator

```typescript
interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4; // weak to strong
  requirements: {
    minLength: boolean;     // >= 8 chars
    hasNumber: boolean;     // contains digit
    hasLetter: boolean;     // contains letter
    hasSpecial: boolean;    // contains special char
    hasUpperLower: boolean; // has upper and lower
  };
}

// Display:
// ░░░░░ Weak
// ██░░░ Fair
// ███░░ Good
// █████ Strong
```

---

## 8. State Management

```typescript
const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
  resolver: zodResolver(registerSchema),
});

const password = watch('password');
const passwordStrength = calculatePasswordStrength(password);

const { register: authRegister } = useAuth();
const router = useRouter();

const onSubmit = async (data: RegisterRequest) => {
  try {
    await authRegister(data);
    toast.success('Account created! Welcome aboard.');
    router.push('/dashboard');
  } catch (error) {
    if (error.code === 'EMAIL_EXISTS') {
      toast.error('An account with this email already exists');
    } else {
      toast.error(error.message || 'Registration failed');
    }
  }
};
```

---

## 9. UI States

### Default State
- All fields empty and enabled
- Terms checkbox unchecked
- Submit button disabled until terms checked

### Submitting State
- All fields disabled
- Submit button shows spinner
- "Creating account..."

### Field Validation States
- Real-time validation as user types
- Error messages appear below fields
- Password strength updates live

### Success State
- Auto-login user
- Redirect to dashboard
- Show welcome toast

---

## 10. Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| Mobile (<640px) | Name fields stacked |
| Tablet+ (640px+) | Name fields side by side |

---

## 11. Agent Task

```markdown
## Task: Build Register Page

You are assigned to build the Register Page (/register).

### Prerequisites
1. Read .ai/context.md
2. Ensure AuthContext exists
3. Ensure POST /api/auth/register works
4. Ensure auth layout is created

### Implementation Steps
1. Create `src/app/(auth)/register/page.tsx`
2. Build RegisterCard with form
3. Implement all input fields
4. Add password strength indicator
5. Add terms agreement checkbox
6. Implement form validation
7. Integrate with AuthContext
8. Handle duplicate email error
9. Add Google OAuth button
10. Link to login page

### Acceptance Criteria
- [ ] All fields validate correctly
- [ ] Password strength shows
- [ ] Passwords match validation works
- [ ] Terms must be agreed
- [ ] Registration creates account
- [ ] Duplicate email handled
- [ ] Auto-login after register
- [ ] Responsive layout works

### After Completion
Update .ai/context.md with your changes.
```

---

## 12. Component Specifications

### PasswordStrengthIndicator

```typescript
interface PasswordStrengthIndicatorProps {
  password: string;
}

// Visual:
// - 5-segment bar
// - Color: red -> orange -> yellow -> green
// - Text label: Weak, Fair, Good, Strong
// - Requirement checklist below
```

### TermsCheckbox

```typescript
interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

// Display:
// [✓] I agree to the [Terms of Service] and [Privacy Policy]
// Links open in new tab
```

---

## 13. Backend Actions on Register

1. Validate all input
2. Check email doesn't exist
3. Hash password with bcrypt
4. Create user record
5. Create wallet with £0 balance
6. Send welcome email (async)
7. Generate tokens
8. Return user data
