import { supabaseAdmin } from './client'
import type { AnalysisResult, AnalysisStatus } from '@/types'

export async function createAnalysis(ideaId: string): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from('analyses')
    .insert({ idea_id: ideaId, status: 'pending' })
    .select('id')
    .single()

  if (error) throw new Error(`createAnalysis: ${error.message}`)
  return data.id as string
}

export async function saveAnalysisResult(
  id: string,
  result: AnalysisResult,
  raw: string
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('analyses')
    .update({
      status:          'complete',
      overall_score:   result.overall_score,
      verdict:         result.verdict,
      summary:         result.summary,
      one_liner:       result.one_liner,
      idea_summary:    result.idea_summary,
      dimensions:      result.dimensions,
      metrics:         result.metrics,
      revenue_models:  result.revenue_models,
      mrr_potential:   result.mrr_potential,
      top_risks:       result.top_risks,
      next_steps:      result.next_steps,
      market_size:     result.market_size,
      demand_signal:   result.demand_signal,
      competition:     result.competition,
      recommendations: result.recommendations,
      raw_response:    raw,
    })
    .eq('id', id)

  if (error) throw new Error(`saveAnalysisResult: ${error.message}`)
}

export async function updateAnalysisStatus(id: string, status: AnalysisStatus): Promise<void> {
  const { error } = await supabaseAdmin
    .from('analyses')
    .update({ status })
    .eq('id', id)

  if (error) throw new Error(`updateAnalysisStatus: ${error.message}`)
}

export async function getAnalysis(id: string) {
  const { data, error } = await supabaseAdmin
    .from('analyses')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}
