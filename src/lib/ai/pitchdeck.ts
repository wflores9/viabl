import PptxGenJS from 'pptxgenjs'
import Anthropic from '@anthropic-ai/sdk'

export async function generatePitchDeck(analysis: any, brandKit: any) {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const response = await anthropic.messages.create({
    model: 'claude-opus-4-5-20251101',
    max_tokens: 4000,
    messages: [{
      role: 'user',
      content: `Create a 10-slide investor pitch deck. Return ONLY a JSON array, no markdown fences.
Idea: ${analysis.idea_summary}
Score: ${analysis.overall_score}/100
Market: ${analysis.market_size}
Competition: ${analysis.competition}
Revenue: ${analysis.mrr_potential}
Slides: Problem, Solution, Market Size, Product, Business Model, Competition, Traction, Team, Financials, Ask
Format: [{ "title": string, "subtitle": string, "bullets": string[], "notes": string }]`
    }]
  })
  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const match = text.match(/\[[\s\S]*\]/)
  const slides = match ? JSON.parse(match[0]) : []
  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE'
  slides.forEach((slide: any) => {
    const s = pptx.addSlide()
    s.background = { color: '0e0c0a' }
    s.addShape(pptx.ShapeType.rect, { x:0, y:0, w:0.08, h:7.5, fill:{ color:'d4ff00' } })
    s.addText(slide.title || '', { x:0.3, y:0.3, w:9, h:1, fontSize:36, bold:true, color:'f2ede8', fontFace:'Arial' })
    if (slide.subtitle) s.addText(slide.subtitle, { x:0.3, y:1.2, w:9, h:0.5, fontSize:16, color:'d4ff00', fontFace:'Arial' })
    if (slide.bullets?.length) {
      const bt = slide.bullets.map((b: string) => ({ text:b, options:{ bullet:{ type:'bullet' as const }, color:'8a8178', fontSize:14 } }))
      s.addText(bt, { x:0.3, y:1.9, w:9.2, h:4.5, fontFace:'Arial' })
    }
    if (slide.notes) s.addNotes(slide.notes)
    s.addText('VIABL.', { x:8.5, y:7.1, w:1.2, h:0.3, fontSize:10, color:'5a544d', fontFace:'Arial' })
  })
  const buffer = await pptx.write({ outputType: 'nodebuffer' }) as Buffer
  return buffer
}
