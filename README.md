# Viabl — Know Before You Build

AI-powered business viability analyzer. Describe your idea, get a full report in 60 seconds.

## Stack
- **Frontend**: Next.js 14 App Router + TypeScript + Tailwind
- **AI**: Claude claude-sonnet-4-6 (9-dimension analysis)
- **Payments**: Stripe Checkout
- **DB**: Supabase Postgres
- **Storage**: DigitalOcean Spaces
- **Email**: Resend
- **PDF**: @react-pdf/renderer
- **Deploy**: Vercel

## Local Dev

```bash
cp .env.example .env.local
# Fill in keys
npm install
npm run dev
```

## Environment Variables

See `.env.example` for all required variables.

Minimum to run locally:
- `ANTHROPIC_API_KEY` — analysis engine
- `STRIPE_SECRET_KEY` — payments (test mode ok)
- `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` — database

## Deploy

Push to GitHub → Vercel auto-deploys from `main` branch.

Add all env vars from `.env.example` in Vercel dashboard.

## Supabase Setup

Run `supabase/schema.sql` in your Supabase SQL editor.

## Stripe Setup

```bash
STRIPE_SECRET_KEY=sk_test_... npx ts-node scripts/stripe-setup.ts
```

Copy output price IDs into `.env.local`.
