import Anthropic from '@anthropic-ai/sdk'
import type { IdeaInput, AnalysisResult } from '@/types'
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const SYSTEM = `You are a senior venture analyst. Analyze the business idea across 9 dimensions.
Return ONLY valid JSON — no markdown, no explanation.
Schema: {"overall_score":number,"verdict":"GO"|"MAYBE"|"NO","idea_summary":string,"one_liner":string,"summary":string,"market_size":string,"demand_signal":string,"competition":string,"metrics":{"Market Demand":number,"Competition":number,"Revenue Potential":number,"Execution Risk":number,"Moat / Edge":number,"Customer Acquisition":number,"Regulatory":number,"Tech Feasibility":number,"Founder-Market Fit":number},"revenue_models":string[],"mrr_potential":string,"top_risks":string[],"next_steps":string[],"dimensions":[{"name":string,"score":number,"body":string,"risk_level":"low"|"medium"|"high"}],"recommendations":{"gtm":string[],"tools":string[],"first_30_days":string[]}}
Verdicts: GO>=70, MAYBE 45-69, NO<45. Be direct and honest.`
export async function runAnalysis(input:IdeaInput):Promise<{result:AnalysisResult;raw:string}> {
  const msg = await client.messages.create({
    model:'claude-sonnet-4-6', max_tokens:4000, system:SYSTEM,
    messages:[{role:'user',content:`Idea: ${input.ideaText}\nIndustry: ${input.industry||'N/A'}\nTarget: ${input.target||'N/A'}\nModel: ${input.model||'N/A'}\nGeo: ${input.geography||'Global'}\nStage: ${input.stage||'N/A'}\nBudget: ${input.budget?'$'+input.budget.toLocaleString():'N/A'}`}],
  })
  const raw = msg.content[0].type==='text' ? msg.content[0].text : ''
  const cleaned = raw.replace(/```json\n?|\n?```/g,'').trim()
  return { result:JSON.parse(cleaned) as AnalysisResult, raw }
}
