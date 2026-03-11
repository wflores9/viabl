import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  const { report, email } = await req.json()

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_PRO,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}`,
      customer_email: email || undefined,
      metadata: {
        ideaSummary: report?.ideaSummary?.slice(0, 200) || '',
        score: String(report?.score || ''),
        verdict: report?.verdict || '',
      },
    })

    return Response.json({ url: session.url })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Could not create checkout session.' }, { status: 500 })
  }
}
