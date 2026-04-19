import { render } from '@react-email/render'
import { ReportEmail } from '@/emails/ReportEmail'
import { PurchaseEmail } from '@/emails/PurchaseEmail'
import { SubscribeEmail } from '@/emails/SubscribeEmail'

let _resend: any = null
function getResend() {
  if (!_resend) { const { Resend } = require('resend'); _resend = new Resend(process.env.RESEND_API_KEY || 'placeholder') }
  return _resend
}

export async function sendReportEmail(to: string, score: number, verdict: string, ideaSummary: string, reportUrl: string, tier: string) {
  const html = render(ReportEmail({ score, verdict, ideaSummary, reportUrl, tier }))
  await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'reports@viabl.co',
    to,
    subject: `Your Viabl Report — Score: ${score}/100 — ${verdict}`,
    html,
  })
}

export async function sendPurchaseEmail(to: string, tier: string, amount: number, reportUrl: string, pdfUrl?: string, brandKitUrl?: string) {
  const html = render(PurchaseEmail({ tier, amount, reportUrl, pdfUrl, brandKitUrl }))
  await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'reports@viabl.co',
    to,
    subject: `Payment confirmed — ${tier} · Viabl`,
    html,
  })
}

export async function sendSubscribeConfirm(to: string) {
  const html = render(SubscribeEmail())
  await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'reports@viabl.co',
    to,
    subject: "You're on the Viabl list",
    html,
  })
}
