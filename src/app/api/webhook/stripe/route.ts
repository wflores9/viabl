import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { sendReportEmail } from '@/lib/email/resend'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { analysisId, tier } = session.metadata || {}

    // Update order in DB
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const { updateOrderPaid } = await import('@/lib/db/orders')
        await updateOrderPaid(
          session.id,
          session.payment_intent as string,
          session.customer_details?.email || '',
          session.customer_details?.name  || ''
        )
      } catch (err) {
        console.error('[webhook] DB update failed:', err)
      }
    }

    // Send confirmation email
    if (session.customer_details?.email && analysisId) {
      try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://viabl.co'
        await sendReportEmail(
          session.customer_details.email,
          session.customer_details.name || '',
          analysisId,
          `${appUrl}/confirm/${analysisId}`
        )
      } catch (err) {
        console.error('[webhook] email failed:', err)
      }
    }

    console.log(`✓ Payment confirmed: ${session.id} | ${tier} | ${analysisId}`)
  }

  return NextResponse.json({ received: true })
}
