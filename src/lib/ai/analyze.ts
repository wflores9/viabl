import Anthropic from '@anthropic-ai/sdk'
import Exa from 'exa-js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function getMarketContext(ideaText: string, industry: string, target: string) {
  if (!process.env.EXA_API_KEY) return null
  try {
    const exa = new Exa(process.env.EXA_API_KEY)
    const [competitors, marketData] = await Promise.all([
      exa.searchAndContents(
        `${industry} startup companies competing with "${ideaText.substring(0, 60)}"`,
        { numResults: 5, highlights: true, summary: true }
      ),
      exa.searchAndContents(
        `${industry} market size revenue growth 2024 2025`,
        { numResults: 3, highlights: true, summary: true }
      )
    ])
    const competitorList = competitors.results.map(r =>
      `- ${r.title}: ${r.summary || r.highlights?.[0] || r.url}`
    ).join('\n')
    const marketInfo = marketData.results.map(r =>
      `- ${r.title}: ${r.summary || r.highlights?.[0] || ''}`
    ).join('\n')
    return { competitorList, marketInfo }
  } catch (err) {
    console.warn('[exa] search failed:', err)
    return null
  }
}

export async function runAnalysis(params: {
  ideaText: string; industry: string; target: string; model: string;
  geography: string; stage: string; budget: number; notes?: string
}) {
  const marketContext = await getMarketContext(params.ideaText, params.industry, params.target)

  const prompt = `You are a senior venture analyst and startup advisor. Analyze this business idea with brutal honesty.

BUSINESS IDEA: ${params.ideaText}
INDUSTRY: ${params.industry}
TARGET CUSTOMER: ${params.target}
BUSINESS MODEL: ${params.model}
GEOGRAPHY: ${params.geography}
FOUNDER STAGE: ${params.stage}
AVAILABLE BUDGET: $${params.budget.toLocaleString()}
${params.notes ? `ADDITIONAL NOTES: ${params.notes}` : ''}
${marketContext ? `
REAL COMPETITOR DATA (from live web research):
${marketContext.competitorList}

REAL MARKET DATA:
${marketContext.marketInfo}
` : ''}

Provide a comprehensive viability analysis. Return ONLY valid JSON matching this exact structure:
{
  "overall_score": <number 0-100>,
  "verdict": <"GO" | "MAYBE" | "NO">,
  "idea_summary": <string, 4-6 words>,
  "one_liner": <string, one compelling sentence in quotes>,
  "summary": <string, 2-3 sentences, brutal honest assessment>,
  "market_size": <string, specific numbers if available>,
  "demand_signal": <string, evidence of real demand>,
  "competition": <string, specific named competitors if found>,
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
  "revenue_models": [<string>, ...],
  "mrr_potential": <string, specific $ estimates>,
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
  return JSON.parse(jsonMatch[0])
}
