# Production Readiness Tasks

**Project:** Competition/Raffle Platform  
**Created:** February 2, 2026  
**Status:** In Progress

---

## How To Use This File

- Complete tasks in order (dependencies exist between some tasks)
- Mark each task with status: `[ ]` Not Started, `[~]` In Progress, `[✓]` Complete, `[!]` Blocked
- Test each task before moving to next
- Each task has a **Verify** section - use these commands to confirm it works

---

## Phase 1: Critical Backend Fixes

### Task 1.1: Cart Persistence in Database
**Priority:** 🔴 CRITICAL  
**Status:** [✓]  
**Time Estimate:** 2-3 hours

**Problem:** Cart stored in-memory Map, lost on server restart  
**Solution:** Store cart in PostgreSQL

**Steps:**
1. Create cart table migration
2. Create cart_items table migration  
3. Update cartService to use database instead of Map
4. Update cart model with CRUD operations

**Files to modify:**
- `backend/src/db/migrations/` (new migration file)
- `backend/src/models/cart.model.ts`
- `backend/src/services/cart.service.ts`

**Verify:**
```bash
# Restart backend and check cart persists
cd backend && npm run dev
# Add item to cart, restart server, cart should still have items
```

---

### Task 1.2: Stripe Webhook Setup
**Priority:** 🔴 CRITICAL  
**Status:** [✓]  
**Time Estimate:** 1-2 hours

**Problem:** Webhook secret is placeholder, payment confirmations unreliable  
**Solution:** Configure Stripe webhook endpoint

**Steps:**
1. Create webhook handler endpoint in backend
2. Add webhook route
3. Handle payment_intent.succeeded event
4. Handle payment_intent.failed event
5. Get webhook secret from Stripe dashboard

**Files to modify:**
- `backend/src/controllers/webhook.controller.ts` (create new)
- `backend/src/routes/webhook.routes.ts` (create new)
- `backend/src/index.ts` (add route)
- `backend/.env` (update STRIPE_WEBHOOK_SECRET)

**Verify:**
```bash
# Use Stripe CLI for local testing
stripe listen --forward-to localhost:3001/api/webhooks/stripe
# Make a test payment and check webhook is received
```

---

### Task 1.3: Production Environment Variables
**Priority:** 🔴 CRITICAL  
**Status:** [✓]  
**Time Estimate:** 30 minutes

**Problem:** All URLs are localhost, weak secrets  
**Solution:** Create production environment files

