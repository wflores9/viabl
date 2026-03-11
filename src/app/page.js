'use client'
import { useState, useEffect } from 'react'

const STEPS = [
  'Evaluating market size & demand signals',
  'Scanning competitive landscape',
  'Modeling revenue potential',
  'Identifying top risks',
  'Generating viability score',
]

const INDUSTRIES = [
  'Food & Beverage','Health & Wellness','Technology / SaaS',
  'E-commerce / Retail','Real Estate','Finance / Fintech',
  'Education','Construction / Trades','Hospitality / Travel',
  'Professional Services','Other',
]

const CSS = `
  :root {
    --bg: #080808; --surface: #101010; --surface2: #161616;
    --border: #1e1e1e; --border2: #2a2a2a;
    --accent: #d4ff00; --text: #f0f0f0;
    --muted: #505050; --dim: #888;
    --green: #22c55e; --yellow: #eab308; --red: #ef4444; --orange: #f97316;
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:var(--bg); color:var(--text); font-family:'DM Sans',sans-serif; }

  .logo { font-family:'Bebas Neue',sans-serif; letter-spacing:0.02em; line-height:1; }
  .mono { font-family:'DM Mono',monospace; }
  .bebas { font-family:'Bebas Neue',sans-serif; }

  .card { background:var(--surface); border:1px solid var(--border); padding:24px; margin-bottom:3px; }

  .section-label {
    font-family:'DM Mono',monospace; font-size:9px; font-weight:500;
    letter-spacing:0.22em; text-transform:uppercase; color:var(--muted);
    margin-bottom:10px; display:flex; align-items:center; gap:10px;
  }
  .section-label::after { content:''; flex:1; height:1px; background:var(--border); }

  textarea, select, input[type="text"], input[type="email"] {
    width:100%; background:var(--bg); border:1px solid var(--border2);
    color:var(--text); font-family:'DM Mono',monospace; font-size:13px;
    line-height:1.7; padding:14px 16px; outline:none; transition:border-color 0.2s; appearance:none;
  }
  textarea { resize:none; height:110px; }
  textarea:focus, select:focus, input:focus { border-color:var(--accent); }
  ::placeholder { color:var(--muted); }
  select option { background:#111; }

  .btn-primary {
    background:var(--accent); color:#000; border:none;
    font-family:'Bebas Neue',sans-serif; font-size:16px; letter-spacing:0.1em;
    padding:14px 32px; cursor:pointer; transition:all 0.15s;
  }
  .btn-primary:hover:not(:disabled) { background:#fff; transform:translateY(-1px); }
  .btn-primary:disabled { opacity:0.4; cursor:not-allowed; }

  .btn-ghost {
    background:transparent; border:1px solid var(--border2); color:var(--muted);
    font-family:'DM Mono',monospace; font-size:11px; letter-spacing:0.1em;
    text-transform:uppercase; padding:12px 20px; cursor:pointer; transition:all 0.15s;
  }
  .btn-ghost:hover { border-color:var(--accent); color:var(--accent); }

  .btn-stripe {
    background:var(--accent); color:#000; border:none;
    font-family:'Bebas Neue',sans-serif; font-size:15px; letter-spacing:0.1em;
    padding:13px 28px; cursor:pointer; transition:all 0.15s; display:inline-flex; align-items:center; gap:8px;
  }
  .btn-stripe:hover:not(:disabled) { background:#fff; }
  .btn-stripe:disabled { opacity:0.5; cursor:not-allowed; }

  .loader-bar { width:100%; height:1px; background:var(--border); position:relative; overflow:hidden; }
  .loader-bar::after {
    content:''; position:absolute; left:-40%; width:40%; height:100%;
    background:var(--accent); animation:loadslide 1.2s linear infinite;
  }
  @keyframes loadslide { to { left:140%; } }

  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  .reveal { animation:fadeUp 0.45s ease forwards; }
  .d1{animation-delay:0.04s;opacity:0} .d2{animation-delay:0.10s;opacity:0}
  .d3{animation-delay:0.16s;opacity:0} .d4{animation-delay:0.22s;opacity:0}
  .d5{animation-delay:0.28s;opacity:0} .d6{animation-delay:0.34s;opacity:0}
  .d7{animation-delay:0.40s;opacity:0}

  .model-tag {
    display:inline-block; background:var(--surface2); border:1px solid var(--border2);
    color:#ccc; font-family:'DM Mono',monospace; font-size:10px;
    padding:4px 10px; margin:3px 3px 3px 0; letter-spacing:0.05em;
  }

  .paywall {
    background: linear-gradient(135deg, #0d0d0d 0%, #111 100%);
    border:1px solid var(--border2); padding:32px; text-align:center; margin-bottom:3px;
  }

  @media (max-width:560px) {
    .grid2 { grid-template-columns:1fr !important; }
    .score-row { flex-direction:column !important; }
    .hero-logo { font-size:3.5rem !important; }
  }

  @media print {
    .no-print { display:none !important; }
    .print-root { padding:0 !important; background:white !important; }
  }
  @media screen {
    .print-root { background:#f4f4f4; min-height:100vh; padding:28px; }
  }
`

