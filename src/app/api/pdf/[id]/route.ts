import { NextRequest, NextResponse } from 'next/server'
import { generatePDFLayout } from '@/lib/ai/pdf-design'

export const maxDuration = 60

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const analysis = await (async () => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null
      const { getAnalysis } = await import('@/lib/db/analyses')
      return getAnalysis(params.id)
    })()

    if (!analysis?.overall_score) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 })
    }

    const html = await generatePDFLayout(
      analysis,
      analysis.brand_kit || null,
      analysis.idea_summary || 'Business Analysis'
    )

    try {
      const chromium  = (await import('@sparticuz/chromium')).default
      const puppeteer = (await import('puppeteer-core')).default

      const browser = await puppeteer.launch({
        args:            chromium.args,
        executablePath:  await chromium.executablePath(),
        headless:        true,
      })

      const page = await browser.newPage()
      await page.setContent(html, { waitUntil: 'networkidle0' })
      // brief wait for fonts
      await new Promise(r => setTimeout(r, 1500))

      const pdfUint8 = await page.pdf({
        format:          'A4',
        printBackground: true,
        margin:          { top:'0', right:'0', bottom:'0', left:'0' },
      })

      await browser.close()

      return new NextResponse(Buffer.from(pdfUint8) as unknown as BodyInit, {
        headers: {
          'Content-Type':        'application/pdf',
          'Content-Disposition': `attachment; filename="Viabl_Report_${params.id.substring(0,8)}.pdf"`,
        }
      })

    } catch (puppeteerErr) {
      console.warn('[pdf] Puppeteer failed, falling back to HTML:', puppeteerErr)
      // Fallback: return printable HTML
      return new NextResponse(html, {
        headers: {
          'Content-Type':    'text/html; charset=utf-8',
          'X-PDF-Fallback':  'true',
        }
      })
    }

  } catch (err) {
    console.error('[pdf/id]', err)
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 })
  }
}
