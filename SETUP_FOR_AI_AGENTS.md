# 🤖 AI Agent Setup Guide: Premium Competition Platform

> **INSTRUCTION FOR AGENTS:** Read this file carefully. It contains the complete protocol to set up this legacy code environment from scratch. Follow the steps sequentially.

---

## 1. 🏗️ System Requirements & Context

**Stack Overview:**
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (Relation-based)
- **Infrastructure:** Docker (Optional but recommended), Cloudinary, Stripe, Sentry

**Prerequisite Checks:**
- Node.js >= 18.0.0
- Docker & Docker Compose (for local DB) OR local PostgreSQL instance
- npm or yarn

---

## 2. 🚀 Step-by-Step Initialization Protocol

### Step 1: Install Dependencies
Run the following commands in the root directory:

```bash
# Install root dependencies (if any)
npm install

# Install Frontend dependencies
cd frontend && npm install

# Install Backend dependencies
cd ../backend && npm install
```

### Step 2: Environment Configuration
You must create `.env` files for both services.

**Backend (`backend/.env`):**
```env
# Server
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/raffle_db
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=raffle_db
DATABASE_USER=postgres
DATABASE_PASSWORD=password

# Auth Secrets (Generate random strings for these)
JWT_SECRET=dev_secret_key_change_me
REFRESH_TOKEN_SECRET=dev_refresh_key_change_me

# External Services (Mock or Real)
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
CLOUDINARY_CLOUD_NAME=placeholder
CLOUDINARY_API_KEY=placeholder
CLOUDINARY_API_SECRET=placeholder
SENTRY_DSN=

# Email
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=mock_user
SMTP_PASS=mock_pass
```

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Database Bootstrap

**Option A: Using Docker (Recommended)**
```bash
# Start Postgres container provided in docker-compose.yml (if exists) or run generic:
docker run --name raffle-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=raffle_db -p 5432:5432 -d postgres:15
```

**Option B: Local Postgres**
Ensure your local Postgres server is running and create a database named `raffle_db`.

**Run Migrations & Seeds:**
```bash
cd backend
# Compile TS to JS first (for migration scripts usually)
npm run build 

# Run database migrations
npm run db:migrate

# Seed initial data (Admin user, dummy competitions)
npm run db:seed
```

### Step 4: Verification
Verify the setup by running the verification scripts (if available):
```bash
cd backend
npx ts-node scripts/verify_phase2.ts
```

---

## 3. 🏃 Running the Application

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Expected Output: Server running on port 3001
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Expected Output: Ready in http://localhost:3000
```

---

## 4. 🧠 Architecture Notes for Agents

- **Auth Flow:** JWT-based. Access tokens (15m) and Refresh tokens (7d).
- **Uploads:** Abstracted via `upload.service.ts`. Supports Cloudinary with fallback to local filesystem (`/uploads`).
- **Sanitization:** All inputs are sanitized via middleware using `sanitize-html`.
- **Styling:** Premium theme defined in `frontend/tailwind.config.js` and `globals.css`. Do not introduce generic colors; use `primary-*` and `accent-*` tokens.

**Common Pitfalls:**
- Ensure `DATABASE_URL` matches your local Postgres credentials exactly.
- If images fail to upload locally, ensure the `backend/uploads` directory exists and is writable.
- If Stripe fails, use the mock payment flow or test keys.

---

> **End of Protocol.**
