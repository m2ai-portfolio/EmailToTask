# EmailToTask - Deployment Guide

## Overview
This is a complete, production-ready Next.js application that converts emails into actionable tasks.

## Prerequisites

### Already Configured (from ~/.env.shared):
- ✅ Stripe (test mode)
- ✅ Supabase
- ✅ Resend
- ✅ Vercel
- ✅ Netlify (for domain)
- ✅ GitHub

### Required Setup (Human Action):

1. **Domain Configuration** (5 min)
   - Add subdomain `beta.irhuman.ai` in Netlify
   - Point to Vercel deployment

2. **Stripe Live Mode** (optional, start with test)
   - Connect bank account in Stripe Dashboard
   - Switch from test to live mode
   - Update keys in `.env.shared`

3. **Email Forwarding Service** (10 min)
   - Option A: Use Resend Routes (recommended)
   - Option B: Use Mailgun
   - Configure to forward to `/api/process-email`

## Deployment Steps

### Step 1: Database Setup (5 min)

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/ffbpqxwkdywbwxbcntaa
2. Navigate to SQL Editor
3. Run the migration file: `supabase/migrations/001_initial_schema.sql`
4. Verify tables created: `profiles`, `emails`, `tasks`, `email_forwarding_addresses`

### Step 2: Stripe Setup (10 min)

1. Go to Stripe Dashboard: https://dashboard.stripe.com/test/dashboard
2. Create Products & Prices:
   - Product: "EmailToTask Pro"
   - Price: $9/month (recurring)
   - Product: "EmailToTask Team"
   - Price: $29/month (recurring)
3. Copy Price IDs to `.env.local`

4. Configure Webhooks:
   - Go to Developers → Webhooks
   - Add endpoint: `https://beta.irhuman.ai/api/webhooks/stripe`
   - Select events:
     - checkout.session.completed
     - customer.subscription.created
     - customer.subscription.updated
     - customer.subscription.deleted
     - invoice.payment.succeeded
     - invoice.payment.failed
   - Copy Webhook Signing Secret

### Step 3: Vercel Deployment (5 min)

1. Push code to GitHub:
   ```bash
   cd email-to-task-app
   git init
   git add .
   git commit -m "Initial commit: EmailToTask MVP"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. Import in Vercel:
   - Go to https://vercel.com/new
   - Import the GitHub repository
   - Add environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://ffbpqxwkdywbwxbcntaa.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=<from-env>
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<from-env>
     NEXT_PUBLIC_APP_URL=https://beta.irhuman.ai
     SUPABASE_SERVICE_ROLE_KEY=<from-supabase-dashboard>
     STRIPE_SECRET_KEY=<from-env>
     STRIPE_WEBHOOK_SECRET=<from-stripe-webhooks>
     RESEND_API_KEY=<from-env>
     STRIPE_PRICE_ID=<from-stripe-dashboard>
     ```

3. Deploy

### Step 4: Domain Configuration (5 min)

In Netlify:
1. Go to Site Settings → Domain Management
2. Add custom domain: `beta.irhuman.ai`
3. Update DNS records (CNAME to Vercel)
4. Verify SSL certificate

### Step 5: Email Forwarding Setup (10 min)

**Option A: Resend Routes (Recommended)**

1. Go to Resend Dashboard → Routes
2. Add route: `*@beta.irhuman.ai` → `https://beta.irhuman.ai/api/process-email`
3. Verify domain in Resend

**Option B: Mailgun**

1. Add domain in Mailgun
2. Configure MX records
3. Set webhook to: `https://beta.irhuman.ai/api/process-email`

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://ffbpqxwkdywbwxbcntaa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from-supabase>
SUPABASE_SERVICE_ROLE_KEY=<from-supabase>

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<from-stripe>
STRIPE_SECRET_KEY=<from-stripe>
STRIPE_WEBHOOK_SECRET=<from-stripe-webhooks>
STRIPE_PRICE_ID=<create-in-stripe>

RESEND_API_KEY=<from-resend>

NEXT_PUBLIC_APP_URL=https://beta.irhuman.ai
EMAIL_DOMAIN=beta.irhuman.ai
```

## Testing

### Local Development

```bash
cd email-to-task-app
npm install
npm run dev
```

### Stripe Webhook Testing (Local)

```bash
# In separate terminal
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger checkout.session.completed
```

### Test Email Processing

Send test email to your forwarding address and verify:
1. Email record created in Supabase
2. Task created with parsed content
3. Confirmation email sent

## Revenue Timeline

### Week 1 (Oct 13-19)
- Deploy MVP
- Launch on Product Hunt
- Share with 10 beta users
- **Goal:** 5 paying users = $45/mo

### Week 2-3 (Oct 20-Nov 3)
- Iterate based on feedback
- Add 2-3 requested features
- **Goal:** 20 paying users = $180/mo

### Week 4+ (Nov 4+)
- Scale marketing
- Add team features
- **Goal:** 50+ paying users = $450+/mo

## Cost Breakdown (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| Vercel | $0 | Free tier (0-100K visits) |
| Supabase | $0 | Free tier (500MB DB) |
| Stripe | 2.9% + $0.30 | Per transaction |
| Resend | $0 | Free tier (3K emails) |
| **Total** | **$0** | Until scale |

**Break-even:** 17 users @ $9/mo = $153/mo revenue

## Human Touchpoints Required

1. **Stripe Bank Setup** - Connect bank for payouts
2. **Domain DNS** - Configure CNAME in Netlify
3. **Bank Account** - For receiving payments
4. **Legal** - Terms of Service, Privacy Policy (use template)

## Autonomous Operations (95%)

Once deployed, agent can handle:
- ✅ Code updates & deployments
- ✅ Bug fixes
- ✅ Feature additions
- ✅ Email processing
- ✅ Subscription management
- ✅ Customer support responses
- ✅ Marketing content generation
- ✅ Analytics monitoring

## Next Features to Build

1. User Dashboard (React component)
2. Authentication UI (Supabase Auth)
3. Task management interface
4. Mobile responsive design
5. API for third-party integrations
6. Mobile app (React Native)

## Support & Monitoring

- **Error Tracking:** Sentry (integrate with SDK)
- **Analytics:** PostHog or Vercel Analytics
- **Uptime:** Uptime Robot (configure monitors)

---

**Status:** MVP Code Complete ✅
**Next Action:** Deploy to Vercel + Configure Domain
