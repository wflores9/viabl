export const maxDuration = 30

import { NextRequest, NextResponse } from 'next/server'
import { generateBrandKit } from '@/lib/ai/brand'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const analysis = await (async () => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null
      const { getAnalysis } = await import('@/lib/db/analyses')
      return getAnalysis(params.id)
    })()

    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 })
    }

    // Return cached brand kit if exists
    if (analysis.brand_kit) {
      return NextResponse.json(analysis.brand_kit)
    }

    // Generate fresh
    const brandKit = await generateBrandKit(analysis, analysis.idea_summary || analysis.summary || 'Business idea')

    // Cache to DB
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const { supabaseAdmin } = await import('@/lib/db/client')
        await supabaseAdmin.from('analyses').update({ brand_kit: brandKit }).eq('id', params.id)
      } catch (err) {
        console.warn('[brand] DB cache failed:', err)
      }
    }

    return NextResponse.json(brandKit)
  } catch (err) {
    console.error('[brand/id]', err)
    return NextResponse.json({ error: 'Brand kit generation failed' }, { status: 500 })
  }
}
