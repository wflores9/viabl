import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  const { email } = await req.json()

  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Valid email required.' }, { status: 400 })
  }

  try {
    // Add to Resend audience
    await resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID,
      unsubscribed: false,
    })

    // Send welcome email
    await resend.emails.send({
      from: 'Viabl <hello@viabl.co>',
      to: email,
      subject: 'Welcome to Viabl — your idea checker',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #111;">
          <div style="font-size: 24px; font-weight: 900; letter-spacing: -0.03em; margin-bottom: 8px;">
            viabl<span style="color: #84cc16;">.co</span>
          </div>
          <hr style="border: none; border-top: 2px solid #111; margin: 16px 0 24px;" />
          <p style="font-size: 15px; line-height: 1.7; color: #333;">
            Thanks for joining Viabl. You're in early.
          </p>
          <p style="font-size: 14px; line-height: 1.7; color: #555; margin-top: 16px;">
            Every business idea deserves an honest verdict before you spend months building it.
            That's what Viabl does — market size, competition, revenue models, risks, and a clear go/no-go score in 60 seconds.
          </p>
          <div style="margin-top: 32px;">
            <a href="https://viabl.co" style="display: inline-block; background: #d4ff00; color: #000; font-weight: 700; font-size: 14px; padding: 14px 28px; text-decoration: none; letter-spacing: 0.05em; text-transform: uppercase;">
              Run your first check →
            </a>
          </div>
          <p style="font-size: 12px; color: #aaa; margin-top: 40px;">
            viabl.co · Not financial or legal advice
          </p>
        </div>
      `,
    })

    return Response.json({ success: true })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Could not subscribe.' }, { status: 500 })
  }
}
