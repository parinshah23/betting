# 🚀 Deployment Guide

This guide covers the deployment of the competition platform to **Railway (Backend)** and **Vercel (Frontend)**.

---

## 📋 Prerequisites

Before starting, ensure you have accounts on:
1. **GitHub** (source code hosting)
2. **Railway** (railway.app) - for Backend & Database
3. **Vercel** (vercel.com) - for Frontend
4. **Cloudinary** (cloudinary.com) - for Image Storage
5. **Stripe** (stripe.com) - for Payments
6. **Sentry** (sentry.io) - for Error Tracking

---

## 🛠️ Step 1: Backend Deployment (Railway)

### 1.1 Create Project
1. Log in to [Railway](https://railway.app)
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Click **Add Variables** but don't deploy yet

### 1.2 Add Database
1. In your project view, click **New** → **Database** → **PostgreSQL**
2. Wait for it to initialize
3. Click on the PostgreSQL card → **Connect** tab
4. Copy the `DATABASE_URL` (you'll need this for environment variables)

### 1.3 Configure Environment Variables
Go to your backend service settings → **Variables** and add:

```env
# Server
NODE_ENV=production
PORT=3000

# Database (Railway usually adds DATABASE_URL automaticall, check variables)
# If not, add DATABASE_URL from step 1.2

# Secrets (Generate these using `openssl rand -hex 32`)
JWT_SECRET=<your-generated-secret>
REFRESH_TOKEN_SECRET=<your-generated-refresh-secret>

# Frontend URL (Your Vercel URL - update after deploying frontend)
FRONTEND_URL=https://your-project.vercel.app

# Stripe (Get from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary (Get from Cloudinary Dashboard)
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# Sentry (Get from Sentry Dashboard)
SENTRY_DSN=https://...@ingest.sentry.io/...

# Email (Gmail SMTP)
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<your-email>
SMTP_PASS=<your-app-password>
EMAIL_FROM=<your-email>
```

### 1.4 Deploy
1. Railway typically auto-deploys on push.
2. Watch the **Deployments** tab logs.
3. Once successful, copy your **Railway App URL** (e.g., `https://backend-production.up.railway.app`).

---

## 🌐 Step 2: Frontend Deployment (Vercel)

### 2.1 Import Project
1. Log in to [Vercel](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. **Framework Preset**: Next.js
5. **Root Directory**: `frontend` (Click Edit to change this!)

### 2.2 Configure Environment Variables
Expand **Environment Variables** section and add:

```env
# API URL (Your Railway Backend URL from Step 1.4)
# IMPORTANT: Must end with /api
NEXT_PUBLIC_API_URL=https://<your-railway-app>.up.railway.app/api

# Stripe Public Key (Get from Stripe Dashboard)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# App URL (Your Vercel Domain)
NEXT_PUBLIC_APP_URL=https://<your-vercel-project>.vercel.app

# Sentry (Optional for client-side tracking)
NEXT_PUBLIC_SENTRY_DSN=https://...@ingest.sentry.io/...
```

### 2.3 Deploy
1. Click **Deploy**
2. Wait for build to complete
3. Once live, test the site!

---

## 🔗 Step 3: Final Configuration

### 3.1 Update Backend CORS
1. Go back to Railway → Backend Service → Variables
2. Update `FRONTEND_URL` to your actual Vercel domain (e.g., `https://my-raffle-app.vercel.app`)
3. Redeploy Backend

### 3.2 Configure Stripe Webhooks
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add Endpoint: `https://<your-railway-app>.up.railway.app/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy the Signing Secret (`whsec_...`)
5. Update `STRIPE_WEBHOOK_SECRET` in Railway variables

---

## ✅ Verification Checklist

- [ ] **Registration**: Create a new account
- [ ] **Email**: Check if welcome email is received
- [ ] **Image Upload**: Upload a profile picture (verifies Cloudinary)
- [ ] **Cart**: Add items to cart, refresh page (verifies DB persistence)
- [ ] **Checkout**: Test payment flow
- [ ] **Admin**: Access admin panel
- [ ] **Errors**: Check Sentry dashboard for any captured errors

---

## 🆘 Troubleshooting

- **CORS Errors**: Check `FRONTEND_URL` in Railway matches your Vercel URL exactly (no trailing slash).
- **Database Errors**: Ensure `DATABASE_URL` is set correct in Railway.
- **Image Upload Fails**: Check Cloudinary credentials.
- **500 Errors**: Check Railway logs for detailed error messages.
