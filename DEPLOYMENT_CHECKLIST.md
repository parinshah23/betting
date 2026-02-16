# ✅ Deployment Checklist - Quick Reference

**Print this and check off as you go!**

---

## 📋 Pre-Deployment (20 min)

- [ ] Create GitHub account / Login
- [ ] Create Vercel account (sign up with GitHub)
- [ ] Create Render account (sign up with GitHub)  
- [ ] Create Stripe account (get test keys)
- [ ] Setup Gmail 2-Step + App Password
- [ ] Create Cloudinary account (get credentials)

---

## 🗄️ Phase 1: Database (15 min)

- [ ] Create PostgreSQL on Render (FREE tier)
- [ ] Copy Internal Database URL
- [ ] Save credentials somewhere safe
- [ ] Test connection with psql

---

## 🔧 Phase 2: Backend (30 min)

- [ ] Push code to GitHub
- [ ] Generate JWT secrets (2 commands)
- [ ] Fill out `.env.production` file
- [ ] Create Render Web Service
- [ ] Add ALL environment variables
- [ ] Wait for deployment (5-10 min)
- [ ] Run database migrations
- [ ] Seed database with test data
- [ ] Update API_BASE_URL variable
- [ ] Test: Open backend URL in browser

---

## 🎨 Phase 3: Frontend (15 min)

- [ ] Create `.env.production` in frontend folder
- [ ] Get Stripe publishable key
- [ ] Deploy to Vercel
- [ ] Add environment variables
- [ ] Wait for deployment (2-3 min)
- [ ] Copy frontend URL
- [ ] Update backend FRONTEND_URL variable
- [ ] Test: Open frontend URL in browser

---

## 🔌 Phase 4: Integrations (20 min)

- [ ] Create Stripe webhook endpoint
- [ ] Select events: payment succeeded, failed, refunded
- [ ] Copy webhook secret
- [ ] Update STRIPE_WEBHOOK_SECRET in backend
- [ ] Test: Send test webhook from Stripe
- [ ] Test: Register new user (check email)
- [ ] Test: Complete test purchase

---

## ✅ Phase 5: Testing (30 min)

- [ ] Homepage loads without errors
- [ ] Can register new user
- [ ] Receive welcome email
- [ ] Can login
- [ ] Competitions page shows competitions
- [ ] Can add tickets to cart
- [ ] Can apply promo code WELCOME10
- [ ] Can complete purchase (test card: 4242 4242 4242 4242)
- [ ] Tickets appear in "My Tickets"
- [ ] Can view ticket history
- [ ] Login as user1@test.com (see wins)
- [ ] Can claim prize
- [ ] Can download certificate
- [ ] Wallet deposit works
- [ ] All images load correctly
- [ ] No console errors (F12)

---

## 🎯 Final Checks

- [ ] Frontend URL works: https://_____.vercel.app
- [ ] Backend URL works: https://_____.onrender.com
- [ ] Database connected (green status in Render)
- [ ] Emails sending (check spam folder)
- [ ] Stripe payments working
- [ ] Webhook responding (check Stripe dashboard)
- [ ] All test accounts work
- [ ] Client testing guide shared

---

## 📝 Save These URLs

```
Frontend: https://______________.vercel.app
Backend: https://______________.onrender.com
GitHub: https://github.com/________/gambling-web

Admin: admin@test.com / Admin123!
Test User: user1@test.com / Admin123!

Stripe Test Card: 4242 4242 4242 4242
```

---

## ⏱️ Total Time Estimate

- **Fast:** 1.5 hours (if everything goes smoothly)
- **Normal:** 2-3 hours (with some troubleshooting)
- **If issues:** 4-5 hours (database/config problems)

---

## 🆘 If Stuck

1. Check DEPLOYMENT_PLAN.md troubleshooting section
2. Check platform logs (Render/Vercel dashboard)
3. Check browser console (F12)
4. Search error message online
5. Ask Claude with specific error

---

**Start Date:** ___/___/2026
**Completed:** ___/___/2026
**Deployment Status:** ⏳ In Progress / ✅ Complete
