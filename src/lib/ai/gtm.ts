import Anthropic from '@anthropic-ai/sdk'

export async function generateGTM(analysis: any) {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `You are a GTM strategist. Return ONLY valid JSON, no markdown, no explanation.
Business: ${analysis.idea_summary}
Market: ${analysis.market_size}
Competition: ${analysis.competition}

JSON schema — keep each string under 100 chars, max 3 items per array:
{
  "positioning_statement": "one sentence",
  "target_channels": [{ "channel": "name", "rationale": "why", "first_action": "do this" }],
  "day_1_to_30": [{ "week": "Week 1", "focus": "topic", "actions": ["action1","action2"] }],
  "day_31_to_90": [{ "milestone": "goal", "actions": ["action1","action2"] }],
  "pricing_strategy": "one sentence",
  "launch_sequence": ["step1","step2","step3"],
  "success_metrics": [{ "metric": "name", "target": "number", "timeline": "when" }],
  "budget_allocation": [{ "category": "name", "percentage": 30, "rationale": "why" }]
}`
    }]
  })
  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  // Extract JSON more robustly
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) return {}
  try {
    return JSON.parse(match[0])
  } catch {
    // Try to fix common JSON issues — truncated arrays, trailing commas
    let cleaned = match[0]
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
    // If still broken, find last complete object
    try {
      return JSON.parse(cleaned)
    } catch {
      // Return partial result up to last valid closing brace
      const lastBrace = cleaned.lastIndexOf('}')
      try {
        return JSON.parse(cleaned.slice(0, lastBrace + 1))
      } catch {
        return { positioning_statement: 'GTM analysis generated', target_channels: [], day_1_to_30: [], day_31_to_90: [], pricing_strategy: '', launch_sequence: [], success_metrics: [], budget_allocation: [] }
      }
    }
  }
}
