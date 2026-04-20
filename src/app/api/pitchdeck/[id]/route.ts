export const runtime = 'nodejs'
export const maxDuration = 60

import { NextRequest, NextResponse } from 'next/server'
import { generatePitchDeck } from '@/lib/ai/pitchdeck'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const analysis = await (async () => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null
      const { getAnalysis } = await import('@/lib/db/analyses')
      return getAnalysis(params.id)
    })()
    if (!analysis?.idea_summary) return NextResponse.json({ error: 'Analysis not found' }, { status: 404 })
    const buffer = await generatePitchDeck(analysis, null)
    return new NextResponse(Buffer.from(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="viabl-pitch-deck-${params.id}.pptx"`,
        'Cache-Control': 'no-store',
      }
    })
  } catch (err) {
    console.error('[pitchdeck]', err)
    return NextResponse.json({ error: 'Pitch deck generation failed' }, { status: 500 })
  }
}
