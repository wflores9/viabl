export const maxDuration = 60
export const runtime = 'nodejs'

import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function runAnalysis(params: {
  ideaText: string; industry: string; target: string; model: string;
  geography: string; stage: string; budget: number; notes?: string
}) {
  const prompt = `You are a senior venture analyst. Analyze this business idea with brutal honesty.

BUSINESS IDEA: ${params.ideaText}
INDUSTRY: ${params.industry}
TARGET CUSTOMER: ${params.target}
BUSINESS MODEL: ${params.model}
GEOGRAPHY: ${params.geography}
FOUNDER STAGE: ${params.stage}
AVAILABLE BUDGET: $${params.budget.toLocaleString()}
${params.notes ? `NOTES: ${params.notes}` : ''}

Return ONLY valid JSON, no markdown, no explanation:
{
  "overall_score": <0-100>,
  "verdict": <"GO"|"MAYBE"|"NO">,
  "idea_summary": <4-6 words>,
  "one_liner": <one sentence in quotes>,
  "summary": <2-3 sentences brutal honest assessment>,
  "market_size": <specific market size estimate>,
  "demand_signal": <evidence of real demand>,
  "competition": <named competitors>,
  "metrics": {
    "Market Demand": <0-100>,
    "Competition": <0-100>,
    "Revenue Potential": <0-100>,
    "Execution Risk": <0-100>,
    "Moat / Edge": <0-100>,
    "Customer Acquisition": <0-100>,
    "Regulatory": <0-100>,
    "Tech Feasibility": <0-100>,
    "Founder-Market Fit": <0-100>
  },
  "revenue_models": [<string>],
  "mrr_potential": <specific $ estimates>,
  "top_risks": [<string>, <string>, <string>],
  "next_steps": [<string>, <string>, <string>],
  "dimensions": [],
  "recommendations": { "gtm": [], "tools": [], "first_30_days": [] }
}`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }]
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No valid JSON in response')
  return { result: JSON.parse(jsonMatch[0]), raw: text }
}
