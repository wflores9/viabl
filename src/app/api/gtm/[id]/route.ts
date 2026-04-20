export const maxDuration = 30

import { NextRequest, NextResponse } from 'next/server'
import { generateGTM } from '@/lib/ai/gtm'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const analysis = await (async () => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null
      const { getAnalysis } = await import('@/lib/db/analyses')
      return getAnalysis(params.id)
    })()
    if (!analysis?.idea_summary) return NextResponse.json({ error: 'Analysis not found' }, { status: 404 })
    const gtm = await generateGTM(analysis)
    return NextResponse.json(gtm)
  } catch (err) {
    console.error('[gtm]', err)
    return NextResponse.json({ error: 'GTM generation failed' }, { status: 500 })
  }
}
