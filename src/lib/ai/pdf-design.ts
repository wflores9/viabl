import Anthropic from '@anthropic-ai/sdk'
import type { AnalysisResult, BrandKit } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function generatePDFLayout(
  analysis: AnalysisResult,
  brandKit: BrandKit | null,
  ideaSummary: string
): Promise<string> {
  const primary = brandKit?.primary_color || '#C8102E'
  const accent  = brandKit?.accent_color  || '#F0EDE6'
  const name    = brandKit?.name          || ideaSummary

  const verdictColor = analysis.verdict === 'GO'    ? '#3DAA6A'
                     : analysis.verdict === 'MAYBE' ? '#C4973A' : '#C8102E'
  const verdictLabel = analysis.verdict === 'GO'    ? 'STRONG GO'
                     : analysis.verdict === 'MAYBE' ? 'VIABLE WITH CONDITIONS' : 'HIGH RISK'

  const metricsRows = Object.entries(analysis.metrics).map(([k, v]) => {
    const color = v >= 70 ? '#3DAA6A' : v >= 45 ? '#C4973A' : '#C8102E'
    const pct   = Math.round(v)
    return `
      <div class="metric-row">
        <span class="metric-label">${k}</span>
        <div class="metric-bar-wrap">
          <div class="metric-bar" style="width:${pct}%;background:${color}"></div>
        </div>
        <span class="metric-val" style="color:${color}">${pct}</span>
      </div>`
  }).join('')

  const risksHTML  = analysis.top_risks.map(r  => `<li>${r}</li>`).join('')
  const stepsHTML  = analysis.next_steps.map((s,i) => `<div class="step"><span class="step-n">0${i+1}</span><span>${s}</span></div>`).join('')
  const revsHTML   = analysis.revenue_models.map(m => `<span class="tag">${m}</span>`).join('')
  const dimsHTML   = analysis.dimensions?.slice(0,9).map(d => `
    <div class="dim-card">
      <div class="dim-score" style="color:${d.score>=70?'#3DAA6A':d.score>=45?'#C4973A':'#C8102E'}">${d.score}</div>
      <div class="dim-name">${d.name}</div>
      <div class="dim-body">${d.body}</div>
    </div>`).join('') || ''

  const brandHTML = brandKit ? `
    <div class="section">
      <div class="section-tag">Brand Identity</div>
      <div class="brand-header">
        <h2 class="brand-name">${brandKit.name}<span style="color:${primary}">.</span></h2>
        <p class="brand-tagline">"${brandKit.tagline}"</p>
        <p class="brand-pos">${brandKit.positioning}</p>
      </div>
      <div class="brand-grid">
        <div class="brand-block">
          <div class="block-label">Voice Tone</div>
          <div class="block-val">${brandKit.voice_tone}</div>
        </div>
        <div class="brand-block">
          <div class="block-label">Personality</div>
          <div class="block-val">${brandKit.voice_personality}</div>
        </div>
        <div class="brand-block">
          <div class="block-label">Never Say</div>
          <div class="block-val">${brandKit.voice_avoid}</div>
        </div>
        <div class="brand-block">
          <div class="block-label">ICP</div>
          <div class="block-val">${brandKit.icp}</div>
        </div>
        <div class="brand-block">
          <div class="block-label">Elevator Pitch</div>
          <div class="block-val">${brandKit.elevator_pitch}</div>
        </div>
        <div class="brand-block">
          <div class="block-label">Domain Ideas</div>
          <div class="block-val">${brandKit.domain_ideas?.join(', ')}</div>
        </div>
      </div>
      <div class="color-swatches">
        ${[{hex:primary,n:'Primary'},{hex:accent,n:'Accent'},{hex:'#050505',n:'Black'},{hex:'#F0EDE6',n:'Ivory'}].map(c=>`
          <div class="swatch">
            <div class="swatch-color" style="background:${c.hex};border:${c.hex==='#F0EDE6'?'1px solid #ddd':'none'}"></div>
            <div class="swatch-name">${c.n}</div>
            <div class="swatch-hex">${c.hex}</div>
          </div>`).join('')}
      </div>
    </div>` : ''

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Barlow+Condensed:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#fff; color:#111; font-family:'DM Mono',monospace; font-size:11px; line-height:1.6; }

  /* COVER PAGE */
  .cover { background:#050505; color:#F0EDE6; min-height:100vh; padding:60px; display:flex; flex-direction:column; justify-content:space-between; page-break-after:always; }
  .cover-logo { font-family:'Playfair Display',serif; font-weight:900; font-style:italic; font-size:48px; letter-spacing:-.02em; }
  .cover-logo span { color:${primary}; }
  .cover-tag { font-size:8px; letter-spacing:.35em; text-transform:uppercase; color:#737068; margin-top:8px; }
  .cover-main { flex:1; display:flex; flex-direction:column; justify-content:center; padding:60px 0; }
  .cover-verdict { display:inline-block; font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:11px; letter-spacing:.3em; text-transform:uppercase; color:#fff; background:${verdictColor}; padding:6px 16px; margin-bottom:20px; }
  .cover-score { font-family:'Playfair Display',serif; font-weight:900; font-size:120px; line-height:1; color:${verdictColor}; margin-bottom:8px; }
  .cover-score-label { font-size:8px; letter-spacing:.3em; text-transform:uppercase; color:#737068; margin-bottom:32px; }
  .cover-idea { font-family:'Playfair Display',serif; font-weight:900; font-size:32px; line-height:1.1; max-width:600px; margin-bottom:16px; }
  .cover-summary { font-size:11px; color:#9a9388; line-height:1.85; max-width:520px; }
  .cover-footer { display:flex; justify-content:space-between; align-items:flex-end; border-top:1px solid rgba(255,255,255,.1); padding-top:24px; }
  .cover-meta { font-size:8px; letter-spacing:.1em; color:#737068; line-height:1.8; }
  .cover-red-bar { width:60px; height:3px; background:${primary}; }

  /* SECTIONS */
  .page { padding:60px; page-break-before:always; }
  .section { margin-bottom:40px; }
  .section-tag { font-size:7px; letter-spacing:.4em; text-transform:uppercase; color:${primary}; display:flex; align-items:center; gap:8px; margin-bottom:16px; }
  .section-tag::before { content:''; display:block; width:20px; height:1px; background:${primary}; }
  .section-title { font-family:'Playfair Display',serif; font-weight:900; font-size:24px; line-height:1.1; margin-bottom:12px; }
  .section-body { font-size:11px; color:#444; line-height:1.85; }

  /* METRICS */
  .metric-row { display:flex; align-items:center; gap:12px; margin-bottom:10px; }
  .metric-label { font-size:9px; color:#666; width:160px; flex-shrink:0; letter-spacing:.05em; }
  .metric-bar-wrap { flex:1; height:3px; background:#eee; }
  .metric-bar { height:100%; transition:none; }
  .metric-val { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:13px; width:28px; text-align:right; flex-shrink:0; }

  /* DIMS */
  .dims-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:1px; background:#eee; margin-top:16px; }
  .dim-card { background:#fff; padding:16px 14px; }
  .dim-score { font-family:'Playfair Display',serif; font-weight:900; font-size:28px; line-height:1; margin-bottom:4px; }
  .dim-name { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:10px; letter-spacing:.1em; text-transform:uppercase; margin-bottom:6px; }
  .dim-body { font-size:9px; color:#666; line-height:1.7; }

  /* RISKS + STEPS */
  .risks-list { list-style:none; }
  .risks-list li { display:flex; gap:10px; padding:8px 0; border-bottom:1px solid #f0f0f0; font-size:10px; color:#444; line-height:1.6; }
  .risks-list li::before { content:'·'; color:${primary}; font-size:18px; line-height:1; flex-shrink:0; }
  .step { display:flex; gap:16px; padding:10px 0; border-bottom:1px solid #f0f0f0; align-items:flex-start; }
  .step-n { font-family:'Playfair Display',serif; font-weight:900; font-size:24px; color:#ddd; line-height:1; flex-shrink:0; }

  /* TAGS */
  .tag { display:inline-block; font-family:'Barlow Condensed',sans-serif; font-weight:600; font-size:9px; letter-spacing:.1em; text-transform:uppercase; border:1px solid #ddd; padding:3px 8px; margin:2px; }

  /* BRAND */
  .brand-header { margin-bottom:24px; padding-bottom:20px; border-bottom:1px solid #eee; }
  .brand-name { font-family:'Playfair Display',serif; font-weight:900; font-size:40px; line-height:1; margin-bottom:6px; }
  .brand-tagline { font-family:'Barlow Condensed',sans-serif; font-weight:600; font-size:14px; letter-spacing:.12em; text-transform:uppercase; color:#666; margin-bottom:8px; }
  .brand-pos { font-size:11px; color:#444; line-height:1.75; max-width:500px; }
  .brand-grid { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:#eee; margin:16px 0; }
  .brand-block { background:#fff; padding:14px; }
  .block-label { font-size:7px; letter-spacing:.28em; text-transform:uppercase; color:#999; margin-bottom:4px; }
  .block-val { font-size:10px; color:#222; line-height:1.65; }
  .color-swatches { display:flex; gap:1px; margin-top:16px; }
  .swatch { flex:1; }
  .swatch-color { height:48px; }
  .swatch-name { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:9px; text-transform:uppercase; letter-spacing:.08em; margin-top:6px; }
  .swatch-hex { font-size:8px; color:#999; }

  /* PAGE HEADER */
  .page-header { display:flex; justify-content:space-between; align-items:center; padding-bottom:20px; margin-bottom:32px; border-bottom:2px solid ${primary}; }
  .ph-logo { font-family:'Playfair Display',serif; font-weight:900; font-style:italic; font-size:18px; }
  .ph-logo span { color:${primary}; }
  .ph-meta { font-size:8px; color:#999; letter-spacing:.08em; text-align:right; line-height:1.8; }

  /* TWO COL */
  .two-col { display:grid; grid-template-columns:1fr 1fr; gap:32px; }
  .col-block { }
  .col-label { font-size:7px; letter-spacing:.32em; text-transform:uppercase; color:${primary}; margin-bottom:8px; display:flex; align-items:center; gap:6px; }
  .col-label::before { content:''; display:block; width:14px; height:1px; background:${primary}; }
  .col-body { font-size:10px; color:#333; line-height:1.85; padding-left:12px; border-left:2px solid ${primary}; }
</style>
</head>
<body>

<!-- COVER -->
<div class="cover">
  <div>
    <div class="cover-logo">VIABL<span>.</span></div>
    <div class="cover-tag">Business Viability Report · Analysis Engine v2.1</div>
  </div>
  <div class="cover-main">
    <div class="cover-verdict">${verdictLabel}</div>
    <div class="cover-score">${analysis.overall_score}</div>
    <div class="cover-score-label">Overall Viability Score / 100</div>
    <div class="cover-idea">${name}</div>
    <div class="cover-summary">${analysis.summary}</div>
  </div>
  <div class="cover-footer">
    <div class="cover-meta">
      viabl.co · Know Before You Build<br>
      Generated ${new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}<br>
      Not financial or legal advice
    </div>
    <div class="cover-red-bar"></div>
  </div>
</div>

<!-- PAGE 2: MARKET ANALYSIS -->
<div class="page">
  <div class="page-header">
    <div class="ph-logo">VIABL<span>.</span></div>
    <div class="ph-meta">Business Viability Report<br>Score: ${analysis.overall_score}/100 · ${verdictLabel}</div>
  </div>

  <div class="two-col" style="margin-bottom:32px">
    <div class="col-block">
      <div class="col-label">Market Size</div>
      <div class="col-body">${analysis.market_size}</div>
    </div>
    <div class="col-block">
      <div class="col-label">Demand Signal</div>
      <div class="col-body">${analysis.demand_signal}</div>
    </div>
  </div>

  <div class="section">
    <div class="col-label">Competitive Landscape</div>
    <div class="col-body" style="margin-bottom:24px">${analysis.competition}</div>
  </div>

  <div class="section">
    <div class="section-tag">Analysis Metrics</div>
    ${metricsRows}
  </div>

  <div class="section">
    <div class="section-tag">Revenue Models</div>
    <div style="margin-bottom:16px">${revsHTML}</div>
    <div class="col-label">MRR Potential</div>
    <div class="col-body">${analysis.mrr_potential}</div>
  </div>
</div>

<!-- PAGE 3: DIMENSIONS + RISKS -->
<div class="page">
  <div class="page-header">
    <div class="ph-logo">VIABL<span>.</span></div>
    <div class="ph-meta">Business Viability Report<br>Score: ${analysis.overall_score}/100 · ${verdictLabel}</div>
  </div>

  ${dimsHTML ? `
  <div class="section">
    <div class="section-tag">9 Dimensions</div>
    <div class="dims-grid">${dimsHTML}</div>
  </div>` : ''}

  <div class="two-col" style="margin-top:32px">
    <div>
      <div class="section-tag">Top Risks</div>
      <ul class="risks-list">${risksHTML}</ul>
    </div>
    <div>
      <div class="section-tag">Your Next 3 Moves</div>
      ${stepsHTML}
    </div>
  </div>
</div>

<!-- PAGE 4: BRAND KIT (if available) -->
${brandHTML}

</body>
</html>`
}
