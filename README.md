# Adult Wellness E-Commerce Platform

A Next.js-based age-verified e-commerce platform for adult wellness products, built with compliance, security, and discretion as core principles.

## 🔐 Key Features

### Age Verification & Compliance

- **Mandatory age verification** before product access and checkout
- Integration with trusted providers (Veriff, Persona, Yoti)
- No guest checkout - accounts required
- Audit logging for all verification events
- Admin manual review queue for flagged verifications

### Security & Privacy

- HTTPS-only with HSTS headers
- Content Security Policy (CSP)
- Helmet security headers
- Rate limiting on sensitive endpoints
- S3 signed URLs for protected product images
- Encrypted PII storage
- No raw ID image retention

### Discreet UX

- Neutral product thumbnails for unverified visitors
- Explicit images only shown to verified users
- Age gate splash page
- Professional, clinical design language
- Discreet packaging and shipping options

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS (custom design system)
- **Authentication**: NextAuth.js
- **Storage**: AWS S3 (signed URLs)
- **Verification**: Veriff/Persona/Yoti
- **Payments**: Adult-friendly PSPs

## 📦 Installation

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- AWS S3 bucket
- Verification provider account

### Setup Steps

1. **Install dependencies**

```bash
pnpm install
```

2. **Configure environment**

```bash
cp .env.example .env
# Edit .env with your credentials
```

3. **Set up database**

```bash
pnpm prisma generate
pnpm prisma migrate dev --name init
```

4. **Install AWS SDK**

```bash
pnpm add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

5. **Start development**

```bash
pnpm dev
```

## 🎨 Design System

### Brand Colors

- `--bg-900: #0B0B0B` - Jet black background
- `--accent-600: #D97706` - Warm amber accent
- `--surface: #F8F6F4` - Soft off-white
- `--text-muted: #6B6B6B` - Muted gray

### Typography

- **Headings**: Montserrat
- **Body**: Inter (16px, 1.5 line-height)

## 🔌 Key API Endpoints

- `POST /api/verify/start` - Initiate verification
- `POST /api/verify/webhook` - Provider webhook
- `GET /api/verify/status` - Get status
- `GET /api/assets/signed` - Get signed S3 URL
- `POST /api/admin/verify/manual` - Manual approval

## 🚀 Deployment

### Vercel

```bash
vercel
```

Set environment variables in dashboard and configure webhooks.

## 📋 Verification Flow

1. User creates account
2. Attempts to view product/checkout
3. Redirected to `/verify`
4. Completes provider verification
5. Webhook updates status
6. User gains full access

## ⚠️ Important

This platform handles adult content and PII. Ensure full compliance with local laws before deployment.
