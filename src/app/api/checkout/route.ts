import { NextRequest, NextResponse } from 'next/server'
import { stripe, TIER_PRICES } from '@/lib/stripe/client'
import type { Tier } from '@/types'
export async function POST(req:NextRequest) {
  try {
    const {analysisId,tier,email} = await req.json() as {analysisId:string;tier:Exclude<Tier,'free'>;email?:string}
    const appUrl = process.env.NEXT_PUBLIC_APP_URL||'http://localhost:3000'
    const t = TIER_PRICES[tier]
    const session = await stripe.checkout.sessions.create({
      mode:'payment', payment_method_types:['card'], customer_email:email||undefined,
      line_items:[{price_data:{currency:'usd',unit_amount:t.amount,product_data:{name:t.name}},quantity:1}],
      metadata:{analysisId,tier},
      success_url:`${appUrl}/confirm/${analysisId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:`${appUrl}/results/${analysisId}`,
    })
    return NextResponse.json({url:session.url})
  } catch(err) {
    console.error('[checkout]',err)
    return NextResponse.json({error:'Checkout failed.'},{status:500})
  }
}
