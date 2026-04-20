export const runtime = 'nodejs'
export const maxDuration = 60

import { NextRequest, NextResponse } from 'next/server'
import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 })

  let browser = null
  try {
    const isProd = process.env.NODE_ENV === 'production'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    browser = await puppeteer.launch({
      args: isProd ? chromium.args : ['--no-sandbox','--disable-setuid-sandbox'],
      executablePath: isProd
        ? await chromium.executablePath()
        : '/usr/bin/chromium-browser',
      headless: true,
    })

    const page = await browser.newPage()
    await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 2 })

    // Load results page with pdf mode
    await page.goto(`${appUrl}/results/${id}?pdf=true&unlock=true`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    })

    // Wait for content to render
    await page.waitForSelector('[data-pdf-ready]', { timeout: 10000 }).catch(() => {})
    await new Promise(r => setTimeout(r, 2000))

    // Hide nav, copilot, paywall for PDF
    await page.addStyleTag({ content: `
      nav, .no-print, [data-copilot], .fixed.bottom-0 { display: none !important; }
      body { background: #0e0c0a !important; }
      @media print { * { -webkit-print-color-adjust: exact !important; } }
    `})

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    })

    await browser.close()

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="viabl-report-${id}.pdf"`,
        'Cache-Control': 'no-store',
      }
    })
  } catch (err) {
    if (browser) await browser.close().catch(() => {})
    console.error('[pdf]', err)
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 })
  }
}
