import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import type Stripe from 'stripe'
export async function POST(req:NextRequest) {
  const body=await req.text(); const sig=req.headers.get('stripe-signature')!
  try {
    const event=stripe.webhooks.constructEvent(body,sig,process.env.STRIPE_WEBHOOK_SECRET!)
    if(event.type==='checkout.session.completed'){const s=event.data.object as Stripe.Checkout.Session;console.log('paid:',s.id)}
    return NextResponse.json({received:true})
  } catch { return NextResponse.json({error:'Invalid signature'},{status:400}) }
}
