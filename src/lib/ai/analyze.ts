import Anthropic from '@anthropic-ai/sdk'
import Exa from 'exa-js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function getMarketContext(ideaText: string, industry: string) {
  return null // Temporarily disabled — connection issues on Vercel
  if (!process.env.EXA_API_KEY) return null
  try {
    const exa = new Exa(process.env.EXA_API_KEY)

    // Add 8 second timeout to all Exa calls
    const withTimeout = (promise: Promise<any>, ms: number) =>
      Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))])

    const [competitors, market] = await Promise.all([
      // Structured competitor data using outputSchema
      withTimeout(exa.search(`${industry} startup companies apps tools "${ideaText.substring(0,50)}"`, {
        type: 'auto',
        numResults: 2,
        outputSchema: {
          type: 'object',
          required: ['competitors'],
          properties: {
            competitors: {
              type: 'array',
              description: 'List of competing products or companies',
              items: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', description: 'Company or product name' },
                  description: { type: 'string', description: 'What they do and their positioning' }
                }
              }
            }
          }
        },
        contents: { highlights: { maxCharacters: 4000 } }
      }, 8000)),
      // Structured market size data
      withTimeout(exa.search(`${industry} market size revenue growth rate 2025 2026`, {
        type: 'auto',
        numResults: 2,
        outputSchema: {
          type: 'object',
          required: ['market_size', 'growth_rate'],
          properties: {
            market_size: { type: 'string', description: 'Total addressable market size in dollars' },
            growth_rate: { type: 'string', description: 'Annual growth rate percentage' },
            key_trends: { type: 'string', description: 'Main trends driving the market' }
          }
        },
        contents: { highlights: { maxCharacters: 4000 } }
      }, 8000))
    ])

    const competitorData = competitors.output?.content as any
    const marketData = market.output?.content as any

    return {
      competitors: competitorData?.competitors || [],
      marketSize: marketData?.market_size || '',
      growthRate: marketData?.growth_rate || '',
      keyTrends: marketData?.key_trends || ''
    }
  } catch (err) {
    console.warn('[exa] search failed:', err)
    return null
  }
}

export async function runAnalysis(params: {
  ideaText: string; industry: string; target: string; model: string;
  geography: string; stage: string; budget: number; notes?: string
}) {
  const marketContext = await getMarketContext(params.ideaText, params.industry)

  const competitorList = marketContext?.competitors?.length
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