**Steps:**
1. Create `.env.production` for backend
2. Create `.env.production` for frontend
3. Generate strong JWT secrets
4. Configure production database URL
5. Add to .gitignore (don't commit secrets!)

**Files to create:**
- `backend/.env.production` (DO NOT COMMIT)
- `frontend/.env.production` (DO NOT COMMIT)

**Required Variables for Production:**
```env
# Backend
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=<generate-64-char-random-string>
REFRESH_TOKEN_SECRET=<generate-64-char-random-string>
FRONTEND_URL=https://yourdomain.com
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Verify:**
```bash
# Generate secure secrets:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### Task 1.4: Email Integration Verification
**Priority:** 🔴 CRITICAL  
**Status:** [✓]  
**Time Estimate:** 1 hour

**Problem:** Emails configured but may not be connected to all flows  
**Solution:** Verify and connect all email triggers

**Flows to verify:**
- [ ] Registration welcome email
- [ ] Order confirmation email (after payment)
- [ ] Winner notification email (after draw)
- [ ] Password reset email

**Files to check:**
- `backend/src/controllers/auth.controller.ts` (registration)
- `backend/src/controllers/order.controller.ts` (order confirm)
- `backend/src/controllers/admin.controller.ts` (draw/winner)

**Verify:**
```bash
# Register new user - check email received
# Complete purchase - check order confirmation email
# Run draw - check winner notification email
# Request password reset - check email
```

---

## Phase 2: High Priority Features

### Task 2.1: Image Upload with Cloudinary
**Priority:** 🟡 HIGH  
**Status:** [ ]  
**Time Estimate:** 3-4 hours

**Problem:** Only URL input for images  
**Solution:** Implement file upload with Cloudinary (free tier)

**Steps:**
1. Create Cloudinary account (cloudinary.com)
2. Install cloudinary package
3. Create upload API endpoint
4. Update frontend ImageUpload component to support file upload
5. Store Cloudinary URLs in database

**Files to modify:**
- `backend/package.json` (add cloudinary)
- `backend/src/controllers/upload.controller.ts` (create new)
- `backend/src/routes/upload.routes.ts` (create new)
- `frontend/src/components/ui/ImageUpload.tsx`

**Environment variables to add:**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Verify:**
```bash
# Upload image via admin panel
# Check image URL points to Cloudinary
# Image displays correctly on frontend
```

---

### Task 2.2: Input Sanitization (XSS Prevention)
**Priority:** 🟡 HIGH  
**Status:** [ ]  
**Time Estimate:** 1-2 hours

**Problem:** Competition descriptions could contain XSS  
**Solution:** Sanitize HTML input

**Steps:**
1. Install DOMPurify or sanitize-html package
2. Create sanitization middleware
3. Apply to competition description field
4. Apply to any other rich text fields

**Files to modify:**
- `backend/package.json` (add sanitize-html)
- `backend/src/middleware/sanitize.middleware.ts` (create new)
- `backend/src/controllers/admin.controller.ts` (use middleware)

**Verify:**
```bash
# Try to save competition with script tag in description
# Verify script is stripped/escaped when retrieved
```

---

### Task 2.3: Error Tracking with Sentry
**Priority:** 🟡 HIGH  
**Status:** [ ]  
**Time Estimate:** 1 hour

**Problem:** No error visibility in production  
**Solution:** Set up Sentry (free tier: 5k errors/month)

**Steps:**
1. Create Sentry account (sentry.io)
2. Create project for backend (Node.js)
3. Create project for frontend (Next.js)
4. Install Sentry packages
5. Initialize in both apps

**Files to modify:**
- `backend/package.json` (add @sentry/node)
- `backend/src/index.ts` (initialize Sentry)
- `frontend/package.json` (add @sentry/nextjs)
- `frontend/sentry.client.config.ts` (create)
- `frontend/sentry.server.config.ts` (create)

**Environment variables:**
```env
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

**Verify:**
```bash
# Trigger an error intentionally
# Check Sentry dashboard shows the error
```

---

### Task 2.4: Database Backup Strategy
**Priority:** 🟡 HIGH  
**Status:** [ ]  
**Time Estimate:** 1 hour

**Problem:** No backups, data loss risk  
**Solution:** Set up automated backups

**Options (choose based on hosting):**
1. **Railway/Render:** Built-in backups (enable in dashboard)
2. **AWS RDS:** Enable automated backups
3. **Self-hosted:** Use pg_dump cron job

**For self-hosted:**
```bash
# Create backup script
#!/bin/bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
# Upload to S3 or secure location
```

**Verify:**
```bash
# Run backup manually
# Restore to test database
# Verify data integrity
```

---

## Phase 3: Deployment

### Task 3.1: Backend Deployment (Railway)
**Priority:** 🟢 DEPLOYMENT  
**Status:** [ ]  
**Time Estimate:** 1-2 hours

**Steps:**
1. Create Railway account (railway.app)
2. Create new project
3. Add PostgreSQL database
4. Connect GitHub repository
5. Set environment variables
6. Deploy

**Railway Settings:**
- Root Directory: `backend`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

**Verify:**
```bash
# API responds at Railway URL
curl https://your-app.railway.app/api/health
```

---

### Task 3.2: Frontend Deployment (Vercel)
**Priority:** 🟢 DEPLOYMENT  
**Status:** [ ]  
**Time Estimate:** 30 minutes

**Steps:**
1. Create Vercel account (vercel.com)
2. Import GitHub repository
3. Set root directory to `frontend`
4. Add environment variables
5. Deploy

**Environment variables for Vercel:**
- `NEXT_PUBLIC_API_URL` = Railway backend URL
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = Live Stripe key
- `NEXT_PUBLIC_APP_URL` = Vercel domain

**Verify:**
```bash
# Website loads at Vercel URL
# API calls work (check network tab)
```

---

### Task 3.3: Custom Domain & SSL
**Priority:** 🟢 DEPLOYMENT  
**Status:** [ ]  
**Time Estimate:** 30 minutes

**Steps:**
1. Purchase domain (if needed)
2. Add domain to Vercel (frontend)
3. Add domain to Railway (backend API)
4. Configure DNS records
5. SSL is automatic

**DNS Records:**
```
# Frontend
A     @      76.76.21.21 (Vercel)
CNAME www    cname.vercel-dns.com

# Backend API (subdomain)
CNAME api    your-app.railway.app
```

**Verify:**
```bash
# HTTPS works on both domains
curl https://yourdomain.com
curl https://api.yourdomain.com/api/health
```

---

### Task 3.4: CI/CD with GitHub Actions
**Priority:** 🟢 DEPLOYMENT  
**Status:** [ ]  
**Time Estimate:** 1 hour

**Steps:**
1. Create `.github/workflows/deploy.yml`
2. Add lint and build checks
3. Configure auto-deploy on main branch
4. Add test step (when tests exist)

**Verify:**
```bash
# Push to main branch
# GitHub Action runs successfully
# Deployment happens automatically
```

---

## Summary Checklist

### Phase 1: Critical (Complete Before Launch)
- [✓] 1.1 Cart persistence in database
- [✓] 1.2 Stripe webhook setup
- [✓] 1.3 Production environment variables
- [✓] 1.4 Email integration verification

### Phase 2: High Priority (Complete Week 1)
- [ ] 2.1 Image upload with Cloudinary
- [ ] 2.2 Input sanitization
- [ ] 2.3 Error tracking with Sentry
- [ ] 2.4 Database backup strategy

### Phase 3: Deployment
- [ ] 3.1 Backend deployment (Railway)
- [ ] 3.2 Frontend deployment (Vercel)
- [ ] 3.3 Custom domain & SSL
- [ ] 3.4 CI/CD with GitHub Actions

---

## Notes

- Always test locally before deploying
- Keep production secrets secure (never commit to git)
- Back up database before major changes
- Monitor Sentry for errors after launch

---

*Last Updated: February 2, 2026*
