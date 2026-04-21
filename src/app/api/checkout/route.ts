import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, TIER_PRICES } from '@/lib/stripe/client'
import type { Tier } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { analysisId, tier, email } = await req.json() as {
      analysisId: string
      tier:       Tier
      email?:     string
    }

    if (!analysisId || !tier || tier === 'free')
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

    const validTier = tier as Exclude<Tier, 'free'>
    const session   = await createCheckoutSession(analysisId, validTier, email)

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const { createOrder } = await import('@/lib/db/orders')
        await createOrder(analysisId, validTier, TIER_PRICES[validTier].amount, session.id)
      } catch (err) {
        console.warn('[checkout] DB order skipped:', err)
      }
    }

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('[checkout] FULL ERROR:', JSON.stringify(err, null, 2), err?.message, err?.type, err?.code)
    return NextResponse.json({ error: 'Checkout failed. Please try again.' }, { status: 500 })
  }
}
