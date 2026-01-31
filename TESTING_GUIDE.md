# Website Testing Guide

> **Last Updated:** 2026-01-31  
> **Project Phase:** Phase 4 - Page-by-Page Implementation (25% Complete)

---

## Prerequisites

Before testing, ensure you have:

1. **Node.js** (v18+) installed
2. **PostgreSQL** running on port 5432
3. **Project cloned** at `/home/kevin/Desktop/gambling-web`

---

## Step 1: Start the Backend Server

```bash
# Terminal 1 - Start Backend
cd /home/kevin/Desktop/gambling-web/backend
npm run dev
```

**Expected Output:**
```
> raffle-backend@0.1.0 dev
> nodemon

[nodemon] 3.1.11
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/**/*,*.ts,*.json
[nodemon] starting `ts-node ./src/index.ts`
Server running on port 3001
Environment: development
```

**Verify Backend is Running:**
```bash
curl http://localhost:3001/health
# Expected: Health check response
```

---

## Step 2: Start the Frontend Server

```bash
# Terminal 2 - Start Frontend
cd /home/kevin/Desktop/gambling-web/frontend
npm run dev
```

**Expected Output:**
```
> raffle-frontend@0.1.0 dev
> next dev

   ▲ Next.js 14.2.35
   - Environments: .env.local

   ✓ Ready in 2.3s
   ✓ Compiled successfully
   ✓ Ready on http://localhost:3000
```

---

## Step 3: Access the Website

Open your browser and navigate to:
```
http://localhost:3000
```

---

## Test Cases

### Test Case 1: Home Page

**Objective:** Verify home page loads correctly

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `http://localhost:3000` | Page loads with hero section |
| 2 | Check for "RaffleSite" logo | Logo visible in header |
| 3 | Check for navigation menu | Competitions, Winners, How It Works links |
| 4 | Scroll down to "Live Competitions" | Competition cards displayed |
| 5 | Check footer | Footer with links and social icons |

**Pass Criteria:** ✅ All elements visible and properly styled

---

### Test Case 2: Competitions Listing Page

**Objective:** Verify competitions page with filters

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Competitions" in header | Navigate to `/competitions` |
| 2 | Check page title | "All Competitions" displayed |
| 3 | Check filter tabs | Live, Ending Soon, Sold Out, Completed |
| 4 | Click "Ending Soon" tab | URL updates to `?status=ending_soon` |
| 5 | Use category dropdown | Filters by category |
| 6 | Use sort dropdown | Sorts by newest, ending soon, price |
| 7 | Search for a competition | Results filter by search term |

**Pass Criteria:** ✅ All filters work, URL updates, results display correctly

---

### Test Case 3: User Registration

**Objective:** Verify new user can create account

**URL:** `http://localhost:3000/register`

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/register` | Registration form displays |
| 2 | Fill First Name "Test" | Field accepts input |
| 3 | Fill Last Name "User" | Field accepts input |
| 4 | Fill Email (new unique email) | Field accepts valid email format |
| 5 | Fill Phone (optional) | Field accepts input |
| 6 | Fill Password "password123" | Password strength shows |
| 7 | Confirm Password "password123" | Passwords match |
| 8 | Check Terms checkbox | Checkbox accepts selection |
| 9 | Click "Create Account" | Redirects to `/dashboard` |
| 10 | Check header for user name | "Test" displayed in dropdown |

**Pass Criteria:** ✅ Account created, user logged in, redirected to dashboard

**Test Email:** Use a unique email like `test+{date}@example.com`

---

### Test Case 4: User Login

**Objective:** Verify existing user can log in

**URL:** `http://localhost:3000/login`

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/login` | Login form displays |
| 2 | Fill Email "user@example.com" | Field accepts input |
| 3 | Fill Password "password123" | Field accepts input |
| 4 | Click "Sign In" | Redirects to `/dashboard` |
| 5 | Check redirect parameter | Add `?redirect=/competitions` and verify redirect |

**Pass Criteria:** ✅ User logged in, redirected correctly

---

### Test Case 5: Logout Functionality

**Objective:** Verify user can log out

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Ensure logged in | User name visible in header |
| 2 | Click user dropdown | Menu opens |
| 3 | Click "Logout" | User logged out, redirected to home |

**Pass Criteria:** ✅ User logged out, redirected to home

---

### Test Case 6: Forgot Password Flow

**Objective:** Verify password reset email flow

**URL:** `http://localhost:3000/forgot-password`

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/forgot-password` | Email input form displays |
| 2 | Enter registered email | "Check Your Email" success message |
| 3 | Check email inbox | Reset link received (check spam too) |
| 4 | Click reset link | Navigate to `/reset-password?token=xxx` |
| 5 | Enter new password | Form accepts new password |
| 6 | Confirm new password | Passwords match |
| 7 | Click "Reset Password" | Success message, link to login |

**Pass Criteria:** ✅ Email sent, reset link works, password reset

---

### Test Case 7: Protected Route Access

**Objective:** Verify authenticated routes redirect properly

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/dashboard` (not logged in) | Redirects to `/login` |
| 2 | Navigate to `/my-tickets` (not logged in) | Redirects to `/login` |
| 3 | Navigate to `/wallet` (not logged in) | Redirects to `/login` |
| 4 | Navigate to `/profile` (not logged in) | Redirects to `/login` |
| 5 | Login, then visit `/dashboard` | Dashboard loads |

