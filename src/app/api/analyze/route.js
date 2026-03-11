import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 60

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req) {
  const { idea, industry, target } = await req.json()

  if (!idea || idea.trim().length < 20) {
    return Response.json({ error: 'Please describe your idea in more detail.' }, { status: 400 })
  }

  const prompt = `You are a sharp startup analyst. Analyze this business idea and return ONLY valid JSON — no markdown, no explanation, just raw JSON.

Business idea: "${idea}"
Industry: "${industry || 'Not specified'}"
Target customer: "${target || 'Not specified'}"

Return exactly this structure:
{
  "ideaSummary": "Clean 1-sentence summary",
  "score": 72,
  "verdict": "GO",
  "marketSize": "Concise TAM description",
  "demandSignal": "Evidence of real demand",
  "competition": "Honest competitive landscape",
  "revenueModels": ["Subscription", "One-time fee"],
  "estimatedMRRPotential": "Realistic early MRR estimate with reasoning",
  "metrics": {
    "Market Demand": 75,
    "Competition": 45,
    "Execution Complexity": 60,
    "Revenue Clarity": 80,
    "Timing": 70
  },
  "topRisks": ["Risk one", "Risk two", "Risk three"],
  "nextSteps": ["First action", "Second action", "Third action"],
  "oneLiner": "Single most important insight"
}
Score 0-100. Verdict: "GO", "MAYBE", or "NO-GO" only.
Competition: lower = less competition (good). All others: higher = better.
Be specific and honest.`

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = message.content.map(b => b.text || '').join('')
    const result = JSON.parse(raw.replace(/```json|```/g, '').trim())
    return Response.json(result)
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Analysis failed. Please try again.', detail: e?.message }, { status: 500 })
  }
}
