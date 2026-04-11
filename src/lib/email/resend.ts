import type { Resend as ResendType } from 'resend'

let _resend: ResendType | null = null

function getResend(): ResendType {
  if (!_resend) {
    const { Resend } = require('resend')
    _resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')
  }
  return _resend!
}

export async function sendReportEmail(to: string, name: string, _analysisId: string, url: string) {
  await getResend().emails.send({
    from:    process.env.RESEND_FROM_EMAIL || 'reports@viabl.co',
    to,
    subject: 'Your Viabl Report is ready',
    html:    `<div style="font-family:monospace;background:#0e0c0a;color:#f2ede8;padding:40px;max-width:600px"><h1 style="color:#d4ff00">VIABL.</h1><p>Hi ${name||'there'},</p><a href="${url}" style="display:inline-block;background:#d4ff00;color:#000;padding:14px 32px;text-decoration:none;margin:24px 0">DOWNLOAD REPORT</a><p style="font-size:11px;color:#5a544d">Not financial advice · viabl.co</p></div>`,
  })
}

export async function sendSubscribeConfirm(to: string) {
  await getResend().emails.send({
    from:    process.env.RESEND_FROM_EMAIL || 'reports@viabl.co',
    to,
    subject: "You're on the Viabl list",
    html:    `<div style="font-family:monospace;background:#0e0c0a;color:#f2ede8;padding:40px"><h1 style="color:#d4ff00">VIABL.</h1><p style="color:#8a8178">You're on the list.</p></div>`,
  })
}
