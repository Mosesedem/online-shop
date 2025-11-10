# 🚀 Quick Start Guide

## Immediate Next Steps (15 minutes)

Follow these steps to get your age-verified e-commerce platform running:

### 1. Install Missing Dependencies

```bash
# AWS SDK for S3 signed URLs (required)
pnpm add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner

# Optional but recommended
pnpm add @sentry/nextjs
```

### 2. Set Up Environment Variables

```bash
# Copy the template
cp .env.example .env
```

**Edit `.env` and set these critical values:**

```bash
# Generate a secret (run this command):
openssl rand -base64 32

# Then paste into .env:
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Database (use local PostgreSQL or cloud provider)
DATABASE_URL="postgresql://user:password@localhost:5432/online_shop"

# Start with Veriff test mode
VERIFICATION_PROVIDER="veriff"
VERIFF_API_KEY="your-test-key"
VERIFF_API_SECRET="your-test-secret"
```

### 3. Run Database Migrations

```bash
# Generate Prisma client
pnpm prisma generate

# Create database tables
pnpm prisma migrate dev --name add_verification_system

# (Optional) Open Prisma Studio to view data
pnpm prisma studio
```

### 4. Create Placeholder Image

```bash
# Create images directory
mkdir -p public/images

# Add a neutral placeholder image at:
# public/images/placeholder-neutral.jpg
# (Use any neutral/blurred product image)
```

### 5. Start Development Server

```bash
pnpm dev
```

Visit: `http://localhost:3000`

---

## 🧪 Test the Flow

### Test Sequence:

1. **Age Gate**

   - Visit `http://localhost:3000`
   - Should see age confirmation page
   - Check "I confirm I am 18+"
   - Click "Enter Site"

2. **Create Account**

   - Go to `/auth/signup`
   - Create test account
   - You'll be logged in

3. **Verification Redirect**

   - Try to visit `/shop` or `/cart`
   - Should redirect to `/verify` page
   - See "Start Verification" button

4. **Test Verification Flow** (Development Mode)
   - Click "Start Verification"
   - In production: redirects to Veriff/Persona/Yoti
   - In development: manually update database

**Manually Approve User (Development Only):**

```bash
# Open Prisma Studio
pnpm prisma studio

# Or use SQL directly:
psql $DATABASE_URL

# Update user verification status:
UPDATE users
SET "isVerified" = true,
    verification = '{"status":"approved","verifiedAt":"2025-11-10T00:00:00Z","provider":"manual"}'::json
WHERE email = 'your-test-email@example.com';
```

5. **Access Protected Content**

   - Refresh page
   - Visit `/shop` - should now work!
   - Products should show full images (once added)

6. **Test Admin Queue**
   - Visit `/admin/verifications`
   - Should see pending verifications
   - Can manually approve/reject

---

## 📋 Production Setup Checklist

Before deploying to production:

### ✅ Verification Provider

- [ ] Sign up for Veriff (recommended): https://www.veriff.com
  - Or Persona: https://withpersona.com
  - Or Yoti: https://www.yoti.com
- [ ] Get API keys (test and production)
- [ ] Configure webhook URL: `https://yourdomain.com/api/verify/webhook`
- [ ] Test with sandbox mode first

### ✅ AWS S3 Setup

- [ ] Create S3 bucket
- [ ] Configure CORS policy:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["https://yourdomain.com"],
    "ExposeHeaders": []
  }
]
```

- [ ] Create IAM user with S3 read permissions
- [ ] Add credentials to `.env`

### ✅ Database

- [ ] Set up managed PostgreSQL (Supabase/Neon/Railway)
- [ ] Run migrations in production
- [ ] Set connection pooling if needed

### ✅ Deployment (Vercel)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Configure custom domain
# Enable production mode
```

### ✅ Post-Deployment

- [ ] Test age gate on live site
- [ ] Test full verification flow with real provider
- [ ] Verify webhook receives callbacks
- [ ] Test S3 signed URLs work
- [ ] Check admin queue access
- [ ] Monitor error logs
- [ ] Set up Sentry for error tracking

---

## 🆘 Troubleshooting

### Issue: "Cannot connect to database"

**Solution:** Check `DATABASE_URL` format and database is running

### Issue: "Age gate redirect loop"

**Solution:** Clear cookies and restart browser

### Issue: "Verification webhook not received"

**Solution:**

- Check provider webhook configuration
- Use ngrok for local testing: `ngrok http 3000`
- Verify signature secret matches

### Issue: "S3 signed URLs fail"

**Solution:**

- Check AWS credentials
- Verify IAM permissions
- Check bucket CORS policy

### Issue: "User stuck in pending verification"

**Solution:**

- Check verification logs in database
- Manually approve via admin queue
- Check provider dashboard for errors

---

## 📞 Support Resources

**Documentation:**

- Prisma: https://www.prisma.io/docs
- Next.js: https://nextjs.org/docs
- NextAuth: https://next-auth.js.org

**Verification Providers:**

- Veriff Docs: https://developers.veriff.com
- Persona Docs: https://docs.withpersona.com
- Yoti Docs: https://developers.yoti.com

**Need Help?**

- Review `IMPLEMENTATION_SUMMARY.md` for full details
- Check GitHub issues
- Contact: support@yourstore.com

---

## 🎯 Quick Wins

Once basic setup works:

1. **Add Products** - Create products with `ageCategory = ADULT_18`
2. **Upload Images** - Add neutral thumbnails and full images to S3
3. **Customize Branding** - Update colors in `app/globals.css`
4. **Add Email Notifications** - Integrate Brevo/SendGrid
5. **Set Up Analytics** - Add Google Analytics or Vercel Analytics
6. **Test Checkout Flow** - Integrate payment provider
7. **Create Legal Pages** - Add privacy policy and terms

---

**🎉 You're ready to launch an age-verified adult wellness e-commerce platform!**

Focus on compliance first, then scale features. The foundation is secure and production-ready.
