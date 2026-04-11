import Stripe from 'stripe'
import type { Tier } from '@/types'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export const TIER_PRICES: Record<Exclude<Tier,'free'>, { amount:number; name:string; priceId:string }> = {
  report: {
    amount:  1900,
    name:    'Viabl Report',
    priceId: process.env.STRIPE_PRICE_REPORT || '',
  },
  founder_pack: {
    amount:  7900,
    name:    'Viabl Founder Pack',
    priceId: process.env.STRIPE_PRICE_FOUNDER_PACK || '',
  },
  launch_kit: {
    amount:  14900,
    name:    'Viabl Launch Kit',
    priceId: process.env.STRIPE_PRICE_LAUNCH_KIT || '',
  },
}

export async function createCheckoutSession(
  analysisId: string,
  tier:        Exclude<Tier,'free'>,
  email?:      string
): Promise<Stripe.Checkout.Session> {
  const t      = TIER_PRICES[tier]
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Use price ID if configured, else inline price_data
  const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = t.priceId
    ? { price: t.priceId, quantity: 1 }
    : {
        price_data: {
          currency:     'usd',
          unit_amount:  t.amount,
          product_data: { name: t.name },
        },
        quantity: 1,
      }

  return stripe.checkout.sessions.create({
    mode:                 'payment',
    payment_method_types: ['card'],
    customer_email:       email || undefined,
    line_items:           [lineItem],
    metadata:             { analysisId, tier },
    success_url:          `${appUrl}/confirm/${analysisId}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:           `${appUrl}/results/${analysisId}`,
    allow_promotion_codes: true,
  })
}
