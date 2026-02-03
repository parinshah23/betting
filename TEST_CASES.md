# 🧪 Production Test Cases

**Website Name:** WinBig Competition Platform  
**Test Date:** Run these after filling in your Gmail App Password  
**Expected Time:** 10 minutes

---

## 🚀 QUICK START - Run These Tests

### Test 1: Email Configuration Test (30 seconds)

```bash
# 1. Start the backend server
cd /home/kevin/Desktop/gambling-web/backend
npm run dev

# 2. In another terminal, test email:
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "kevinpatil6354@gmail.com",
    "password": "TestPass123!",
    "first_name": "Kevin",
    "last_name": "Patil"
  }'

# 3. Check your Gmail inbox (kevinpatil6354@gmail.com)
# ✅ PASS: You receive a welcome email from "WinBig Competition Platform"
# ❌ FAIL: No email arrives (check server logs for errors)
```

**Expected Result:**
- Subject: "Welcome to WinBig Competition Platform!"
- Sender: kevinpatil6354@gmail.com
- Content: Welcome message with browse competitions button

---

## 📋 COMPLETE TEST SUITE

### **Category 1: Authentication Tests**

#### Test 1.1: User Registration with Email
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-user@example.com",
    "password": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe"
  }'
```
**Expected:**
- ✅ HTTP 201 Created
- ✅ Response: `{ "success": true, "data": { "id": "...", "email": "..." } }`
- ✅ Welcome email sent to test-user@example.com
- ✅ Email from: "WinBig Competition Platform <kevinpatil6354@gmail.com>"

#### Test 1.2: Password Reset Email
```bash
# Step 1: Request password reset
curl -X POST http://localhost:3001/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "kevinpatil6354@gmail.com"}'

# Step 2: Check email inbox
# Should receive email with reset link
```
**Expected:**
- ✅ HTTP 200 Success
- ✅ Password reset email arrives
- ✅ Contains reset token link
- ✅ Subject: "Password Reset Request"

#### Test 1.3: User Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "kevinpatil6354@gmail.com",
    "password": "TestPass123!"
  }'
```
**Expected:**
- ✅ HTTP 200 Success
- ✅ Response includes accessToken and refreshToken
- ✅ User data returned

---

### **Category 2: Competition Tests**

#### Test 2.1: List Competitions
```bash
curl http://localhost:3001/api/competitions
```
**Expected:**
- ✅ HTTP 200 Success
- ✅ Returns array of competitions
- ✅ Each competition has: id, title, slug, status, ticket_price, etc.

#### Test 2.2: Get Single Competition
```bash
curl http://localhost:3001/api/competitions/1
```
**Expected:**
- ✅ HTTP 200 Success
- ✅ Full competition details
- ✅ Includes images, description, skill question

---

### **Category 3: Order & Payment Tests**

#### Test 3.1: Create Order (with wallet)
```bash
# First login to get token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"kevinpatil6354@gmail.com","password":"TestPass123!"}'

# Then create order (replace TOKEN with actual token from login)
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"use_wallet_balance": true}'
```
**Expected:**
- ✅ HTTP 201 Created
- ✅ Order confirmation email sent
- ✅ Email shows order number and items

#### Test 3.2: Order Confirmation Email Content
**Check email contains:**
- ✅ Subject: "Order Confirmation #[ORDER_NUMBER]"
- ✅ From: "WinBig Competition Platform"
- ✅ Order number displayed
- ✅ Total amount in GBP
- ✅ List of items purchased
- ✅ "View My Tickets" button/link

---

### **Category 4: Admin Tests**

#### Test 4.1: Admin Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```
**Expected:**
- ✅ HTTP 200 Success
- ✅ User role is "admin"

#### Test 4.2: Access Admin Dashboard Data
```bash
# Use admin token
curl http://localhost:3001/api/admin/stats \
  -H "Authorization: Bearer ADMIN_TOKEN"
```
**Expected:**
- ✅ HTTP 200 Success
- ✅ Returns dashboard statistics
- ✅ totalUsers, totalRevenue, pendingOrders, etc.

