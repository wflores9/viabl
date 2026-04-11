import { supabaseAdmin } from './client'
import type { Tier } from '@/types'

export async function createOrder(
  analysisId: string,
  tier: Tier,
  amount: number,
  stripeSessionId: string
): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .insert({
      analysis_id:       analysisId,
      tier,
      amount,
      currency:          'usd',
      status:            'pending',
      stripe_session_id: stripeSessionId,
    })
    .select('id')
    .single()

  if (error) throw new Error(`createOrder: ${error.message}`)
  return data.id as string
}

export async function updateOrderPaid(
  stripeSessionId: string,
  stripePaymentId: string,
  customerEmail:   string,
  customerName:    string
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('orders')
    .update({
      status:            'paid',
      stripe_payment_id: stripePaymentId,
      customer_email:    customerEmail,
      customer_name:     customerName,
      delivered_at:      new Date().toISOString(),
    })
    .eq('stripe_session_id', stripeSessionId)

  if (error) throw new Error(`updateOrderPaid: ${error.message}`)
}

export async function getOrderBySession(sessionId: string) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('stripe_session_id', sessionId)
    .single()

  if (error) return null
  return data
}

export async function getOrderByAnalysis(analysisId: string) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('analysis_id', analysisId)
    .eq('status', 'paid')
    .single()

  if (error) return null
  return data
}
