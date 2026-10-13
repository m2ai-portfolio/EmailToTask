# Quick Deploy Checklist - beta.irhuman.ai

**Estimated Time:** 20 minutes  
**Status:** Code Complete ✅

---

## Pre-Launch Setup (20 minutes total)

### 1️⃣ Database Migration (5 min)

**Action:** Run SQL in Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/ffbpqxwkdywbwxbcntaa/editor
2. Click "SQL Editor" in left sidebar
3. Click "New Query"
4. Copy/paste contents of: `supabase/migrations/001_initial_schema.sql`
5. Click "Run"
6. Verify tables created: `profiles`, `emails`, `tasks`, `email_forwarding_addresses`

**✅ Done when:** You see 4 new tables in the Table Editor

---

### 2️⃣ Stripe Products (10 min)

**Action:** Create subscription products in Stripe

1. Go to: https://dashboard.stripe.com/test/products
2. Click "Create product"
   - Name: `EmailToTask Pro`
   - Pricing: `Recurring` → `Monthly` → `$9.00`
   - Description: `Unlimited tasks, AI processing, 90-day history`
3. After creating, click the product → Copy the **Price ID** (looks like `price_1RVivwRxVKm68lZd...`)
4. Repeat for Team tier:
   - Name: `EmailToTask Team`
   - Pricing: `Recurring` → `Monthly` → `$29.00`
   - Copy Price ID

5. **Configure Webhooks:**
   - Go to: https://dashboard.stripe.com/test/webhooks
   - Click "Add endpoint"
   - URL: `https://beta.irhuman.ai/api/webhooks/stripe`
   - Select events:
     - ✅ `checkout.session.completed`
     - ✅ `customer.subscription.created`
     - ✅ `customer.subscription.updated`
     - ✅ `customer.subscription.deleted`
     - ✅ `invoice.payment.succeeded`
     - ✅ `invoice.payment.failed`
   - Click "Add endpoint"
   - Copy the **Webhook Signing Secret** (looks like `whsec_...`)

6. **Update `.env.shared`** (optional, for live mode later):
   ```bash
   # Add these to ~/.env.shared when you have the Price IDs
   STRIPE_PRICE_ID_PRO=<paste-pro-price-id>
   STRIPE_PRICE_ID_TEAM=<paste-team-price-id>
   ```

**✅ Done when:** You have 2 Price IDs and 1 Webhook Secret

---

### 3️⃣ Domain Configuration (5 min)

**Action:** Add subdomain in Netlify

1. Go to: https://app.netlify.com
2. Select your `irhuman.ai` site (or create new)
3. Go to "Site settings" → "Domain management"
4. Click "Add custom domain"
5. Enter: `beta.irhuman.ai`
6. Click "Verify"
7. Netlify will show DNS records to add:
   - Type: `CNAME`
   - Name: `beta`
   - Value: `<your-vercel-domain>.vercel.app`
8. **Don't add yet** - wait until after Vercel deployment (Step 4)

**✅ Done when:** Domain is added in Netlify (DNS configured in Step 4)

---

### 4️⃣ Deploy to Vercel (10 min)

**Action:** Push code and deploy

**Option A: If you have GitHub account**

```bash
cd /home/apexaipc/Documents/deepseek-harness/default-workspace/email-to-task-app

# Initialize git (if not already done)
git init
git add .
git commit -m "EmailToTask MVP - beta.irhuman.ai"
git branch -M main

# Add your GitHub remote (replace with your repo URL)
git remote add origin git@github.com:yourusername/email-to-task.git
git push -u origin main
```

Then:
1. Go to: https://vercel.com/new
2. Click "Import" → Select your GitHub repo
3. Project Name: `email-to-task` (or auto-filled)
4. Click "Add" to add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://ffbpqxwkdywbwxbcntaa.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<from-env.shared>
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-next-public-stripe-publishable-key>
   NEXT_PUBLIC_APP_URL=https://beta.irhuman.ai
   SUPABASE_SERVICE_ROLE_KEY=<from-supabase-dashboard>
   STRIPE_SECRET_KEY=<your-stripe-secret-key>
   STRIPE_WEBHOOK_SECRET=<from-stripe-webhooks>
   RESEND_API_KEY=<your-resend-api-key>
   STRIPE_PRICE_ID=<paste-pro-price-id>
   ```
5. Click "Deploy"
6. Wait for build (~2-3 minutes)
7. Vercel will give you a URL like `email-to-task.vercel.app`

**Option B: Direct Vercel CLI (if you have it installed)**

```bash
cd /home/apexaipc/Documents/deepseek-harness/default-workspace/email-to-task-app
npm install -g vercel
vercel login
vercel --prod
```

**✅ Done when:** You see a live URL from Vercel

---

### 5️⃣ Final DNS Setup (2 min)

**Action:** Point domain to Vercel

1. Go back to Netlify (Step 3)
2. Add DNS record:
   - Type: `CNAME`
   - Name: `beta`
   - Value: `<your-vercel-url>.vercel.app` (from Step 4)
3. Wait 5-10 minutes for DNS propagation
4. Visit: https://beta.irhuman.ai

**✅ Done when:** Landing page loads at https://beta.irhuman.ai

---

## Post-Deployment Testing (5 min)

### Test 1: Landing Page
- Visit: https://beta.irhuman.ai
- Verify: Page loads, no errors

### Test 2: Database Connection
- Open browser console (F12)
- Check for Supabase connection errors

### Test 3: Stripe Test (Optional)
- Go to: https://dashboard.stripe.com/test/developers
- Use Stripe test card: `4242 4242 4242 4242`

---

## Next Steps (After Launch)

### Day 1
- [ ] Configure email forwarding (Resend Routes)
- [ ] Test end-to-end email → task flow
- [ ] Invite 2-3 beta users

### Week 1
- [ ] Launch on Product Hunt
- [ ] Share on Twitter/LinkedIn
- [ ] Collect user feedback

### Month 1
- [ ] Add user dashboard
- [ ] Add authentication UI
- [ ] Scale to 20+ users

---

## Troubleshooting

### Issue: "Supabase connection failed"
**Fix:** Check `SUPABASE_SERVICE_ROLE_KEY` in Vercel env vars

### Issue: "Stripe webhook verification failed"
**Fix:** Verify webhook URL matches exactly: `https://beta.irhuman.ai/api/webhooks/stripe`

### Issue: "Domain not resolving"
**Fix:** Wait 10-30 minutes for DNS propagation, then check: `dig beta.irhuman.ai`

### Issue: "Build failed on Vercel"
**Fix:** Check build logs, usually missing env vars or Node version

---

## Support

If you get stuck at any step:
1. Check the detailed guide: `DEPLOYMENT.md`
2. Review build summary: `BUILD_SUMMARY.md`
3. Ask for help with specific error message

---

**Ready to start?** Begin with Step 1 (Database Migration) and work through the checklist!
