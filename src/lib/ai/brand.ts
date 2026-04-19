import Anthropic from '@anthropic-ai/sdk'
import type { AnalysisResult, BrandKit } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM = `You are a world-class brand strategist and identity designer. Given a business analysis, generate a complete, professional brand identity kit.
Return ONLY valid JSON — no markdown, no explanation, no code fences.
Be highly specific to the idea — never generic. Names should be memorable, domain-friendly, and distinct.
Schema: {
  "name": string,
  "tagline": string,
  "positioning": string,
  "voice_tone": string,
  "voice_personality": string,
  "voice_avoid": string,
  "primary_color": string,
  "accent_color": string,
  "font_display": string,
  "font_body": string,
  "icp": string,
  "elevator_pitch": string,
  "domain_ideas": string[]
}
Rules:
- name: 1-2 words, no generic words like "app" or "hub". Evocative, domain-friendly.
- tagline: Under 8 words. Action-oriented. No clichés.
- positioning: One sentence. Who it's for, what it does, why it wins.
- voice_tone: 3 adjectives max.
- voice_personality: One vivid analogy (e.g. "A CFO who speaks like a chef").
- voice_avoid: Specific phrases or tones to never use.
- primary_color: Hex code that fits the brand emotionally.
- accent_color: Hex code for highlights/CTAs.
- font_display: Specific Google Font name for headlines.
- font_body: Specific Google Font name for body text.
- icp: Ideal customer in one tight sentence (job title, pain, context).
- elevator_pitch: 2-sentence investor/customer pitch. No filler.
- domain_ideas: Array of 4 available-sounding .com domain names.`

export async function generateBrandKit(
  analysis: AnalysisResult,
  ideaText: string
): Promise<BrandKit> {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    system: SYSTEM,
    messages: [{
      role: 'user',
      content: `Business Idea: ${ideaText}
Idea Summary: ${analysis.idea_summary}
One-liner: ${analysis.one_liner}
Market Size: ${analysis.market_size}
Target Customer: ${analysis.demand_signal}
Competition: ${analysis.competition}
Revenue Models: ${analysis.revenue_models.join(', ')}
Overall Score: ${analysis.overall_score}/100
Verdict: ${analysis.verdict}
Top Risks: ${analysis.top_risks.slice(0,2).join('; ')}
Generate a brand kit that is authentic to this specific idea.`
    }]
  })

  const raw     = msg.content[0].type === 'text' ? msg.content[0].text : ''
  const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim()
  return JSON.parse(cleaned) as BrandKit
}
