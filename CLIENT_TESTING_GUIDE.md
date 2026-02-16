# 🎯 Client Testing Guide - Gambling Web Platform

## 📋 Overview

This guide will help you test all features of the gambling/raffle competition platform. Follow each section step-by-step to verify everything works correctly.

---

## ⚙️ Prerequisites (Already Done)

- ✅ Database seeded with test data
- ✅ Backend running on `http://localhost:5001`
- ✅ Frontend running on `http://localhost:3000`

---

## 🔑 Test Accounts

All test accounts use the same password: **`Admin123!`**

| Email | Role | Has Data |
|-------|------|----------|
| `admin@test.com` | Admin | Admin access |
| `user1@test.com` | User | Has tickets + 1 win (Rolex) |
| `user2@test.com` | User | Has tickets |

---

## 🧪 Test Scenarios

### ✅ TEST 1: Browse Competitions (No Login Required)

**Steps:**
1. Open browser: `http://localhost:3000`
2. Navigate to "Competitions"
3. Should see **3 competitions**

**Expected Results:**
- ✅ Tesla Model 3 (£40,000)
- ✅ iPhone 16 Pro Max (£1,200)
- ✅ Rolex Submariner (£8,000)
- ✅ Images, prices, ticket counts visible

---

### ✅ TEST 2: User Login

**Steps:**
1. Click "Login"
2. Email: `user1@test.com`
3. Password: `Admin123!`

**Expected Results:**
- ✅ Login successful
- ✅ Redirected to dashboard
- ✅ Navigation shows profile menu

---

### ✅ TEST 3: Purchase Tickets with Promo Code

**Steps:**
1. Login as any user
2. Select Tesla competition
3. Add 5 tickets (£25)
4. Apply promo: `WELCOME10`
5. Total should be: £22.50
6. Use Stripe test card: `4242 4242 4242 4242`

**Expected Results:**
- ✅ Promo code accepted
- ✅ 10% discount applied
- ✅ Payment successful
- ✅ Tickets in "My Tickets"

---

### ✅ TEST 4: View Ticket History

**Steps:**
1. Login as `user1@test.com`
2. Go to "My Tickets" > "History"

**Expected Results:**
- ✅ Shows orders grouped
- ✅ Order numbers visible (e.g., ORD-20260215-001)
- ✅ Total prices correct (e.g., £25.00)
- ✅ Purchase dates shown
- ✅ Tickets listed under each order

---

### ✅ TEST 5: Claim Prize & Certificate

**Steps:**
1. Login as `user1@test.com`
2. Go to "My Wins"
3. Should see **Rolex win**
4. Click "Claim Prize"
5. Enter delivery address
6. Submit claim
7. Click "Download Certificate"

**Expected Results:**
- ✅ Win shows with £8,000 prize
- ✅ Claim button works
- ✅ Address modal appears
- ✅ Status updates to "Claimed"
- ✅ PDF certificate downloads
- ✅ PDF shows winner details

---

### ✅ TEST 6: Wallet Deposit

**Steps:**
1. Go to "Wallet"
2. Enter amount: £50
3. Click "Deposit"
4. Complete Stripe payment

**Expected Results:**
- ✅ Stripe form appears
- ✅ Payment successful
- ✅ Balance updates
- ✅ Transaction in history

---

## 🔍 Quick Database Verification

If nothing shows, check database:

```bash
# Check competitions
psql postgresql://raffle_user:password@localhost:5432/raffle_db -c "SELECT title, status FROM competitions;"

# Check users
psql postgresql://raffle_user:password@localhost:5432/raffle_db -c "SELECT email FROM users WHERE email LIKE '%@test.com';"

# Check tickets for user1
psql postgresql://raffle_user:password@localhost:5432/raffle_db -c "SELECT COUNT(*) FROM tickets WHERE user_id = (SELECT id FROM users WHERE email = 'user1@test.com');"
```

---

## 🐛 Common Issues

### "No competitions showing"
- Check backend running: `curl http://localhost:5001/api/health`
- Check browser console (F12) for errors

### "Promo code not working"
- Check promo_codes table has data
- Check backend using database (not hardcoded)

### "Order total shows £0.00"
- Backend not returning order data correctly
- Check ticket.controller.ts getHistory method

### "Claim Prize does nothing"
- Frontend handler missing
- Check my-wins/page.tsx has handleClaimPrize

---

## ✅ Test Checklist

- [x] Competitions display
- [x] Login works
- [ ] Purchase tickets
- [ ] Promo codes work
- [x] Ticket history shows orders
- [x] Claim prize works
- [x] Download certificate works
- [ ] Wallet deposit works

---

**All tests passing? Platform is ready!** 🎉
