import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, TIER_PRICES } from '@/lib/stripe/client'
import type { Tier } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { analysisId, tier, email } = await req.json() as {
      analysisId: string
      tier:       Exclude<Tier,'free'>
      email?:     string
    }

    if (!analysisId || !tier || tier === 'free')
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

    const session = await createCheckoutSession(analysisId, tier, email)

    // Record order in DB
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const { createOrder } = await import('@/lib/db/orders')
        await createOrder(analysisId, tier, TIER_PRICES[tier].amount, session.id)
      } catch (err) {
        console.warn('[checkout] DB order skipped:', err)
      }
    }

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('[checkout]', err)
    return NextResponse.json({ error: 'Checkout failed. Please try again.' }, { status: 500 })
  }
}