function Meter({ label, value, isCompetition }) {
  const display = isCompetition ? 100 - value : value
  const color = display >= 70 ? 'var(--green)' : display >= 45 ? 'var(--yellow)' : 'var(--red)'
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:11 }}>
      <div style={{ fontFamily:'DM Mono,monospace', fontSize:10, color:'var(--muted)', width:140, flexShrink:0 }}>{label}</div>
      <div style={{ flex:1, height:3, background:'var(--border2)' }}>
        <div style={{ height:'100%', width:`${display}%`, background:color, transition:'width 1.2s ease' }} />
      </div>
      <div style={{ fontFamily:'DM Mono,monospace', fontSize:10, color, width:26, textAlign:'right', fontWeight:500 }}>{display}</div>
    </div>
  )
}

function PrintView({ report, onBack }) {
  const date = new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})
  const sCol = report.score>=70?'#16a34a':report.score>=45?'#d97706':'#dc2626'
  const vBg  = report.verdict==='GO'?'#16a34a':report.verdict==='MAYBE'?'#d97706':'#dc2626'

  return (
    <div>
      <div className="no-print" style={{ background:'#0d0d0d', borderBottom:'1px solid #1e1e1e', padding:'12px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div className="logo" style={{ fontSize:'1.4rem' }}>viabl<span style={{color:'#d4ff00'}}>.</span><span style={{color:'#d4ff00',fontSize:'0.7em'}}>co</span></div>
          <div className="mono" style={{ fontSize:11, color:'#555' }}>
            Press <kbd style={{ background:'#1a1a1a', color:'#d4ff00', padding:'2px 7px', fontSize:10, border:'1px solid #333' }}>Ctrl+P</kbd> or <kbd style={{ background:'#1a1a1a', color:'#d4ff00', padding:'2px 7px', fontSize:10, border:'1px solid #333' }}>⌘+P</kbd>
            <strong style={{color:'#ccc'}}> → Save as PDF</strong>
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn-stripe" onClick={() => window.print()}>🖨 Save PDF</button>
          <button className="btn-ghost" onClick={onBack}>← Back</button>
        </div>
      </div>

      <div className="print-root">
        <div style={{ maxWidth:680, margin:'0 auto', background:'#fff', padding:'44px 52px', fontFamily:'Arial,sans-serif', color:'#111', boxShadow:'0 8px 40px rgba(0,0,0,0.12)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28, paddingBottom:20, borderBottom:'3px solid #111' }}>
            <div>
              <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:28, letterSpacing:'0.05em' }}>VIABL<span style={{color:'#84cc16'}}>.</span><span style={{color:'#84cc16',fontSize:'0.7em'}}>CO</span></div>
              <div style={{ fontSize:11, color:'#999', marginTop:2, fontFamily:'monospace', letterSpacing:'0.1em' }}>BUSINESS VIABILITY REPORT · {date.toUpperCase()}</div>
            </div>
            <div style={{ fontSize:10, color:'#bbb', textAlign:'right', fontFamily:'monospace' }}>viabl.co</div>
          </div>

          <div style={{ background:'#f8f8f8', border:'1px solid #e5e5e5', padding:24, display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:20, marginBottom:12 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:9, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#999', marginBottom:8, fontFamily:'monospace' }}>Idea Summary</div>
              <div style={{ fontSize:15, fontWeight:700, lineHeight:1.3, marginBottom:8 }}>{report.ideaSummary}</div>
              <div style={{ fontSize:12, color:'#666', lineHeight:1.7, fontStyle:'italic' }}>"{report.oneLiner}"</div>
            </div>
            <div style={{ textAlign:'center', flexShrink:0, minWidth:110 }}>
              <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:58, lineHeight:1, color:sCol }}>{report.score}</div>
              <div style={{ fontSize:9, color:'#aaa', letterSpacing:'0.15em', textTransform:'uppercase', marginTop:2, fontFamily:'monospace' }}>Score</div>
              <div style={{ display:'inline-block', background:vBg, color:'#fff', fontSize:11, fontWeight:700, letterSpacing:'0.12em', fontFamily:'Bebas Neue,sans-serif', padding:'3px 14px', marginTop:8 }}>{report.verdict}</div>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
            {[['Market Size',report.marketSize],['Demand Signal',report.demandSignal]].map(([l,c])=>(
              <div key={l} style={{ background:'#f8f8f8', border:'1px solid #e5e5e5', padding:16 }}>
                <div style={{ fontSize:9, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#aaa', marginBottom:7, fontFamily:'monospace' }}>{l}</div>
                <div style={{ fontSize:12, lineHeight:1.7, color:'#444' }}>{c}</div>
              </div>
            ))}
          </div>

          <div style={{ background:'#f8f8f8', border:'1px solid #e5e5e5', padding:16, marginBottom:10 }}>
            <div style={{ fontSize:9, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#aaa', marginBottom:7, fontFamily:'monospace' }}>Competitive Landscape</div>
            <div style={{ fontSize:12, lineHeight:1.7, color:'#444' }}>{report.competition}</div>
          </div>

          <div style={{ background:'#f8f8f8', border:'1px solid #e5e5e5', padding:16, marginBottom:10 }}>
            <div style={{ fontSize:9, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#aaa', marginBottom:12, fontFamily:'monospace' }}>Analysis Metrics</div>
            {Object.entries(report.metrics||{}).map(([key,val])=>{
              const d=key==='Competition'?100-val:val
              const c=d>=70?'#16a34a':d>=45?'#d97706':'#dc2626'
              return (
                <div key={key} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:9 }}>
                  <div style={{ fontSize:10, color:'#777', width:145, flexShrink:0, fontFamily:'monospace' }}>{key}</div>
                  <div style={{ flex:1, height:5, background:'#e5e5e5', borderRadius:2 }}>
                    <div style={{ height:'100%', width:`${d}%`, background:c, borderRadius:2 }} />
                  </div>
                  <div style={{ fontSize:10, color:c, fontWeight:700, width:26, textAlign:'right', fontFamily:'monospace' }}>{d}</div>
                </div>
              )
            })}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
            <div style={{ background:'#f8f8f8', border:'1px solid #e5e5e5', padding:16 }}>
              <div style={{ fontSize:9, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#aaa', marginBottom:8, fontFamily:'monospace' }}>Revenue Models</div>
              <div style={{ marginBottom:10 }}>{(report.revenueModels||[]).map(m=><span key={m} style={{ display:'inline-block', background:'#ebebeb', color:'#333', fontSize:10, padding:'2px 8px', margin:'2px 2px 2px 0', fontFamily:'monospace' }}>{m}</span>)}</div>
              <div style={{ fontSize:9, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#aaa', marginBottom:7, marginTop:12, fontFamily:'monospace' }}>MRR Potential</div>
              <div style={{ fontSize:12, lineHeight:1.7, color:'#444' }}>{report.estimatedMRRPotential}</div>
            </div>
            <div style={{ background:'#f8f8f8', border:'1px solid #e5e5e5', padding:16 }}>
              <div style={{ fontSize:9, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#aaa', marginBottom:10, fontFamily:'monospace' }}>Top Risks</div>
              {(report.topRisks||[]).map((r,i)=>(
                <div key={i} style={{ display:'flex', gap:8, marginBottom:9, fontSize:12, lineHeight:1.6, color:'#444' }}>
                  <div style={{ width:5, height:5, borderRadius:'50%', background:'#f97316', flexShrink:0, marginTop:6 }} />
                  <div>{r}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background:'#f8f8f8', border:'1px solid #e5e5e5', padding:16, marginBottom:24 }}>
            <div style={{ fontSize:9, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#aaa', marginBottom:10, fontFamily:'monospace' }}>Your Next 3 Moves</div>
            {(report.nextSteps||[]).map((s,i)=>(
              <div key={i} style={{ display:'flex', gap:12, padding:'10px 0', borderBottom:i<2?'1px solid #e5e5e5':'none', fontSize:12, lineHeight:1.7, color:'#444' }}>
                <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:16, color:'#84cc16', flexShrink:0, lineHeight:1.4 }}>0{i+1}</div>
                <div>{s}</div>
              </div>
            ))}
          </div>

          <div style={{ paddingTop:14, borderTop:'1px solid #e5e5e5', display:'flex', justifyContent:'space-between', fontSize:10, color:'#ccc', fontFamily:'monospace' }}>
            <div>Generated by Viabl · AI Business Viability Analysis</div>
            <div>Not financial or legal advice · viabl.co</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Viabl() {
  const [idea, setIdea]         = useState('')
  const [industry, setIndustry] = useState('')
  const [target, setTarget]     = useState('')
  const [phase, setPhase]       = useState('input')
  const [activeStep, setActiveStep] = useState(0)
  const [report, setReport]     = useState(null)
  const [errMsg, setErrMsg]     = useState('')
  const [email, setEmail]       = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [subscribeLoading, setSubscribeLoading] = useState(false)

  useEffect(() => {
    if (phase !== 'loading') return
    let i = 0
    const t = setInterval(() => { i++; setActiveStep(i); if (i >= STEPS.length) clearInterval(t) }, 900)
    return () => clearInterval(t)
  }, [phase])

  async function analyze() {
    if (!idea.trim() || idea.trim().length < 20) { setErrMsg('Please describe your idea in more detail.'); return }
    setErrMsg(''); setPhase('loading'); setActiveStep(0)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, industry, target }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setReport(data); setPhase('report')
    } catch(e) { setPhase('error') }
  }

  async function handleCheckout() {
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report, email }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch(e) { alert('Something went wrong. Please try again.') }
    setCheckoutLoading(false)
  }

  async function handleSubscribe() {
    if (!email || !email.includes('@')) return
    setSubscribeLoading(true)
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setEmailSent(true)
    } catch(e) {}
    setSubscribeLoading(false)
  }

  function reset() { setPhase('input'); setReport(null); setIdea(''); setIndustry(''); setTarget(''); setEmailSent(false) }

  const sColor = report ? (report.score>=70?'var(--accent)':report.score>=45?'var(--yellow)':'var(--red)') : '#fff'
  const vBg    = report ? (report.verdict==='GO'?'#16a34a':report.verdict==='MAYBE'?'#d97706':'#dc2626') : '#fff'

  if (phase === 'print') return <PrintView report={report} onBack={() => setPhase('report')} />

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh', paddingBottom:64 }}>
      <style>{CSS}</style>

      {/* NAV */}
      <nav style={{ borderBottom:'1px solid var(--border)', padding:'16px 32px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div className="logo" style={{ fontSize:'1.5rem' }}>viabl<span style={{color:'#d4ff00'}}>.</span><span style={{color:'#d4ff00',fontSize:'0.65em'}}>co</span></div>
        <div className="mono" style={{ fontSize:9, color:'var(--muted)', letterSpacing:'0.15em', textTransform:'uppercase' }}>AI Viability Analysis</div>
      </nav>

      {/* HERO */}
      <div style={{ maxWidth:760, margin:'0 auto', padding:'64px 32px 48px', textAlign:'center' }}>
        <div className="logo hero-logo" style={{ fontSize:'clamp(3.5rem,10vw,6.5rem)', marginBottom:16 }}>
          viabl<span style={{color:'#d4ff00'}}>.</span><span style={{color:'#d4ff00',fontSize:'0.55em',verticalAlign:'baseline'}}>co</span>
        </div>
        <div style={{ fontSize:'clamp(0.95rem,2vw,1.1rem)', color:'#555', lineHeight:1.7, maxWidth:460, margin:'0 auto 16px' }}>
          Describe your business idea. Get a full AI viability report in 60 seconds.
        </div>
        <div style={{ display:'flex', justifyContent:'center', gap:24, flexWrap:'wrap' }}>
          {['Market Size','Competition','Revenue Model','Go/No-Go Score'].map((l,i)=>(
            <div key={i} className="mono" style={{ fontSize:9, color:'var(--muted)', letterSpacing:'0.15em', textTransform:'uppercase' }}>
              <span style={{color:'var(--accent)'}}>✓</span> {l}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:760, margin:'0 auto', padding:'0 32px' }}>

        {/* INPUT */}
        {phase === 'input' && (
          <div>
            <div style={{ height:2, background:'linear-gradient(90deg, var(--accent), transparent)', marginBottom:3 }} />
            <div className="card" style={{ padding:32 }}>
              <div className="section-label">Your business idea</div>
              <textarea value={idea} onChange={e=>setIdea(e.target.value)}
                placeholder="e.g. A subscription app that helps restaurant owners track permits and licenses and sends automated reminders before they expire..."
                style={{ borderColor: idea.length>0?'var(--accent)':'var(--border2)' }} />
              <div className="grid2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginTop:14 }}>
                <div>
                  <div className="section-label" style={{ marginBottom:8 }}>Industry</div>
                  <select value={industry} onChange={e=>setIndustry(e.target.value)} style={{ color:industry?'var(--text)':'var(--muted)' }}>
                    <option value="">Select industry...</option>
                    {INDUSTRIES.map(i=><option key={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <div className="section-label" style={{ marginBottom:8 }}>Target customer</div>
                  <input type="text" value={target} onChange={e=>setTarget(e.target.value)} placeholder="e.g. Restaurant owners, SMEs..." />
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:16, marginTop:24, flexWrap:'wrap' }}>
                <button className="btn-primary" onClick={analyze}>Run Viabl Check →</button>
                <div className="mono" style={{ fontSize:10, color:'var(--muted)', lineHeight:1.6 }}>
                  <span style={{color:'var(--accent)'}}>Free preview</span> · 60 seconds · No signup
                </div>
              </div>
              {errMsg && <div style={{ background:'rgba(239,68,68,0.07)', border:'1px solid #ef4444', color:'#f87171', padding:'12px 16px', fontFamily:'DM Mono,monospace', fontSize:12, marginTop:16 }}>{errMsg}</div>}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', border:'1px solid var(--border)', borderTop:'none', marginBottom:48 }}>
              {[['60s','Report time'],['12','Data points'],['GO / MAYBE / NO','Verdict']].map(([n,l],i)=>(
                <div key={i} style={{ padding:'20px 24px', textAlign:'center', borderRight:i<2?'1px solid var(--border)':'none' }}>
                  <div className="bebas" style={{ fontSize:'1.8rem', color:'var(--accent)', lineHeight:1 }}>{n}</div>
                  <div className="mono" style={{ fontSize:9, color:'var(--muted)', letterSpacing:'0.15em', textTransform:'uppercase', marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LOADING */}
        {phase === 'loading' && (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <div className="loader-bar" style={{ marginBottom:32 }} />
            <div className="bebas" style={{ fontSize:'1.8rem', letterSpacing:'0.1em', color:'var(--muted)', marginBottom:28 }}>
              Running Analysis<span style={{color:'var(--accent)'}}>...</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10, alignItems:'center' }}>
              {STEPS.map((s,i)=>(
                <div key={i} className="mono" style={{ fontSize:11, color:i<activeStep?'var(--accent)':'var(--border2)', transition:'color 0.4s' }}>
                  <span style={{marginRight:8}}>{i<activeStep?'✓':'—'}</span>{s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ERROR */}
        {phase === 'error' && (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <div className="mono" style={{ color:'var(--red)', marginBottom:20, fontSize:13 }}>Analysis failed. Please try again.</div>
            <button className="btn-ghost" onClick={()=>setPhase('input')}>← Try Again</button>
          </div>
        )}

        {/* REPORT */}
        {phase === 'report' && report && (
          <div>
            <div style={{ height:2, background:'linear-gradient(90deg, var(--accent), transparent)', marginBottom:3 }} />

            {/* Score header */}
            <div className="card reveal d1 score-row" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:24, flexWrap:'wrap', padding:32 }}>
              <div style={{ flex:1 }}>
                <div className="section-label">Viabl Report</div>
                <div style={{ fontSize:'1.2rem', fontWeight:700, lineHeight:1.25, marginBottom:12 }}>{report.ideaSummary}</div>
                <div className="mono" style={{ fontSize:11, color:'var(--muted)', lineHeight:1.7, borderLeft:'2px solid var(--accent)', paddingLeft:12 }}>{report.oneLiner}</div>
              </div>
              <div style={{ textAlign:'center', flexShrink:0 }}>
                <div className="bebas" style={{ fontSize:'5rem', lineHeight:1, color:sColor }}>{report.score}</div>
                <div className="mono" style={{ fontSize:9, color:'var(--muted)', letterSpacing:'0.2em', textTransform:'uppercase', marginTop:4 }}>Viability Score</div>
                <div className="bebas" style={{ display:'inline-block', background:vBg, color:'#fff', fontSize:13, letterSpacing:'0.15em', padding:'4px 14px', marginTop:8 }}>{report.verdict}</div>
              </div>
            </div>

            <div className="grid2 reveal d2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:3, marginBottom:3 }}>
              {[['Market Size',report.marketSize],['Demand Signal',report.demandSignal]].map(([label,content])=>(
                <div key={label} className="card">
                  <div className="section-label">{label}</div>
                  <div style={{ fontSize:13, lineHeight:1.75, color:'#999' }}>{content}</div>
                </div>
              ))}
            </div>

            <div className="card reveal d3">
              <div className="section-label">Competitive Landscape</div>
              <div style={{ fontSize:13, lineHeight:1.75, color:'#999' }}>{report.competition}</div>
            </div>

            <div className="card reveal d4">
              <div className="section-label">Analysis Metrics</div>
              {Object.entries(report.metrics||{}).map(([k,v])=><Meter key={k} label={k} value={v} isCompetition={k==='Competition'} />)}
            </div>

            <div className="grid2 reveal d5" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:3, marginBottom:3 }}>
              <div className="card">
                <div className="section-label">Revenue Models</div>
                <div style={{ marginBottom:14 }}>{(report.revenueModels||[]).map(m=><span key={m} className="model-tag">{m}</span>)}</div>
                <div className="section-label" style={{ marginTop:16 }}>MRR Potential</div>
                <div style={{ fontSize:13, lineHeight:1.75, color:'#999' }}>{report.estimatedMRRPotential}</div>
              </div>
              <div className="card">
                <div className="section-label">Top Risks</div>
                {(report.topRisks||[]).map((r,i)=>(
                  <div key={i} style={{ display:'flex', gap:10, marginBottom:10, fontSize:13, lineHeight:1.65, color:'#888' }}>
                    <div style={{ width:5, height:5, borderRadius:'50%', background:'var(--orange)', flexShrink:0, marginTop:7 }} />
                    <div>{r}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card reveal d6">
              <div className="section-label">Your Next 3 Moves</div>
              {(report.nextSteps||[]).map((step,i)=>(
                <div key={i} style={{ display:'flex', gap:16, padding:'14px 0', borderBottom:i<2?'1px solid var(--border)':'none', alignItems:'flex-start' }}>
                  <div className="bebas" style={{ fontSize:'1.2rem', color:'var(--accent)', flexShrink:0, lineHeight:1.4 }}>0{i+1}</div>
                  <div style={{ fontSize:13, lineHeight:1.7, color:'#999', paddingTop:2 }}>{step}</div>
                </div>
              ))}
            </div>

            {/* PAYWALL — PDF download gated behind $29 */}
            <div className="paywall reveal d7">
              <div className="bebas" style={{ fontSize:'1.6rem', letterSpacing:'0.08em', marginBottom:8 }}>
                Save Your Full Report
              </div>
              <div className="mono" style={{ fontSize:10, color:'var(--muted)', lineHeight:1.7, marginBottom:24 }}>
                Get the complete PDF — shareable, printable, investor-ready · <span style={{color:'var(--accent)'}}>$29 one-time</span>
              </div>

              {/* Email input */}
              <div style={{ display:'flex', gap:0, maxWidth:420, margin:'0 auto 16px' }}>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{ flex:1, borderRight:'none', fontSize:13 }} />
                <button className="btn-stripe" onClick={handleCheckout} disabled={checkoutLoading}>
                  {checkoutLoading ? 'Loading...' : '⬇ Get PDF — $29'}
                </button>
              </div>

              <div className="mono" style={{ fontSize:9, color:'var(--muted)', letterSpacing:'0.1em' }}>
                Secure checkout via Stripe · Instant PDF delivery · No subscription
              </div>

              {/* Free email notify option */}
              {!emailSent ? (
                <div style={{ marginTop:20, paddingTop:20, borderTop:'1px solid var(--border)' }}>
                  <div className="mono" style={{ fontSize:10, color:'var(--muted)', marginBottom:10 }}>
                    Or get free updates when we launch new features →
                  </div>
                  <div style={{ display:'flex', gap:0, maxWidth:320, margin:'0 auto' }}>
                    <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={{ flex:1, borderRight:'none', fontSize:12 }} />
                    <button className="btn-ghost" onClick={handleSubscribe} disabled={subscribeLoading} style={{ whiteSpace:'nowrap', padding:'12px 16px' }}>
                      {subscribeLoading ? '...' : 'Notify me'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mono" style={{ fontSize:10, color:'var(--accent)', marginTop:16 }}>✓ You're on the list</div>
              )}
            </div>

            <div style={{ display:'flex', justifyContent:'center', marginTop:3 }}>
              <button className="btn-ghost" onClick={reset}>← Analyze another idea</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