**Pass Criteria:** ✅ All protected routes redirect when not logged in

---

### Test Case 8: Backend API Health

**Objective:** Verify backend is responding

```bash
# Run in terminal
curl http://localhost:3001/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-01-31T..."
}
```

---

### Test Case 9: API Authentication Test

**Objective:** Verify auth endpoints work

```bash
# Terminal - Run the full test suite
cd /home/kevin/Desktop/gambling-web/backend
./test_api.sh
```

**Expected Output:**
```
================================
PHASE 2 API TEST SUITE
================================
--- PUBLIC ENDPOINTS ---
Testing Health check... ✓ PASS
Testing Get competitions... ✓ PASS
Testing Get featured competitions... ✓ PASS
Testing Get winners... ✓ PASS

--- AUTHENTICATION ---
Testing User registration... ✓ PASS
Testing Admin login... ✓ PASS
Testing User login... ✓ PASS

--- SKILL-BASED ENTRY ---
Testing Verify correct answer... ✓ PASS
Testing Verify wrong answer... ✓ PASS

================================
RESULTS:
Passed: 9
Failed: 0
================================
ALL TESTS PASSED!
```

---

## Test Credentials

### Admin User
| Field | Value |
|-------|-------|
| Email | admin@example.com |
| Password | password123 |

### Regular User
| Field | Value |
|-------|-------|
| Email | user@example.com |
| Password | password123 |

### New User (Create during testing)
| Field | Value |
|-------|-------|
| Email | test+unique@example.com |
| Password | password123 |
| First Name | Test |
| Last Name | User |

---

## Testing Checklist

### Before Testing
- [ ] PostgreSQL is running
- [ ] Backend server is running (port 3001)
- [ ] Frontend server is running (port 3000)
- [ ] No errors in terminal

### During Testing
- [ ] All pages load without errors
- [ ] Forms validate correctly
- [ ] Errors display properly
- [ ] Loading states show during API calls
- [ ] Redirects work correctly

### After Testing
- [ ] All 9 test cases pass
- [ ] API tests pass (9/9)
- [ ] No console errors in browser

---

## Troubleshooting

### Backend Won't Start
```bash
# Check PostgreSQL
pg_isready -h localhost -p 5432

# If not running, start PostgreSQL
# Ubuntu: sudo service postgresql start
# macOS: brew services start postgresql
```

### Frontend Won't Start
```bash
# Clear Next.js cache
cd /home/kevin/Desktop/gambling-web/frontend
rm -rf .next
npm run dev
```

### API Tests Failing
```bash
# Ensure backend is running
curl http://localhost:3001/health

# Restart backend
cd /home/kevin/Desktop/gambling-web/backend
npm run dev
```

### Page Not Found (404)
```bash
# Ensure using correct URL
http://localhost:3000/login
http://localhost:3000/register
http://localhost:3000/competitions
```

---

## Quick Test Commands

```bash
# 1. Check backend health
curl http://localhost:3001/health

# 2. Run API tests
cd /home/kevin/Desktop/gambling-web/backend && ./test_api.sh

# 3. Build frontend (verify no errors)
cd /home/kevin/Desktop/gambling-web/frontend && npm run build

# 4. View frontend in browser
# Open: http://localhost:3000
```

---

## Expected Frontend Routes

| Route | Description | Status |
|-------|-------------|--------|
| `/` | Home page | ✅ Complete |
| `/login` | Login page | ✅ Complete |
| `/register` | Registration page | ✅ Complete |
| `/forgot-password` | Forgot password | ✅ Complete |
| `/reset-password` | Reset password | ✅ Complete |
| `/competitions` | Competitions listing | ✅ Complete |
| `/winners` | Winners gallery | ⏳ Pending |
| `/how-it-works` | How it works | ⏳ Pending |
| `/dashboard` | User dashboard | ⏳ Pending |
| `/cart` | Shopping cart | ⏳ Pending |
| `/checkout` | Checkout | ⏳ Pending |

---

## Summary

| Item | Status |
|------|--------|
| Backend Server | ✅ Running |
| Frontend Server | ✅ Running |
| Home Page | ✅ Working |
| Login Page | ✅ Working |
| Register Page | ✅ Working |
| Forgot Password | ✅ Working |
| Competitions Page | ✅ Working |
| Protected Routes | ✅ Working |
| API Tests | ✅ 9/9 Passing |

**All critical paths are functional and ready for further development!**
