# Deployment Options & Pricing Guide

> **Prepared for:** Client Review
> **Date:** March 2026
> **Project:** Competition & Raffle Platform (compi-web)

This document outlines the services required to deploy and run the platform, with multiple options at different price points. All prices are **monthly** unless stated otherwise.

---

## Table of Contents

1. [What You Need](#what-you-need)
2. [Domain Name](#1-domain-name)
3. [Frontend Hosting (Next.js)](#2-frontend-hosting-nextjs)
4. [Backend Hosting (Express.js API)](#3-backend-hosting-expressjs-api)
5. [Database (PostgreSQL)](#4-database-postgresql)
6. [Payment Processing (Stripe)](#5-payment-processing-stripe)
7. [Email Service](#6-email-service)
8. [Image Hosting (Cloudinary)](#7-image-hosting-cloudinary)
9. [Error Tracking (Sentry)](#8-error-tracking-sentry)
10. [Package Bundles](#package-bundles)
11. [Notes & Recommendations](#notes--recommendations)

---

## What You Need

| Service           | Purpose                                      | Required? |
| ----------------- | -------------------------------------------- | --------- |
| Domain Name       | Your website address (e.g. mycompetition.com)| Yes       |
| Frontend Hosting  | Serves the website to users                  | Yes       |
| Backend Hosting   | Runs the API server & business logic         | Yes       |
| Database          | Stores all data (users, competitions, orders)| Yes       |
| Payment Processing| Accepts card payments via Stripe             | Yes       |
| Email Service     | Sends order confirmations, password resets   | Yes       |
| Image Hosting     | Stores competition images & uploads          | Yes       |
| Error Tracking    | Monitors errors in production                | Recommended |

---

## 1. Domain Name

You need a domain name like `mycompetition.com`. This is a **yearly** cost.

| Provider                  | .com (1st Year) | .com (Renewal/yr) | Extras Included                          | Best For              |
| ------------------------- | --------------- | ------------------ | ---------------------------------------- | --------------------- |
| **Cloudflare Registrar**  | ~$10.46         | ~$10.46            | Free DNSSEC, no markup (at-cost pricing) | Cheapest long-term    |
| **Namecheap**             | ~$6.48          | ~$14.58            | Free WhoisGuard (1yr), DNS hosting       | Cheap first year      |
| **GoDaddy**               | ~$2.99*         | ~$21.99            | Marketing tools, website builder trial   | Brand recognition     |

> \* GoDaddy first-year promos are heavily discounted but renewals are significantly more expensive.

**Recommendation:** Cloudflare Registrar — lowest long-term cost, no surprise renewal hikes, excellent security features.

---

## 2. Frontend Hosting (Next.js)

The website (what users see and interact with) runs on Next.js and needs a compatible host.

| Provider       | Plan       | Price      | Bandwidth   | Key Features                                             |
| -------------- | ---------- | ---------- | ----------- | -------------------------------------------------------- |
| **Vercel**     | Hobby      | Free       | 100 GB      | Zero-config Next.js, preview deploys. **Non-commercial** |
| **Vercel**     | Pro        | $20/mo     | 1 TB        | Commercial use, analytics, 10M edge requests             |
| **Netlify**    | Free       | Free       | 100 GB      | Auto deploys from Git, instant rollbacks                 |
| **Netlify**    | Pro        | $19/mo     | —           | Team features, forms, functions                          |
| **Render**     | Free       | Free       | —           | Auto-sleep after inactivity (slow cold starts)           |
| **Render**     | Starter    | $7/mo      | —           | 512 MB RAM, 0.5 CPU, always on                           |

**Recommendation:** Vercel Pro ($20/mo) — purpose-built for Next.js, best performance and developer experience. If budget is tight, Vercel Hobby works for testing but **cannot be used commercially**.

---

## 3. Backend Hosting (Express.js API)

The API server handles authentication, payments, competition logic, and database operations.

| Provider         | Plan       | Price      | RAM    | CPU      | Key Features                                   |
| ---------------- | ---------- | ---------- | ------ | -------- | ---------------------------------------------- |
| **Render**       | Free       | Free       | 512 MB | 0.1 vCPU | Auto-sleeps after 15 min inactivity            |
| **Render**       | Starter    | $7/mo      | 512 MB | 0.5 vCPU | Always on, custom domains, auto-deploy         |
| **Render**       | Standard   | $25/mo     | 2 GB   | 1 vCPU   | Production-ready, health checks, zero downtime |
| **Railway**      | Hobby      | $5/mo      | Up to 48 GB | Up to 48 vCPU | Pay for actual usage, $5 credits included |
| **Railway**      | Pro        | $20/mo     | Up to 1 TB  | Up to 1000 vCPU | $20 credits included, team support     |
| **DigitalOcean** | Basic      | $6/mo      | 1 GB   | 1 vCPU   | Full server control, SSH access                |
| **DigitalOcean** | Regular    | $12/mo     | 2 GB   | 1 vCPU   | More headroom for traffic spikes               |

**Recommendation:** Render Standard ($25/mo) for production — reliable, simple deploy from Git, zero-downtime deploys. Railway Hobby ($5/mo) is great for early stage / low traffic.

---

## 4. Database (PostgreSQL)

All application data is stored in PostgreSQL. This is a critical component — reliability matters.

| Provider           | Plan          | Price     | Storage | RAM    | Key Features                                         |
| ------------------ | ------------- | --------- | ------- | ------ | ---------------------------------------------------- |
| **Render**         | Free          | Free      | 1 GB    | —      | 30-day limit, then deleted                           |
| **Render**         | Starter       | $7/mo     | 1 GB    | 256 MB | Persistent, daily backups                            |
| **Render**         | Standard      | $20/mo    | 10 GB   | 1 GB   | Point-in-time recovery                               |
| **Supabase**       | Free          | Free      | 500 MB  | —      | Pauses after 1 week inactivity, 2 projects max       |
| **Supabase**       | Pro           | $25/mo    | 8 GB    | —      | No pause, daily backups, 100K MAUs                   |
| **Neon**           | Free          | Free      | 0.5 GB  | —      | Serverless, scales to zero, 100 compute hours        |
| **Neon**           | Launch        | $19/mo    | 10 GB   | —      | 300 compute hours, autoscaling                       |
| **DigitalOcean**   | Basic         | $15/mo    | 10 GB   | 1 GB   | Managed, automated backups, standby nodes available  |
| **DigitalOcean**   | Production    | $30/mo+   | 10 GB+  | 2 GB   | High availability with standby failover              |

**Recommendation:** Render Standard ($20/mo) or Neon Launch ($19/mo) for production. Supabase Pro ($25/mo) if you want a dashboard UI for the database. For tight budgets, Neon Free or Supabase Free work for early testing.

---

## 5. Payment Processing (Stripe)

Stripe is already integrated into the platform. There are **no monthly fees** — you only pay per transaction.

| Fee Type                   | Rate                         |
| -------------------------- | ---------------------------- |
| UK/Domestic cards          | 1.5% + 20p per transaction   |
| European cards             | 1.4% + 20p per transaction   |
| International cards        | 2.9% + 20p per transaction   |
| Currency conversion        | +2% on top of card fee       |
| Chargebacks/Disputes       | £20 per dispute              |
| Payouts                    | Free (standard 2-day payout) |
| Instant payouts            | 1% of payout amount          |

> **Example:** On a £10 ticket purchase with a UK card, Stripe takes ~35p (1.5% + 20p). You receive ~£9.65.

**No action needed** — Stripe account setup is free. You start paying only when you process payments.

---

## 6. Email Service

Used for order confirmations, password resets, welcome emails, and winner notifications.

| Provider         | Free Tier                   | Paid Plan        | Best For                              |
| ---------------- | --------------------------- | ---------------- | ------------------------------------- |
| **Gmail SMTP**   | 500 emails/day              | —                | Development & very low volume         |
| **SendGrid**     | 100 emails/day (forever)    | From $19.95/mo (50K emails) | Scaling up, reliable delivery |
| **Mailgun**      | 100 emails/day (1 month)    | From $15/mo (50K emails)    | Transactional email focus     |
| **Resend**       | 100 emails/day, 3K/mo       | From $20/mo (50K emails)    | Modern API, developer-friendly|

**Recommendation:** Start with Gmail SMTP (free) for launch. Move to SendGrid or Resend when email volume grows beyond 100/day.

---

## 7. Image Hosting (Cloudinary)

Stores and serves competition images, user uploads, and media.

| Plan         | Price    | Credits/mo | Storage   | Bandwidth | Best For                    |
| ------------ | -------- | ---------- | --------- | --------- | --------------------------- |
| **Free**     | Free     | 25 credits | ~10 GB    | ~20 GB    | Small projects, early stage |
| **Plus**     | $89/mo   | 225 credits| Scales    | Scales    | Growing production app      |
| **Advanced** | $224/mo  | 600 credits| Scales    | Scales    | High-traffic platform       |

> 1 Cloudinary credit = ~1,000 transformations or ~1 GB storage or ~1 GB bandwidth

**Recommendation:** Free plan is sufficient for launch and early growth. Upgrade to Plus only when approaching the 25 credit limit.

---

## 8. Error Tracking (Sentry)

Monitors and reports application errors in real-time so issues can be fixed quickly.

| Plan          | Price     | Errors/mo | Users     | Best For                |
| ------------- | --------- | --------- | --------- | ----------------------- |
| **Developer** | Free      | 5,000     | 1         | Solo developer / launch |
| **Team**      | $26/mo    | 50,000    | Unlimited | Small team              |
| **Business**  | $80/mo    | 50,000+   | Unlimited | Production monitoring   |

**Recommendation:** Developer (Free) is enough for launch. Upgrade to Team if multiple people need access to error reports.

---

## Package Bundles

Here are three pre-configured bundles at different price points:

### Budget Launch — ~$19/mo + domain (~$10/yr)

For testing, soft launch, or very low traffic.

| Service          | Choice                | Cost    |
| ---------------- | --------------------- | ------- |
| Domain           | Cloudflare            | ~$10/yr |
| Frontend         | Vercel Hobby*         | Free    |
| Backend          | Railway Hobby         | $5/mo   |
| Database         | Neon Free             | Free    |
| Payments         | Stripe (pay-per-use)  | $0/mo   |
| Email            | Gmail SMTP            | Free    |
| Images           | Cloudinary Free       | Free    |
| Error Tracking   | Sentry Developer      | Free    |
| **Monthly Total**|                       | **~$5/mo** |

> \* Vercel Hobby is **non-commercial**. Suitable for development/testing only.

---

### Standard Production — ~$72/mo + domain (~$10/yr)

For a live commercial launch with moderate traffic.

| Service          | Choice                | Cost     |
| ---------------- | --------------------- | -------- |
| Domain           | Cloudflare            | ~$10/yr  |
| Frontend         | Vercel Pro            | $20/mo   |
| Backend          | Render Standard       | $25/mo   |
| Database         | Neon Launch           | $19/mo   |
| Payments         | Stripe (pay-per-use)  | $0/mo    |
| Email            | Gmail SMTP / SendGrid Free | Free |
| Images           | Cloudinary Free       | Free     |
| Error Tracking   | Sentry Developer      | Free     |
| **Monthly Total**|                       | **~$64/mo** |

---

### Professional — ~$150/mo + domain (~$10/yr)

For established business with steady traffic and a team.

| Service          | Choice                | Cost     |
| ---------------- | --------------------- | -------- |
| Domain           | Cloudflare            | ~$10/yr  |
| Frontend         | Vercel Pro            | $20/mo   |
| Backend          | Render Standard       | $25/mo   |
| Database         | Supabase Pro          | $25/mo   |
| Payments         | Stripe (pay-per-use)  | $0/mo    |
| Email            | SendGrid (50K emails) | $19.95/mo|
| Images           | Cloudinary Plus       | $89/mo   |
| Error Tracking   | Sentry Team           | $26/mo   |
| **Monthly Total**|                       | **~$205/mo** |

> Note: Cloudinary Plus is only needed if you have a large number of competition images. Most projects can stay on Free for a long time.

---

### Professional (Without Cloudinary Plus) — ~$116/mo

A more realistic professional setup for most competition platforms:

| Service          | Choice                | Cost     |
| ---------------- | --------------------- | -------- |
| Domain           | Cloudflare            | ~$10/yr  |
| Frontend         | Vercel Pro            | $20/mo   |
| Backend          | Render Standard       | $25/mo   |
| Database         | Supabase Pro          | $25/mo   |
| Payments         | Stripe (pay-per-use)  | $0/mo    |
| Email            | SendGrid (50K emails) | $19.95/mo|
| Images           | Cloudinary Free       | Free     |
| Error Tracking   | Sentry Team           | $26/mo   |
| **Monthly Total**|                       | **~$116/mo** |

---

## Notes & Recommendations

### Getting Started
1. **Register your domain** first on Cloudflare — cheapest long-term option
2. **Start with the Standard Production bundle** (~$64/mo) — this covers everything needed for a commercial launch
3. **Scale up individual services** as traffic grows, rather than upgrading everything at once

### Cost-Saving Tips
- Stripe has no monthly fee — you only pay when processing payments
- Cloudinary Free tier is generous enough for most early-stage platforms
- Gmail SMTP handles ~500 emails/day at no cost
- Sentry Free covers 5,000 errors/month which is plenty for launch
- Neon's serverless database scales to zero when idle, saving costs during low-traffic periods

### What Affects Cost Over Time
- **Traffic volume** — more users = more bandwidth and compute
- **Number of competitions** — more images = more Cloudinary usage
- **Email volume** — more orders = more transactional emails
- **Database size** — more users and orders = more storage needed

### Important Reminders
- All prices are current as of **March 2026** and may change
- Stripe fees are **per transaction**, not monthly — budget based on expected sales volume
- Most services offer **free tiers** that are suitable for development and early testing
- Always set up **billing alerts** on each service to avoid unexpected charges

---

## Sources

- [Render Pricing](https://render.com/pricing)
- [Vercel Pricing](https://vercel.com/pricing)
- [Railway Pricing](https://railway.com/pricing)
- [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/)
- [Namecheap Domains](https://www.namecheap.com/domains/)
- [Neon Pricing](https://neon.com/pricing)
- [Supabase Pricing](https://supabase.com/pricing)
- [DigitalOcean Managed Databases](https://www.digitalocean.com/pricing/managed-databases)
- [DigitalOcean Droplets](https://www.digitalocean.com/pricing/droplets)
- [Stripe Pricing](https://stripe.com/pricing)
- [SendGrid Pricing](https://sendgrid.com/en-us/pricing)
- [Cloudinary Pricing](https://cloudinary.com/pricing)
- [Sentry Pricing](https://sentry.io/pricing/)
- [Shopify Domain Price Guide](https://www.shopify.com/blog/domain-price)
- [Render Pricing Analysis](https://servercompass.app/blog/render-pricing-is-it-worth-it)
- [Vercel Pricing Breakdown](https://costbench.com/software/developer-tools/vercel/)
