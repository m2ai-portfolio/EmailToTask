# Deploy to Vercel - Step by Step

**Current Status:**
- ✅ Database: Complete
- ✅ Stripe Products: Created
- ⏳ Webhooks: Pending (can add after)
- ⏳ Domain: Pending

---

## Option A: Deploy via Vercel Web UI (Recommended)

### Step 1: Push to GitHub

```bash
cd /home/apexaipc/Documents/deepseek-harness/default-workspace/email-to-task-app

# Initialize git (if not already done)
git init
git add .
git commit -m "EmailToTask MVP - ready for deployment"
git branch -M main

# Add your GitHub remote
# Replace with your actual GitHub repo URL
git remote add origin git@github.com:yourusername/email-to-task.git
git push -u origin main
```

**If you don't have a GitHub repo yet:**
1. Go to: https://github.com/new
2. Create repo: `email-to-task`
3. Copy the URL and use it above

---

### Step 2: Deploy on Vercel

1. **Go to:** https://vercel.com/new
2. **Click:** "Import" → Select your GitHub repo
3. **Project settings:**
   - Name: `email-to-task` (or auto-filled)
   - Framework: `Next.js` (auto-detected)

4. **Add Environment Variables** (click "Add" for each):

| Variable Name | Value |
|---------------|-------|
| `NEXT_PUBLIC_APP_URL` | `https://beta.irhuman.ai` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ffbpqxwkdywbwxbcntaa.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `<your-next-public-supabase-anon-key>` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `<your-next-public-stripe-publishable-key>` |
| `SUPABASE_SERVICE_ROLE_KEY` | `<get-from-supabase>` |
| `STRIPE_SECRET_KEY` | `<your-stripe-secret-key>` |
| `STRIPE_WEBHOOK_SECRET` | `<add-later>` |
| `RESEND_API_KEY` | `<your-resend-api-key>` |
| `STRIPE_PRICE_ID_PRO` | `price_1UQ7xGRwHfwXQdzCjqnIhqgz` |
| `STRIPE_PRICE_ID_TEAM` | `price_1UQ7y4RwHfwXQdzCxSDSeeLV` |

5. **Click:** "Deploy"

6. **Wait:** Build takes ~2-3 minutes

7. **Result:** Vercel gives you a URL like `email-to-task.vercel.app`

---

## Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd /home/apexaipc/Documents/deepseek-harness/default-workspace/email-to-task-app
vercel --prod
```

Follow the prompts. This is faster but requires CLI setup.

---

## After Deployment

### 1. Test the Live Site

Visit your Vercel URL and verify:
- ✅ Landing page loads
- ✅ No console errors
- ✅ Stripe checkout buttons work (test mode)

### 2. Get Supabase Service Role Key

1. Go to: https://supabase.com/dashboard/project/ffbpqxwkdywbwxbcntaa/settings/api
2. Find **"Service Role Key"**
3. Copy it
4. Add to Vercel environment variables as `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configure Webhooks (Optional - Can Do Later)

If you want to add webhooks now:
1. Your Vercel URL is: `https://<your-vercel-domain>.vercel.app`
2. Webhook URL: `https://<your-vercel-domain>.vercel.app/api/webhooks/stripe`
3. Add in Stripe → Webhooks → Add endpoint
4. Copy webhook secret
5. Add to Vercel as `STRIPE_WEBHOOK_SECRET`

### 4. Add Custom Domain

1. In Vercel: Settings → Domains
2. Add: `beta.irhuman.ai`
3. Vercel gives you DNS records
4. Add CNAME in Netlify: `beta` → `<vercel-domain>.vercel.app`
5. Wait 10-30 minutes for DNS propagation

---

## Troubleshooting

### Build Fails
**Check:** Node version (should be 18+), missing env vars

### Supabase Connection Error
**Fix:** Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel env vars

### Stripe Webhook Error
**Fix:** Add `STRIPE_WEBHOOK_SECRET` to Vercel env vars (can skip initially)

### Domain Not Working
**Fix:** Wait for DNS propagation, check CNAME record

---

## What Happens After Deploy

### Immediate (Day 1)
- Landing page is live
- Users can sign up
- Stripe checkout works
- Tasks are created from emails (once email forwarding is set up)

### Week 1
- Add email forwarding (Resend Routes)
- Test end-to-end flow
- Invite beta users

### Month 1
- Scale to 20+ users
- Add dashboard UI
- Launch on Product Hunt

---

## Next Steps

1. **Push to GitHub** (5 min)
2. **Deploy on Vercel** (5 min)
3. **Add Supabase Service Role Key** (2 min)
4. **Test live site** (3 min)
5. **Add domain** (5 min)

**Total time:** ~20 minutes

---

**Ready to deploy?** Start with pushing to GitHub, then let me know your Vercel URL and I'll help with the rest!
