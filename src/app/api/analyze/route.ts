import { NextRequest, NextResponse } from 'next/server'
import { runAnalysis } from '@/lib/ai/analyze'
import type { IdeaInput } from '@/types'

// DB imports — only used when Supabase is configured
async function tryDB(input: IdeaInput, result: any, raw: string): Promise<string> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return crypto.randomUUID()
  try {
    const { createIdea } = await import('@/lib/db/ideas')
    const { createAnalysis, saveAnalysisResult } = await import('@/lib/db/analyses')
    const ideaId      = await createIdea(input)
    const analysisId  = await createAnalysis(ideaId)
    await saveAnalysisResult(analysisId, result, raw)
    return analysisId
  } catch (err) {
    console.warn('[analyze] DB write skipped:', err)
    return crypto.randomUUID()
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as IdeaInput
    if (!body.ideaText || body.ideaText.trim().length < 20)
      return NextResponse.json({ error: 'Please describe your idea in more detail.' }, { status: 400 })

    const { result, raw } = await runAnalysis(body as any)
    const analysisId = await tryDB(body, result, raw)

    return NextResponse.json({ analysisId, status: 'complete', result })
  } catch (err) {
    console.error('[analyze]', err)
    return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500 })
  }
}
