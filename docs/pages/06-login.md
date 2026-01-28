# Page Specification: Login Page

> **Page Route:** `/login`
> **Role Access:** Public (Redirect if authenticated)
> **Priority:** High
> **Spec Version:** 1.0

---

## 1. Page Overview

The login page allows existing users to authenticate using email/password or social login options. It redirects authenticated users to the dashboard or their intended destination.

---

## 2. Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                    Minimal Header (Logo only)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                                                                  │
│              ┌──────────────────────────────────┐               │
│              │                                   │               │
│              │         [Logo]                    │               │
│              │                                   │               │
│              │    Welcome Back                   │               │
│              │    Sign in to your account        │               │
│              │                                   │               │
│              │    ┌───────────────────────────┐ │               │
│              │    │ Email                     │ │               │
│              │    └───────────────────────────┘ │               │
│              │                                   │               │
│              │    ┌───────────────────────────┐ │               │
│              │    │ Password              👁  │ │               │
│              │    └───────────────────────────┘ │               │
│              │                                   │               │
│              │    [Forgot Password?]             │               │
│              │                                   │               │
│              │    ┌───────────────────────────┐ │               │
│              │    │        Sign In            │ │               │
│              │    └───────────────────────────┘ │               │
│              │                                   │               │
│              │    ──────── OR ────────          │               │
│              │                                   │               │
│              │    [🔵 Continue with Google]      │               │
│              │                                   │               │
│              │    Don't have an account?         │               │
│              │    [Sign Up]                      │               │
│              │                                   │               │
│              └──────────────────────────────────┘               │
│                                                                  │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                    Minimal Footer                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Tree

```
LoginPage
├── AuthLayout (centered, minimal header/footer)
├── LoginCard
│   ├── Logo
│   ├── Heading
│   ├── Subheading
│   ├── LoginForm
│   │   ├── EmailInput
│   │   ├── PasswordInput (with visibility toggle)
│   │   ├── ForgotPasswordLink
│   │   └── SubmitButton
│   ├── Divider
│   ├── SocialLoginButtons
│   │   └── GoogleButton
│   └── SignUpLink
└── ErrorToast (conditional)
```

---

## 4. API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `POST /api/auth/login` | POST | Authenticate user |

---

## 5. Data Models

### Login Request

```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

### Login Response

```typescript
interface LoginResponse {
  success: true;
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: 'user' | 'admin';
    };
    accessToken: string;
    expiresIn: number;
  };
}

// Refresh token set as httpOnly cookie
```

---

## 6. Form Validation

```typescript
import { z } from 'zod';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});
```

---

## 7. State Management

```typescript
// Form state with react-hook-form
const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
  resolver: zodResolver(loginSchema),
});

// Password visibility
const [showPassword, setShowPassword] = useState(false);

// Auth context
const { login } = useAuth();

// Redirect after login
const router = useRouter();
const searchParams = useSearchParams();
const redirectTo = searchParams.get('redirect') || '/dashboard';

const onSubmit = async (data: LoginRequest) => {
  try {
    await login(data.email, data.password);
    router.push(redirectTo);
  } catch (error) {
    toast.error(error.message || 'Login failed');
  }
};
```

---

## 8. UI States

### Default State
- All fields empty and enabled
- Submit button enabled

### Submitting State
- All fields disabled
- Submit button shows spinner
- "Signing in..."

### Error States

```typescript
// Field-level errors (validation)
<Input error={errors.email?.message} />

// Form-level errors (API)
toast.error('Invalid email or password');
toast.error('Your account has been suspended');
toast.error('Please verify your email first');
```

### Success State
- Redirect to dashboard or intended page
- Optional: Show brief "Welcome back!" toast

---

## 9. Redirect Logic

```typescript
// Check if already logged in
useEffect(() => {
  if (user) {
    router.replace(redirectTo);
  }
}, [user, redirectTo, router]);

// Preserve intended destination
// /login?redirect=/checkout
// After login, redirect to /checkout
```

---

## 10. Responsive Behavior

| Breakpoint | Card Width | Padding |
|------------|------------|---------|
| Mobile (<640px) | 100% - 32px | 24px |
| Tablet+ (640px+) | 400px max | 32px |

---

## 11. Agent Task

```markdown
## Task: Build Login Page

You are assigned to build the Login Page (/login).

### Prerequisites
1. Read .ai/context.md
2. Ensure AuthContext exists
3. Ensure POST /api/auth/login works
4. Ensure auth layout is created

### Implementation Steps
1. Create `src/app/(auth)/login/page.tsx`
2. Build LoginCard with form
3. Implement email and password inputs
4. Add password visibility toggle
5. Add form validation with Zod
6. Integrate with AuthContext
7. Handle redirect logic
8. Add Google OAuth button (if configured)
9. Add error handling
10. Link to register and forgot password

### Acceptance Criteria
- [ ] Form validates correctly
- [ ] Login works with valid credentials
- [ ] Errors display properly
- [ ] Redirects work correctly
- [ ] Password visibility toggles
- [ ] Responsive on all devices
- [ ] Loading states are smooth

### After Completion
Update .ai/context.md with your changes.
```

---

## 12. Component Specifications

### PasswordInput

```typescript
interface PasswordInputProps {
  name: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  register: UseFormRegister<any>;
}

// Features:
// - Password input type by default
// - Toggle button to show/hide
// - Error state styling
```

### SocialLoginButton

```typescript
interface SocialLoginButtonProps {
  provider: 'google' | 'facebook';
  onClick: () => void;
  disabled?: boolean;
}

// Features:
// - Provider icon
// - Provider-specific styling
// - Loading state
```

---

## 13. Security Considerations

- Rate limit login attempts (5 per 15 minutes)
- Show generic error for invalid credentials
- Don't reveal if email exists
- Secure token storage (httpOnly cookies for refresh)
- CSRF protection
