import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { sendReportEmail } from '@/lib/email/resend'
import type Stripe from 'stripe'

async function generatePDF(analysisId: string): Promise<string | null> {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://viabl.co'
    const res = await fetch(`${appUrl}/api/pdf/${analysisId}`)
    if (!res.ok) throw new Error(`PDF fetch failed: ${res.status}`)
    // PDF route handles upload internally — return confirm URL
    return `${appUrl}/confirm/${analysisId}`
  } catch (err) {
    console.error('[webhook] PDF generation failed:', err)
    return null
  }
}

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
    const session    = event.data.object as Stripe.Checkout.Session
    const analysisId = session.metadata?.analysisId
    const tier       = session.metadata?.tier

    // 1. Update order in DB
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && analysisId) {
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

    // 2. Generate + upload PDF
    const confirmUrl = analysisId ? await generatePDF(analysisId) : null

    // 3. Send email
    if (session.customer_details?.email && analysisId) {
      try {
        await sendReportEmail(
          session.customer_details.email,
          session.customer_details.name || '',
          analysisId,
          confirmUrl || `${process.env.NEXT_PUBLIC_APP_URL}/confirm/${analysisId}`
        )
      } catch (err) {
        console.error('[webhook] email failed:', err)
      }
    }

    console.log(`✓ Paid | ${tier} | ${analysisId} | ${session.customer_details?.email}`)
  }

  return NextResponse.json({ received: true })
}
