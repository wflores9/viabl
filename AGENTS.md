# Viabl — Agent Instructions

## Project
AI-powered business viability analyzer at viabl.co.
Next.js 14 App Router, TypeScript, Tailwind, Zustand, Supabase, Stripe, Resend.

## Key Files
- `src/types/index.ts` — all shared types, constants (TIERS, INDUSTRIES, etc.)
- `src/store/viabl.ts` — Zustand global store
- `src/lib/ai/analyze.ts` — Claude API call, 9-dimension prompt
- `src/lib/db/` — Supabase CRUD (ideas, analyses, orders)
- `src/lib/stripe/client.ts` — Stripe init + TIER_PRICES
- `DESIGN.md` — all design tokens and component rules

## User Flow
/ → /analyze (3 steps) → /analyzing/[id] → /results/[id] → /checkout/[id] → /confirm/[id]
                                                           → /brand/[id] (Founder Pack+)

## Intake Form (Step 1) — FROM EXISTING REPO, DO NOT CHANGE LAYOUT
Exact stacked layout:
1. YOUR BUSINESS IDEA — textarea, full width
2. INDUSTRY — dropdown, full width, stacked
3. TARGET CUSTOMER — input, full width, stacked
4. [ RUN VIABL CHECK → ] — full width acid button
5. "Free preview · 60 seconds · No signup"

## Tier Structure
| Tier         | Price | Key Deliverable          |
|--------------|-------|--------------------------|
| free         | $0    | Score + 2 dimensions     |
| report       | $19   | All 9 dims + PDF         |
| founder_pack | $79   | Report + brand identity  |
| launch_kit   | $149  | Founder Pack + GTM + LLC |

## API Routes
- POST /api/analyze — runs Claude, saves to DB, returns { analysisId, result }
- POST /api/checkout — creates Stripe session, returns { url }
- POST /api/webhook/stripe — handles payment confirmation
- GET  /api/analysis/[id] — fetches analysis from DB

## Environment Variables Required
- ANTHROPIC_API_KEY — required for /api/analyze
- STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET — required for payments
- NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY — required for DB
- RESEND_API_KEY — required for email delivery

## Design Rules (from DESIGN.md)
- Warm dark palette, NO purple, NO gradients on backgrounds
- Bebas Neue for all display text, DM Mono for everything else
- Acid (#d4ff00) used ONLY on CTAs, scores, active states
- No rounded corners except full circles
- Card gaps are 3px (seam effect)
