import { NextRequest, NextResponse } from 'next/server'
import { runAnalysis } from '@/lib/ai/analyze'
import type { IdeaInput } from '@/types'
export async function POST(req:NextRequest) {
  try {
    const body = await req.json() as IdeaInput
    if (!body.ideaText||body.ideaText.trim().length<20)
      return NextResponse.json({error:'Please describe your idea in more detail.'},{status:400})
    const {result} = await runAnalysis(body)
    const analysisId = crypto.randomUUID()
    return NextResponse.json({analysisId,status:'complete',result})
  } catch(err) {
    console.error('[analyze]',err)
    return NextResponse.json({error:'Analysis failed. Please try again.'},{status:500})
  }
}
