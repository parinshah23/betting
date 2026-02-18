# 🚀 Complete Deployment Plan - PremiumCompitions Platform (Free Tier)

## 📋 Table of Contents
1. [Platform Selection & Why](#platform-selection)
2. [Prerequisites & Accounts Setup](#prerequisites)
3. [Phase 1: Database Setup (Render PostgreSQL)](#phase-1-database)
4. [Phase 2: Backend Deployment (Render)](#phase-2-backend)
5. [Phase 3: Frontend Deployment (Vercel)](#phase-3-frontend)
6. [Phase 4: Third-Party Integrations](#phase-4-integrations)
7. [Phase 5: Testing & Verification](#phase-5-testing)
8. [Troubleshooting Guide](#troubleshooting)

---

## 🎯 Platform Selection & Why {#platform-selection}

### **Frontend: Vercel** ✅
**Why:**
- Created by Next.js team (perfect compatibility)
- **Free Forever:** 100GB bandwidth/month, unlimited deployments
- Automatic HTTPS & CDN
- Zero configuration for Next.js
- Instant rollbacks

**Alternatives Considered:**
- Netlify (good but not Next.js native)
- Cloudflare Pages (limited Next.js features)

---

### **Backend: Render.com** ✅
**Why:**
- **Free Tier:** 750 hours/month (enough for testing)
- PostgreSQL included (free 90 days, then need upgrade or migrate)
- No credit card required initially
- Auto-deploy from GitHub
- Built-in health checks

**Alternatives Considered:**
- Railway (free trial limited)
- Fly.io (more complex)
- Heroku (no longer free)

---

### **Database: Render PostgreSQL (then migrate to Neon)** ✅
**Why:**
- **Phase 1:** Use Render free PostgreSQL (90 days)
- **Phase 2:** Migrate to Neon.tech (3GB free forever)
- Render PostgreSQL expires after 90 days on free tier
- Neon has better long-term free tier

---

## ✅ Prerequisites & Accounts Setup {#prerequisites}

### **👤 HUMAN TASK 1: Create Required Accounts**

**Time Required:** 20 minutes

#### 1.1 GitHub Account
- **URL:** https://github.com/signup
- **Required:** To push code and connect deployments
- **Action:** Sign up or login

#### 1.2 Vercel Account  
- **URL:** https://vercel.com/signup
- **Sign up with:** GitHub account (recommended)
- **Free Tier:** Yes, no credit card needed

#### 1.3 Render Account
- **URL:** https://render.com/register
- **Sign up with:** GitHub account (recommended)
- **Free Tier:** Yes, no credit card needed initially

#### 1.4 Stripe Account (for payments)
- **URL:** https://dashboard.stripe.com/register
- **Required:** For payment processing
- **Get:** Test API keys (free)
- **Note:** Can use test mode forever for testing

#### 1.5 Gmail for SMTP (for emails)
- **URL:** https://gmail.com
- **Required:** To send emails (free)
- **Setup:** Enable 2-Step Verification + App Password

#### 1.6 Cloudinary Account (for images)
- **URL:** https://cloudinary.com/users/register/free
- **Free Tier:** 25GB storage, 25GB bandwidth/month
- **Get:** Cloud name, API key, API secret

---

## 📦 Phase 1: Database Setup (Render PostgreSQL) {#phase-1-database}

**Estimated Time:** 15 minutes

### **👤 HUMAN TASK 2: Create PostgreSQL Database on Render**

#### Step 1.1: Create Database
1. Go to https://dashboard.render.com
2. Click **"New +"** button (top right)
3. Select **"PostgreSQL"**
4. Fill in:
   - **Name:** `gambling-web-db`
   - **Database:** `raffle_db`
   - **User:** `raffle_user`
   - **Region:** Choose closest to your users (e.g., Frankfurt for Europe)
   - **PostgreSQL Version:** 16 (latest)
   - **Instance Type:** **Free** ⚠️ IMPORTANT: Select FREE tier
5. Click **"Create Database"**
6. **Wait 2-3 minutes** for database to provision

#### Step 1.2: Get Database Connection String
1. Once created, go to database dashboard
2. Scroll to **"Connections"** section
3. Copy **"Internal Database URL"** (starts with `postgresql://`)
4. **Save this URL** - you'll need it for backend deployment

**Example URL format:**
```
postgresql://raffle_user:abcd1234xyz@dpg-xxxxx.frankfurt-postgres.render.com/raffle_db
```

#### Step 1.3: Note Database Credentials
Save these separately (from Info section):
```
Hostname: dpg-xxxxx.frankfurt-postgres.render.com
Port: 5432
Database: raffle_db
Username: raffle_user
Password: [shown in Render dashboard]
```

⚠️ **IMPORTANT:** Free PostgreSQL expires after 90 days. Plan to migrate to Neon.tech before then.

---

## 🔧 Phase 2: Backend Deployment (Render) {#phase-2-backend}

**Estimated Time:** 30 minutes

### **👤 HUMAN TASK 3: Prepare Backend for Deployment**

#### Step 2.1: Push Code to GitHub

**On your local machine:**

```bash
cd /home/kevin/Desktop/gambling-web

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - ready for deployment"

# Create GitHub repository (go to https://github.com/new)
# Name it: gambling-web
# Don't initialize with README

# Push code
git remote add origin https://github.com/YOUR_USERNAME/gambling-web.git
git branch -M main
git push -u origin main
```

#### Step 2.2: Create Production Environment File

**Create:** `backend/.env.production` (copy from template)

```bash
cd backend
cp .env.example .env.production
```

**Edit `backend/.env.production` with these values:**

```env
# ============================================
# SERVER CONFIGURATION
# ============================================
NODE_ENV=production
PORT=10000
# ⚠️ FILL THIS AFTER BACKEND DEPLOYMENT (will be like: https://gambling-web-api.onrender.com)
API_BASE_URL=https://YOUR_BACKEND_URL.onrender.com
# ⚠️ FILL THIS AFTER FRONTEND DEPLOYMENT (will be like: https://gambling-web.vercel.app)
FRONTEND_URL=https://YOUR_FRONTEND_URL.vercel.app

# ============================================
# DATABASE (from Phase 1)
# ============================================
DATABASE_URL=postgresql://raffle_user:password@dpg-xxxxx.render.com/raffle_db

# ============================================
# JWT SECRETS - Generate New Ones!
# ============================================
# Run this command to generate:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

JWT_SECRET=PASTE_64_CHAR_HEX_HERE
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=PASTE_ANOTHER_64_CHAR_HEX_HERE
REFRESH_TOKEN_EXPIRES_IN=30d

# ============================================
# GMAIL SMTP (Free)
# ============================================
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
# ⚠️ FILL YOUR GMAIL
SMTP_USER=your.email@gmail.com
# ⚠️ FILL APP PASSWORD (not your Gmail password!)
SMTP_PASS=your_16_char_app_password
EMAIL_FROM=your.email@gmail.com
EMAIL_FROM_NAME=Gambling Web Platform

# ============================================
# STRIPE (Test Keys for now)
# ============================================
# Get from: https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_KEY_HERE
# Get from: https://dashboard.stripe.com/test/webhooks
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# ============================================
# CLOUDINARY (for image uploads)
# ============================================
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ============================================
# FILE UPLOAD
# ============================================
UPLOAD_DIR=/tmp/uploads
MAX_FILE_SIZE=5242880

# ============================================
# RATE LIMITING
# ============================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ============================================
# SENTRY (Optional - for error tracking)
# ============================================
# SENTRY_DSN=https://your-sentry-dsn-here
```

**🚨 DO NOT commit this file to git!**

---

### **👤 HUMAN TASK 4: Generate JWT Secrets**

**On your local machine, run:**

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Copy output and paste into JWT_SECRET in .env.production

# Generate REFRESH_TOKEN_SECRET (run again)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Copy output and paste into REFRESH_TOKEN_SECRET
```

---

### **👤 HUMAN TASK 5: Setup Gmail App Password**

**Follow these steps:**

1. **Enable 2-Step Verification:**
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Follow steps to enable

2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it: "PremiumCompitions"
   - Click "Generate"
   - **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)
   - Remove spaces: `abcdefghijklmnop`
   - Paste into `SMTP_PASS` in `.env.production`

---

### **👤 HUMAN TASK 6: Get Stripe Test Keys**

1. Go to: https://dashboard.stripe.com/test/apikeys
2. Make sure you're in **Test Mode** (toggle in top right)
3. Copy **"Secret key"** (starts with `sk_test_`)
4. Paste into `STRIPE_SECRET_KEY` in `.env.production`
5. **Webhook secret** - we'll set this up after deployment

---

### **👤 HUMAN TASK 7: Get Cloudinary Credentials**

1. Go to: https://cloudinary.com/console
2. Copy **"Cloud Name"** → paste into `CLOUDINARY_CLOUD_NAME`
3. Copy **"API Key"** → paste into `CLOUDINARY_API_KEY`
4. Copy **"API Secret"** → paste into `CLOUDINARY_API_SECRET`

---

### **👤 HUMAN TASK 8: Deploy Backend on Render**

#### Step 2.3: Create Web Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect account"** and authorize GitHub
4. Select your repository: `gambling-web` (your GitHub repo name stays as-is)
5. Fill in:

**Basic Settings:**
```
Name: premiumcompitions-backend
Region: Frankfurt (or closest to you)
Branch: main
Root Directory: backend
```

**Build & Deploy:**
```
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
```

> ⚠️ **Note:** `@types/*` and `typescript` have been moved to `dependencies` (not `devDependencies`) so they are installed during the production build. This is already done in the code — no extra steps needed.

**Instance Type:**
```
⚠️ Select: Free
```

#### Step 2.4: Add Environment Variables

In the **"Environment Variables"** section, add ALL variables from your `.env.production`:

**Click "Add Environment Variable"** for each:

```
NODE_ENV = production
PORT = 10000
DATABASE_URL = [paste from Phase 1]
JWT_SECRET = [your generated secret]
REFRESH_TOKEN_SECRET = [your generated secret]
JWT_EXPIRES_IN = 15m
REFRESH_TOKEN_EXPIRES_IN = 30d
EMAIL_PROVIDER = smtp
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = [your gmail]
SMTP_PASS = [your app password]
EMAIL_FROM = [your gmail]
EMAIL_FROM_NAME = PremiumCompitions
STRIPE_SECRET_KEY = [your stripe key]
STRIPE_WEBHOOK_SECRET = placeholder
CLOUDINARY_CLOUD_NAME = [your cloud name]
CLOUDINARY_API_KEY = [your api key]
CLOUDINARY_API_SECRET = [your api secret]
UPLOAD_DIR = /tmp/uploads
MAX_FILE_SIZE = 5242880
RATE_LIMIT_WINDOW_MS = 900000
RATE_LIMIT_MAX_REQUESTS = 100
FRONTEND_URL = https://placeholder.com
```

> ⚠️ **Important:** `FRONTEND_URL` and `STRIPE_WEBHOOK_SECRET` **must not be left empty** — the server will crash on startup if they are missing or blank. Use `https://placeholder.com` and `placeholder` for now. You will update them with real values after frontend deployment and Stripe webhook setup.

**For `API_BASE_URL`:** Leave empty for now, add it after deployment.

6. Click **"Create Web Service"**
7. **Wait 5-10 minutes** for first deployment

#### Step 2.5: Get Backend URL

Once deployed:
1. Your backend URL will be: `https://premiumcompitions-backend.onrender.com`
2. **Copy this URL** - you'll need it for frontend
3. Test it: Open `https://premiumcompitions-backend.onrender.com/api/competitions` in browser

---

### **👤 HUMAN TASK 9: Run Database Migrations**

> ✅ **No manual action needed!** Migrations now run **automatically on server startup**.

The backend has a built-in migration runner (`src/config/migrate.ts`) that:
- Runs all 15 SQL migration files in order on every startup
- Tracks applied migrations in a `_migrations` table
- Skips already-applied migrations on future restarts
- Works entirely on the free tier — no Render Shell required

> ⚠️ **Note:** Render Shell requires a paid plan. The auto-migration approach was added specifically to avoid this limitation.

**Verify migrations ran** by checking Render logs after first deploy — you should see:
```
✅ Migration applied: 001_create_users.sql
✅ Migration applied: 002_create_competitions.sql
...
✅ Applied 15 migration(s) successfully.
```

On subsequent restarts:
```
✅ Database up to date, no migrations needed.
```

---

### **👤 HUMAN TASK 10: Seed Database (Optional but Recommended)**

> ⚠️ **Render Shell requires a paid plan.** Use the `RUN_SEEDS` environment variable instead — no shell access needed.

#### How to seed using env var:

1. Go to Render dashboard → Backend service → **Environment**
2. Add this variable:
   ```
   RUN_SEEDS = true
   ```
3. Click **"Save Changes"** → service will redeploy and run seeds automatically on startup
4. Check Render logs — you should see:
   ```
   🌱 RUN_SEEDS=true detected, running seeds...
   ✅ Database seeded successfully!
   ```
5. **Important:** After seeding, go back to Environment, **delete the `RUN_SEEDS` variable**, and save again. This prevents seeds from running again on the next restart (which would wipe and re-insert test data).

**This creates:**
- 3 test users (admin@test.com, user1@test.com, user2@test.com)
- 3 competitions (Tesla, iPhone, Rolex)
- 5 promo codes
- Sample orders and tickets

**Test accounts:** All use password `Admin123!`

---

### **👤 HUMAN TASK 11: Update Backend URLs**

1. Go back to Render dashboard → Backend service → Environment
2. Update these values:

```
API_BASE_URL = https://premiumcompitions-backend.onrender.com
FRONTEND_URL = https://placeholder.com
```

> ⚠️ Do **not** leave `FRONTEND_URL` empty — the server will crash. Use `https://placeholder.com` until your Vercel frontend is deployed, then update it with the real URL.

3. Click **"Save Changes"**
4. Service will auto-redeploy (1-2 minutes)

---

## 🎨 Phase 3: Frontend Deployment (Vercel) {#phase-3-frontend}

**Estimated Time:** 15 minutes

### **👤 HUMAN TASK 12: Prepare Frontend Environment**

#### Step 3.1: Create Frontend .env.production

**Create:** `frontend/.env.production`

```env
# Backend API URL (from Phase 2)
NEXT_PUBLIC_API_URL=https://premiumcompitions-backend.onrender.com/api

# Stripe Publishable Key (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
```

**Get Stripe Publishable Key:**
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy **"Publishable key"** (starts with `pk_test_`)
3. Paste above

---

### **👤 HUMAN TASK 13: Deploy Frontend on Vercel**

#### Step 3.2: Deploy to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your `gambling-web` repository (your GitHub repo name stays as-is)
4. Configure:

```
Framework Preset: Next.js
Root Directory: frontend
Build Command: npm run build
Output Directory: (leave default)
Install Command: npm install
```

5. **Environment Variables:**

Click "Environment Variables" and add:

```
NEXT_PUBLIC_API_URL = https://premiumcompitions-backend.onrender.com/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_YOUR_KEY
```

6. Click **"Deploy"**
7. **Wait 2-3 minutes** for deployment

#### Step 3.3: Get Frontend URL

Once deployed:
1. Your frontend URL will be: `https://premiumcompitions.vercel.app`
2. **Copy this URL**
3. Open it in browser to verify

---

### **👤 HUMAN TASK 14: Update Backend with Frontend URL**

1. Go to Render dashboard → Backend service → Environment
2. Find `FRONTEND_URL` variable
3. Set value to: `https://premiumcompitions.vercel.app`
4. **Also add new variable:**
```
CORS_ORIGIN = https://premiumcompitions.vercel.app
```
5. Click **"Save Changes"**
6. Wait for backend to redeploy (1-2 minutes)

---

## 🔌 Phase 4: Third-Party Integrations {#phase-4-integrations}

**Estimated Time:** 20 minutes

### **👤 HUMAN TASK 15: Setup Stripe Webhook** *(Optional for initial testing — skip and come back later)*

> ℹ️ **You can skip this task initially.** Payments will still work without webhooks during testing. The webhook only adds server-side payment confirmation as a backup. Come back to this once the rest of the platform is working.
>
> **To find webhooks in Stripe sandbox:**
> - Left sidebar → **"Developers"** → **"Webhooks"**
> - Or direct URL: https://dashboard.stripe.com/test/webhooks
> - If you see **"Add destination"** instead of **"Add endpoint"**, that's the same thing — Stripe renamed it.
> - Keep `STRIPE_WEBHOOK_SECRET = placeholder` in Render until you set this up.

#### Step 4.1: Create Webhook Endpoint

> **Your webhook endpoint URL is:**
> ```
> https://premiumcompitions-backend.onrender.com/api/webhooks/stripe
> ```
> This comes from `app.ts` → `app.use('/api/webhooks', webhookRoutes)` + `router.post('/stripe', ...)`.

**Steps in Stripe dashboard:**

1. Go to https://dashboard.stripe.com/test/webhooks
2. Make sure you are in **Test Mode** (toggle in top-right corner)
3. Click **"Add destination"** (Stripe recently renamed "Add endpoint" to "Add destination")
4. On the next screen:
   - Select **"Webhook"**
   - Click **"Continue"**
5. Fill in the form:
   - **Endpoint URL:** `https://premiumcompitions-backend.onrender.com/api/webhooks/stripe`
   - **Description:** `PremiumCompitions payment events` *(optional)*
6. Under **"Select events"**, search and add:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
7. Click **"Add destination"** / **"Create"** to save

#### Step 4.2: Get Webhook Secret

1. Click on the webhook/destination you just created
2. Find **"Signing secret"** section → click **"Reveal"**
3. Copy the value (starts with `whsec_`)
4. Go to Render → Backend service → **Environment**
5. Update `STRIPE_WEBHOOK_SECRET` with this value (replace `placeholder`)
6. Click **"Save Changes"** → backend will redeploy

#### Step 4.3: Test Webhook

1. In Stripe dashboard, click on your webhook → **"Send test webhook"**
2. Select event: `payment_intent.succeeded`
3. Click **"Send test webhook"**
4. Should show **200 OK** response
5. Check Render logs — should show: `Received Stripe webhook: payment_intent.succeeded`

---

### **👤 HUMAN TASK 16: Verify Email Sending**

#### Step 4.4: Test Email

**Method 1: Via Frontend**
1. Go to your frontend URL
2. Click "Register"
3. Create a new account
4. Check email inbox (and spam folder)
5. Should receive welcome email

**Method 2: Via API**
```bash
curl -X POST https://premiumcompitions-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "first_name": "Test",
    "last_name": "User"
  }'
```

**If email doesn't arrive:**
- Check Render logs for errors
- Verify Gmail App Password is correct
- Check Gmail "Less secure app access" settings
- Try sending to different email address

---

## ✅ Phase 5: Testing & Verification {#phase-5-testing}

**Estimated Time:** 30 minutes

### **👤 HUMAN TASK 17: Complete Testing Checklist**

#### Test 1: Basic Functionality

**Visit:** `https://premiumcompitions.vercel.app`

- [ ] ✅ Homepage loads
- [ ] ✅ Competitions page shows competitions
- [ ] ✅ Images load correctly
- [ ] ✅ No console errors (F12 → Console)

#### Test 2: User Registration & Login

- [ ] ✅ Register new user
- [ ] ✅ Receive welcome email
- [ ] ✅ Login works
- [ ] ✅ Dashboard accessible
- [ ] ✅ Profile shows user info

#### Test 3: Competition Browsing

- [ ] ✅ View competition details
- [ ] ✅ See ticket counts
- [ ] ✅ See prize values
- [ ] ✅ "Buy Tickets" button works

#### Test 4: Purchase Flow (Use Stripe Test Card)

**Test Card:** `4242 4242 4242 4242`
**Expiry:** Any future date (e.g., `12/26`)
**CVC:** Any 3 digits (e.g., `123`)

- [ ] ✅ Add tickets to cart
- [ ] ✅ Apply promo code: `WELCOME10` (should give 10% off)
- [ ] ✅ Proceed to checkout
- [ ] ✅ Stripe payment form loads
- [ ] ✅ Complete payment with test card
- [ ] ✅ Redirected to success page
- [ ] ✅ Tickets appear in "My Tickets"
- [ ] ✅ Receive order confirmation email

#### Test 5: Wallet Features

- [ ] ✅ Wallet page loads
- [ ] ✅ Shows current balance
- [ ] ✅ Deposit money works (use test card)
- [ ] ✅ Balance updates
- [ ] ✅ Transaction history shows

#### Test 6: Winner Features (Use seeded data)

**Login as:** `user1@test.com` / `Admin123!`

- [ ] ✅ My Wins page shows Rolex win
- [ ] ✅ Can click "Claim Prize"
- [ ] ✅ Can download certificate PDF
- [ ] ✅ Ticket history shows correct orders

#### Test 7: Admin Features (if applicable)

**Login as:** `admin@test.com` / `Admin123!`

- [ ] ✅ Admin panel accessible
- [ ] ✅ Can view all users
- [ ] ✅ Can view all orders
- [ ] ✅ Can execute competition draws

---

## 🐛 Troubleshooting Guide {#troubleshooting}

### Issue 1: Backend Won't Deploy

**Symptoms:** Build fails, service crashes

**Solutions:**

1. **Check Build Logs:**
   - Go to Render dashboard → Logs
   - Look for error messages

2. **Common Errors:**

   **Error: "Cannot find module"**
   ```
   Fix: Check package.json has all dependencies
   Run: npm install locally and commit package-lock.json
   ```

   **Error: "Database connection failed"**
   ```
   Fix: Verify DATABASE_URL is correct
   Check: Database is running (green status in Render)
   Test: psql $DATABASE_URL from local machine
   ```

   **Error: "Port already in use"**
   ```
   Fix: Check PORT variable is set to 10000
   Render automatically assigns PORT, make sure you use process.env.PORT
   ```

---

### Issue 2: Frontend Shows API Errors

**Symptoms:** "Failed to fetch", API errors in console

**Solutions:**

1. **Check CORS Settings:**
   - Verify `FRONTEND_URL` is set in backend environment
   - Check backend logs for CORS errors
   - Make sure `cors` middleware is configured

2. **Check API URL:**
   - Verify `NEXT_PUBLIC_API_URL` in frontend environment
   - Should be: `https://your-backend.onrender.com/api`
   - Must include `/api` at the end

3. **Test Backend Directly:**
   ```bash
   curl https://premiumcompitions-backend.onrender.com/api/competitions
   ```
   Should return JSON with competitions

---

### Issue 3: Emails Not Sending

**Symptoms:** No emails received, errors in logs

**Solutions:**

1. **Verify Gmail Settings:**
   - 2-Step Verification is ENABLED
   - Using App Password (NOT regular Gmail password)
   - App Password has no spaces

2. **Check Logs:**
   - Look for email-related errors in Render logs
   - Common: "Invalid login" = wrong password

3. **Test SMTP Credentials:**
   ```bash
   # On local machine
   node -e "
   const nodemailer = require('nodemailer');
   const transporter = nodemailer.createTransport({
     host: 'smtp.gmail.com',
     port: 587,
     secure: false,
     auth: {
       user: 'your@gmail.com',
       pass: 'your_app_password'
     }
   });
   transporter.verify().then(() => console.log('✅ SMTP OK')).catch(err => console.error('❌', err));
   "
   ```

---

### Issue 4: Payment/Stripe Not Working

**Symptoms:** Payment fails, webhook errors

**Solutions:**

1. **Verify Stripe Keys:**
   - Test mode keys start with `pk_test_` and `sk_test_`
   - Live mode keys start with `pk_live_` and `sk_live_`
   - Make sure you're using correct mode

2. **Check Webhook:**
   - Go to Stripe dashboard → Webhooks
   - Click your webhook → "Attempts" tab
   - Should show successful deliveries
   - If failed, check error message

3. **Test Webhook Locally:**
   - Use Stripe CLI: https://stripe.com/docs/stripe-cli
   ```bash
   stripe listen --forward-to https://your-backend.onrender.com/api/webhooks/stripe
   ```

---

### Issue 5: Images Not Uploading

**Symptoms:** Image upload fails, 500 error

**Solutions:**

1. **Check Cloudinary Credentials:**
   - Verify all 3 values are correct (cloud name, API key, secret)
   - Test in Cloudinary dashboard → Media Library

2. **Check File Size:**
   - Max size is 5MB (set in MAX_FILE_SIZE)
   - Compress images if larger

3. **Check Permissions:**
   - Render needs write access to `/tmp`
   - Set `UPLOAD_DIR=/tmp/uploads` in environment

---

### Issue 6: Database Connection Issues

**Symptoms:** "connection refused", "timeout"

**Solutions:**

1. **Check Database Status:**
   - Go to Render dashboard → Database
   - Status should be green/running
   - If suspended, click "Resume"

2. **Verify Connection String:**
   - Use INTERNAL database URL (starts with `dpg-`)
   - External URL is for connections from outside Render

3. **Free Tier Limitation:**
   - Database expires after 90 days
   - Plan to migrate to Neon.tech before expiry

---

### Issue 7: "Render Service Spun Down"

**Symptoms:** First request takes 30+ seconds

**Explanation:**
- Free tier services spin down after 15 min of inactivity
- First request "wakes up" the service (cold start)
- Subsequent requests are fast

**Solutions:**
- Upgrade to paid plan ($7/month) for always-on
- Use service like UptimeRobot to ping every 10 minutes
- Accept slower first load (common for free tier)

---

## 📊 Deployment Summary

### **URLs & Credentials**

```
Frontend: https://premiumcompitions.vercel.app
Backend: https://premiumcompitions-backend.onrender.com
Database: dpg-xxxxx.render.com:5432

Admin Account:
Email: admin@test.com
Password: Admin123!

Test User (has wins):
Email: user1@test.com
Password: Admin123!

Stripe Test Card:
Card: 4242 4242 4242 4242
Expiry: 12/26
CVC: 123
```

---

## 🎯 Post-Deployment Checklist

- [ ] ✅ Frontend deployed and accessible
- [ ] ✅ Backend deployed and responding
- [ ] ✅ Database created and migrated
- [ ] ✅ Seeded with test data
- [ ] ✅ Environment variables set correctly
- [ ] ✅ Stripe webhook configured
- [ ] ✅ Emails sending successfully
- [ ] ✅ Can register new users
- [ ] ✅ Can complete test purchase
- [ ] ✅ Can view tickets and wins
- [ ] ✅ Images uploading correctly
- [ ] ✅ No console errors

---

## 🔗 Useful Links

**Documentation:**
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Stripe Testing](https://stripe.com/docs/testing)

**Platform Dashboards:**
- [Render Dashboard](https://dashboard.render.com)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Cloudinary Console](https://cloudinary.com/console)

**Monitoring:**
- Render Logs: https://dashboard.render.com/[your-service]/logs
- Vercel Logs: https://vercel.com/[your-project]/logs
- Stripe Events: https://dashboard.stripe.com/test/events

---

## 💰 Cost Breakdown (Free Tier)

| Service | Free Tier Limits | Notes |
|---------|------------------|-------|
| **Vercel** | 100GB bandwidth, unlimited deployments | ✅ Forever free |
| **Render Backend** | 750 hours/month | ⚠️ Spins down after 15min idle |
| **Render PostgreSQL** | 1GB storage | ⚠️ Expires after 90 days |
| **Stripe** | Unlimited test transactions | ✅ No fees in test mode |
| **Gmail SMTP** | 500 emails/day | ✅ Free forever |
| **Cloudinary** | 25GB storage, 25GB bandwidth | ✅ Free tier sufficient |

**Total Monthly Cost:** $0 (for first 90 days)

**After 90 days:**
- Option 1: Upgrade Render DB ($7/month)
- Option 2: Migrate to Neon.tech (free forever, 3GB)

---

## 📝 Sources

This deployment plan is based on:
- [Deploy with Render and PostgreSQL](https://coding-boot-camp.github.io/full-stack/render/deploy-with-render-and-postgresql/)
- [How to deploy Node.js and PostgreSQL on Render](https://mattermost.com/blog/deploy-nodejs-app-on-render/)
- [Render Free Tier Limits 2025](https://www.freetiers.com/directory/render)
- [Deploying Next.js on Vercel Guide](https://eastondev.com/blog/en/posts/dev/20251220-nextjs-vercel-deploy-guide/)
- [Next.js Environment Variables](https://nextjs.org/docs/pages/guides/environment-variables)
- [Vercel Environment Variables Docs](https://vercel.com/docs/environment-variables)

---

**Last Updated:** February 16, 2026
**Platform Versions:** Next.js 14, Node.js 20, PostgreSQL 16
**Deployment Status:** ⏳ Ready for deployment

---

## 🆘 Need Help?

If you encounter issues not covered here:

1. Check Render logs (Dashboard → Service → Logs)
2. Check Vercel logs (Dashboard → Project → Deployments → View Logs)
3. Check browser console (F12 → Console tab)
4. Search error message in documentation links above
5. Ask Claude for specific error troubleshooting

**Common Commands:**

```bash
# View Render logs
# (in Render dashboard → Shell tab)
tail -f /var/log/render.log

# Test database connection
psql $DATABASE_URL -c "SELECT NOW();"

# Test API endpoint
curl https://your-backend.onrender.com/api/competitions

# Rebuild backend
# (in Render dashboard → Manual Deploy → Clear build cache & deploy)
```

---

**You're ready to deploy!** 🚀

Start with Phase 1 and follow each step carefully. Good luck!