#### Test 4.3: Execute Draw & Winner Notification
```bash
# Execute draw for a completed competition
curl -X POST http://localhost:3001/api/admin/competitions/1/draw \
  -H "Authorization: Bearer ADMIN_TOKEN"
```
**Expected:**
- ✅ HTTP 200 Success
- ✅ Winner selected randomly
- ✅ Winner notification email sent
- ✅ Email subject: "🎉 Congratulations! You've Won!"
- ✅ Shows winning ticket number and prize value

---

### **Category 5: File Upload Tests**

#### Test 5.1: Upload Image
```bash
# Create a test file first
echo "test image content" > test-image.jpg

# Upload
curl -X POST http://localhost:3001/api/upload/image \
  -H "Authorization: Bearer TOKEN" \
  -F "image=@test-image.jpg"
```
**Expected:**
- ✅ HTTP 201 Created
- ✅ Returns image URL
- ✅ File saved in backend/uploads/

---

### **Category 6: Frontend Integration Tests**

#### Test 6.1: Homepage Load
```bash
# Start frontend
cd /home/kevin/Desktop/gambling-web/frontend
npm run dev

# Visit in browser: http://localhost:3000
```
**Expected:**
- ✅ Page loads without errors
- ✅ Featured competitions displayed
- ✅ Navigation works
- ✅ No console errors

#### Test 6.2: Complete User Flow
**Manual test in browser:**
1. ✅ Register new account
2. ✅ Check email for welcome message
3. ✅ Login
4. ✅ Browse competitions
5. ✅ View single competition
6. ✅ Add tickets to cart
7. ✅ Checkout with Stripe test card: `4242 4242 4242 4242`
8. ✅ Check email for order confirmation
9. ✅ View "My Tickets" page
10. ✅ View "My Profile" page

---

## ✅ **TEST RESULTS CHECKLIST**

**Mark each test after running:**

### Authentication
- [ ] Test 1.1: User Registration (with welcome email)
- [ ] Test 1.2: Password Reset Email
- [ ] Test 1.3: User Login

### Competitions
- [ ] Test 2.1: List Competitions
- [ ] Test 2.2: Get Single Competition

### Orders & Payments
- [ ] Test 3.1: Create Order
- [ ] Test 3.2: Order Confirmation Email

### Admin
- [ ] Test 4.1: Admin Login
- [ ] Test 4.2: Admin Dashboard Stats
- [ ] Test 4.3: Execute Draw (winner email)

### File Upload
- [ ] Test 5.1: Image Upload

### Frontend
- [ ] Test 6.1: Homepage Loads
- [ ] Test 6.2: Complete User Flow

---

## 🐛 TROUBLESHOOTING

### If emails don't arrive:
```bash
# Check server logs for errors
# Look for: "Failed to send email" or SMTP errors

# Verify Gmail settings:
# 1. Is 2FA enabled? https://myaccount.google.com/security
# 2. Is App Password correct? https://myaccount.google.com/apppasswords
# 3. Check Gmail spam folder
# 4. Check "Sent" folder in Gmail (should show sent emails)
```

### If tests fail:
```bash
# 1. Check if server is running
ps aux | grep node

# 2. Check server logs
npm run dev
# Look for error messages

# 3. Verify database is connected
# Test: curl http://localhost:3001/health

# 4. Check environment variables loaded
curl http://localhost:3001/api/competitions
# Should return data, not error
```

---

## 🎯 **ALL TESTS PASSED?**

If all 12 tests pass, you're **ready for production!** 🚀

**Next steps:**
1. Deploy to production server
2. Update FRONTEND_URL and API_BASE_URL to production domains
3. Switch Stripe to Live mode
4. Launch! 🎉

**Questions?** Check server logs or run individual curl commands to debug.
