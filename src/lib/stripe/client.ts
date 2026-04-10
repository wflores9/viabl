import Stripe from 'stripe'
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion:'2024-06-20', typescript:true })
export const TIER_PRICES = {
  report:       { amount:1900,  name:'Viabl Report' },
  founder_pack: { amount:7900,  name:'Viabl Founder Pack' },
  launch_kit:   { amount:14900, name:'Viabl Launch Kit' },
}
