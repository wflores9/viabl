import Anthropic from '@anthropic-ai/sdk'

export async function generateGTM(analysis: any) {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 3000,
    messages: [{
      role: 'user',
      content: `You are a GTM strategist. Create a detailed go-to-market playbook.
Business: ${analysis.idea_summary}
Market: ${analysis.market_size}
Target: ${analysis.demand_signal}
Competition: ${analysis.competition}
Budget: Limited early-stage

Return ONLY valid JSON:
{
  "positioning_statement": string,
  "target_channels": [{ "channel": string, "rationale": string, "first_action": string }],
  "day_1_to_30": [{ "week": string, "focus": string, "actions": string[] }],
  "day_31_to_90": [{ "milestone": string, "actions": string[] }],
  "pricing_strategy": string,
  "launch_sequence": string[],
  "success_metrics": [{ "metric": string, "target": string, "timeline": string }],
  "budget_allocation": [{ "category": string, "percentage": number, "rationale": string }]
}`
    }]
  })
  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const match = text.match(/\{[\s\S]*\}/)
  return match ? JSON.parse(match[0]) : {}
}
