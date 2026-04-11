import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL)
    return NextResponse.json({ id: params.id, status: 'complete' })

  try {
    const { getAnalysis } = await import('@/lib/db/analyses')
    const analysis = await getAnalysis(params.id)
    if (!analysis) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(analysis)
  } catch (err) {
    console.error('[analysis/id]', err)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
