import Anthropic from '@anthropic-ai/sdk'
import Exa from 'exa-js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function getMarketContext(ideaText: string, industry: string) {
  // Exa disabled temporarily — connection issues on Vercel
  return null
}


export async function runAnalysis(params: {
  ideaText: string; industry: string; target: string; model: string;
  geography: string; stage: string; budget: number; notes?: string
}) {
  const marketContext = await getMarketContext(params.ideaText, params.industry)

  const competitorList = (marketContext as any)?.competitors?.length
    ? marketContext.competitors.map((c: any) => `- ${c.name}: ${c.description || ''}`).join('\n')
    : null

  const prompt = `You are a senior venture analyst. Analyze this business idea with brutal honesty.

BUSINESS IDEA: ${params.ideaText}
INDUSTRY: ${params.industry}
TARGET CUSTOMER: ${params.target}
BUSINESS MODEL: ${params.model}
GEOGRAPHY: ${params.geography}
FOUNDER STAGE: ${params.stage}
AVAILABLE BUDGET: $${params.budget.toLocaleString()}
${params.notes ? `NOTES: ${params.notes}` : ''}
${marketContext ? `
LIVE MARKET DATA (from real-time web research):
Market Size: ${marketContext.marketSize}
Growth Rate: ${marketContext.growthRate}
Key Trends: ${marketContext.keyTrends}

REAL COMPETITORS FOUND:
${competitorList || 'No direct competitors found — could indicate blue ocean or very early market'}
` : ''}

Return ONLY valid JSON:
{
  "overall_score": <0-100>,
  "verdict": <"GO"|"MAYBE"|"NO">,
  "idea_summary": <4-6 words>,
  "one_liner": <one sentence in quotes>,
  "summary": <2-3 sentences brutal honest assessment>,
  "market_size": <specific numbers from live data if available>,
  "demand_signal": <evidence of real demand>,
  "competition": <named competitors from live research>,
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
