import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 60

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req) {
  const { idea, industry, target } = await req.json()

  if (!idea || idea.trim().length < 20) {
    return Response.json({ error: 'Please describe your idea in more detail.' }, { status: 400 })
  }

  const prompt = `Startup analyst. Return ONLY raw JSON, no markdown.

Idea: "${idea}"
Industry: "${industry || 'N/A'}"
Target: "${target || 'N/A'}"

{"ideaSummary":"1-sentence summary","score":72,"verdict":"GO","marketSize":"TAM","demandSignal":"demand evidence","competition":"landscape","revenueModels":["Model1"],"estimatedMRRPotential":"MRR estimate","metrics":{"Market Demand":75,"Competition":45,"Execution Complexity":60,"Revenue Clarity":80,"Timing":70},"topRisks":["Risk1","Risk2","Risk3"],"nextSteps":["Step1","Step2","Step3"],"oneLiner":"key insight"}

Score 0-100. Verdict: GO, MAYBE, or NO-GO. Competition: lower=less competition. Be concise.`

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
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
