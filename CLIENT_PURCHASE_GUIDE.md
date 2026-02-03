# 💰 Service & Purchase Guide for "Premium Competitions"

To launch your platform, you need to sign up for the following services. Most have a **Free Tier** that is perfectly fine for starting out.

---

## 1. 🏗️ Hosting & Infrastructure (Required)

### **Frontend Hosting: Vercel**
*Where the website lives.*
- **Plan:** **Hobby (Free)**
- **Cost:** $0/month
- **Action:** Sign up at [vercel.com](https://vercel.com)
- **Why:** Best performance for Next.js, free SSL, global CDN.

### **Backend & Database: Railway**
*Where the API and Data live.*
- **Plan:** **Trial / Hobby**
- **Cost:** ~$5 - $10/month (Usage based)
- **Action:** Sign up at [railway.app](https://railway.app)
- **Why:** Easiest way to host Node.js and PostgreSQL database together.

---

## 2. 💳 Payments (Required)

### **Payment Processor: Stripe**
*To accept credit card payments.*
- **Plan:** **Standard**
- **Cost:** No monthly fee. (2.9% + 30¢ per transaction)
- **Action:**
    1. Sign up at [stripe.com](https://stripe.com)
    2. Complete "Business Verification" (Required to accept real money).
    3. Get your **API Keys** (Publishable Key & Secret Key).

---

## 3. ☁️ Asset Storage (Required)

### **Image Hosting: Cloudinary**
*To store competition images and cleaning them up.*
- **Plan:** **Free Forever**
- **Cost:** $0/month (Generous limits for startups)
- **Action:** Sign up at [cloudinary.com](https://cloudinary.com)
- **Why:** Optimized image delivery and easy resizing.

---

## 4. 📧 Email Service (Required)

### **Transactional Emails (Welcome, Receipts)**
*To send automated emails to users.*

**Option A: Gmail (Free / Low Volume)**
- **Cost:** $0
- **Action:** Use a dedicated Gmail account. You need an "App Password".
- **Limit:** ~500 emails/day. Good for testing/starting.

**Option B: SendGrid / Resend (Professional)**
- **Plan:** **Free Tier**
- **Cost:** $0/month (up thereto 100 emails/day usually) or ~$15/month Pro.
- **Action:** Sign up at [resend.com](https://resend.com) or [sendgrid.com](https://sendgrid.com).

---

## 5. 🛡️ Monitoring & Security (Recommended)

### **Error Tracking: Sentry**
*To get alerted if the site breaks.*
- **Plan:** **Developer (Free)**
- **Cost:** $0/month
- **Action:** Sign up at [sentry.io](https://sentry.io)

---

## 6. 🌐 Domain Name (Optional but Recommended)

### **Custom Domain (e.g., your-competition-site.com)**
- **Provider:** GoDaddy, Namecheap, or Vercel directly.
- **Cost:** ~$12 - $15 / year.
- **Action:** Buy your domain name. We will connect it to Vercel/Railway later.

---

## 📝 Summary Checklist for Client

Please provide the developer with credentials/keys for:

- [ ] **Stripe** (Publishable Key, Secret Key)
- [ ] **Cloudinary** (Cloud Name, API Key, API Secret)
- [ ] **Railway** (Access or Invite to project)
- [ ] **Vercel** (Access or Invite to project)
- [ ] **Email** (SMTP Credentials)
