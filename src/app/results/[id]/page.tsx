'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/ui/Navbar'
import { useViablStore } from '@/store/viabl'
import { TIERS } from '@/types'
import type { AnalysisResult, Tier } from '@/types'

const SAMPLE: AnalysisResult = {
  overall_score:78, verdict:'GO',
  idea_summary:'Permit & License SaaS for Restaurants',
  one_liner:'"Compliance automation for food operators who cannot afford to get shut down"',
  summary:'Large underserved market with acute pain and high willingness to pay. Low direct competition in SMB segment.',
  market_size:'Large and underserved. 1M+ US restaurants each managing 8-15 permits annually. Compliance software market $4.2B growing 12% YoY.',
  demand_signal:'Strong. 60% of closures involve compliance issues. Shutdown costs average $15K-$50K. Pain directly tied to revenue loss.',
  competition:'Fragmented. Toast and Square touch adjacent problems. Specialized players target enterprise. SMB segment is wide open.',
  metrics:{'Market Demand':85,'Competition':35,'Revenue Potential':80,'Execution Risk':52,'Moat / Edge':70,'Customer Acquisition':65,'Regulatory':40,'Tech Feasibility':82,'Founder-Market Fit':68},
  revenue_models:['SaaS Subscription','Per-location pricing','Annual plans','Add-on services'],
  mrr_potential:'$49-$149/mo per location. At 500 locations, $25K-$75K MRR.',
  top_risks:['Data sourcing — permit databases vary by municipality. 18-month engineering project.','Restaurant tech adoption is low. Long sales cycles, high CS overhead.','Toast or Square could build this as a free feature.'],
  next_steps:["Cold email 20 restaurant owners. Ask how they track permits. Don't pitch software.","Build a free Permit Expiry Calculator landing page. Collect emails.","Partner with a restaurant accountant. Rev-share gets you 50 customers fast."],
  dimensions:[], recommendations:{ gtm:[], tools:[], first_30_days:[] }
}

function MeterBar({ label, value, isRisk }: { label:string; value:number; isRisk?:boolean }) {
  const [w, setW] = useState(0)
  useEffect(() => { setTimeout(() => setW(value), 100) }, [value])
  const color = isRisk ? (value>60?'var(--red)':'#3DAA6A') : (value>=70?'#3DAA6A':value>=45?'var(--gold)':'var(--red)')
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'10px' }}>
      <div style={{ fontFamily:'var(--font-dm-mono),monospace', fontSize:'.82rem', color:'var(--dim)', width:'150px', flexShrink:0 }}>{label}</div>
      <div style={{ flex:1, height:'2px', background:'rgba(255,255,255,.07)' }}>
        <div style={{ height:'100%', width:`${w}%`, background:color, transition:'width 1.2s cubic-bezier(.16,1,.3,1)' }}/>
      </div>
      <div style={{ fontFamily:'var(--font-dm-mono),monospace', fontSize:'.82rem', color, width:'28px', textAlign:'right' }}>{value}</div>
    </div>
  )
}

export default function ResultsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { analysisResult, setSelectedTier } = useViablStore()
  const r = analysisResult || SAMPLE
  const isGo    = r.verdict === 'GO'
  const isMaybe = r.verdict === 'MAYBE'
  const verdictColor = isGo ? '#3DAA6A' : isMaybe ? 'var(--gold)' : 'var(--red)'
  const verdictLabel = isGo ? 'STRONG GO' : isMaybe ? 'VIABLE WITH CONDITIONS' : 'HIGH RISK'

  async function handleSelectTier(tier: Tier) {
    if (tier === 'free') return
    setSelectedTier(tier)
    const res  = await fetch('/api/checkout', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ analysisId: params.id, tier }) })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  return (
    <main style={{ minHeight:'100vh', background:'var(--black)' }}>
      <Navbar step={4} totalSteps={4}/>
      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'3rem clamp(1.5rem,5vw,3rem) 6rem' }}>

        {/* Top header */}
        <div style={{ height:'2px', background:'linear-gradient(90deg,var(--red),rgba(200,16,46,.1) 60%,transparent)', marginBottom:'1px' }}/>
        <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'1px', background:'rgba(255,255,255,.05)', marginBottom:'1px' }}>
          {/* Score + summary */}
          <div style={{ background:'var(--surface)', padding:'2.5rem 2.5rem 2.5rem 3rem', position:'relative' }}>
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'3px', background:'var(--red)' }}/>
            <div style={{ display:'flex', gap:'2rem', alignItems:'flex-start', flexWrap:'wrap' }}>
              <span style={{ fontFamily:'var(--font-playfair),serif', fontSize:'clamp(5rem,10vw,9rem)', fontWeight:900, lineHeight:1, color:verdictColor, flexShrink:0 }}>{r.overall_score}</span>
              <div style={{ flex:1, minWidth:'200px' }}>
                <div style={{ fontFamily:'var(--font-playfair),serif', fontSize:'clamp(1.5rem,3vw,2.5rem)', fontWeight:900, lineHeight:1.1, marginBottom:'1rem' }}>{verdictLabel}</div>
                <p style={{ fontSize:'.92rem', color:'var(--dim)', lineHeight:1.85, maxWidth:'480px' }}>{r.summary}</p>
                <div style={{ display:'inline-block', fontFamily:'var(--font-barlow),sans-serif', fontWeight:700, fontSize:'1rem', letterSpacing:'.25em', padding:'.4rem 1rem', marginTop:'1rem', background:verdictColor, color:'#fff', textTransform:'uppercase' }}>{r.verdict}</div>
              </div>
            </div>
          </div>
          {/* Meta */}
          <div style={{ background:'var(--surface)', padding:'2rem 1.8rem', minWidth:'180px' }}>
            {[['ID',`#${params.id.substring(0,8).toUpperCase()}`],['Score',`${r.overall_score}/100`],['Verdict',r.verdict]].map(([k,v]) => (
              <div key={k} style={{ marginBottom:'1rem' }}>
                <div style={{ fontSize:'.75rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--dim)', marginBottom:'3px' }}>{k}</div>
                <div style={{ fontFamily:'var(--font-dm-mono),monospace', fontSize:'.92rem', color: k==='Score'?verdictColor:'var(--white)' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Market + Demand */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1px', background:'rgba(255,255,255,.05)', marginBottom:'1px' }}>
          {[['Market Size', r.market_size],['Demand Signal', r.demand_signal]].map(([title,body]) => (
            <div key={title} style={{ background:'var(--surface)', padding:'1.8rem' }}>
              <div style={{ fontSize:'.75rem', letterSpacing:'.28em', textTransform:'uppercase', color:'var(--red)', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'.6rem' }}>
                <span style={{ display:'block', width:'20px', height:'1px', background:'var(--red)' }}/>{title}
              </div>
              <p style={{ fontSize:'.92rem', color:'var(--dim)', lineHeight:1.8 }}>{body}</p>
            </div>
          ))}
        </div>

        {/* Competition */}
        <div style={{ background:'var(--surface)', padding:'1.8rem', border:'1px solid rgba(255,255,255,.05)', marginBottom:'1px' }}>
          <div style={{ fontSize:'.75rem', letterSpacing:'.28em', textTransform:'uppercase', color:'var(--red)', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'.6rem' }}>
            <span style={{ display:'block', width:'20px', height:'1px', background:'var(--red)' }}/>Competitive Landscape
          </div>
          <p style={{ fontSize:'.92rem', color:'var(--dim)', lineHeight:1.8 }}>{r.competition}</p>
        </div>

        {/* Metrics */}
        <div style={{ background:'var(--surface)', padding:'1.8rem', border:'1px solid rgba(255,255,255,.05)', marginBottom:'1px' }}>
          <div style={{ fontSize:'.75rem', letterSpacing:'.28em', textTransform:'uppercase', color:'var(--red)', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'.6rem' }}>
            <span style={{ display:'block', width:'20px', height:'1px', background:'var(--red)' }}/>Analysis Metrics
          </div>
          {Object.entries(r.metrics).map(([k,v]) => (
            <MeterBar key={k} label={k} value={v} isRisk={k==='Execution Risk'||k==='Regulatory'}/>
          ))}
        </div>

        {/* Revenue + Risks */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1px', background:'rgba(255,255,255,.05)', marginBottom:'1px' }}>
          <div style={{ background:'var(--surface)', padding:'1.8rem' }}>
            <div style={{ fontSize:'.75rem', letterSpacing:'.28em', textTransform:'uppercase', color:'var(--red)', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'.6rem' }}>
              <span style={{ display:'block', width:'20px', height:'1px', background:'var(--red)' }}/>Revenue Models
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem', marginBottom:'1.4rem' }}>
              {r.revenue_models.map(m => (
                <span key={m} style={{ fontFamily:'var(--font-barlow),sans-serif', fontWeight:600, fontSize:'.92rem', letterSpacing:'.08em', textTransform:'uppercase', padding:'.3rem .8rem', border:'1px solid rgba(255,255,255,.1)', color:'var(--white)' }}>{m}</span>
              ))}
            </div>
            <div style={{ fontSize:'.75rem', letterSpacing:'.28em', textTransform:'uppercase', color:'var(--red)', marginBottom:'.6rem', display:'flex', alignItems:'center', gap:'.6rem' }}>
              <span style={{ display:'block', width:'20px', height:'1px', background:'var(--red)' }}/>MRR Potential
            </div>
            <p style={{ fontSize:'.92rem', color:'var(--dim)', lineHeight:1.8 }}>{r.mrr_potential}</p>
          </div>
          <div style={{ background:'var(--surface)', padding:'1.8rem' }}>
            <div style={{ fontSize:'.75rem', letterSpacing:'.28em', textTransform:'uppercase', color:'var(--red)', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'.6rem' }}>
              <span style={{ display:'block', width:'20px', height:'1px', background:'var(--red)' }}/>Top Risks
            </div>
            {r.top_risks.map((risk,i) => (
              <div key={i} style={{ display:'flex', gap:'.8rem', marginBottom:'.9rem', fontSize:'.92rem', color:'var(--dim)', lineHeight:1.65 }}>
                <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'var(--gold)', flexShrink:0, marginTop:'7px' }}/>
                <div>{risk}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Next 3 Moves */}
        <div style={{ background:'var(--surface)', padding:'1.8rem', border:'1px solid rgba(255,255,255,.05)', marginBottom:'1px' }}>
          <div style={{ fontSize:'.75rem', letterSpacing:'.28em', textTransform:'uppercase', color:'var(--red)', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'.6rem' }}>
            <span style={{ display:'block', width:'20px', height:'1px', background:'var(--red)' }}/>Your Next 3 Moves
          </div>
          {r.next_steps.map((s,i) => (
            <div key={i} style={{ display:'flex', gap:'1.4rem', padding:'1.2rem 0', borderBottom: i<2?'1px solid rgba(255,255,255,.05)':'none', alignItems:'flex-start' }}>
              <div style={{ fontFamily:'var(--font-playfair),serif', fontSize:'2.2rem', fontWeight:900, color:'var(--red)', flexShrink:0, lineHeight:1.3 }}>0{i+1}</div>
              <div style={{ fontFamily:'var(--font-dm-mono),monospace', fontSize:'.92rem', color:'var(--dim)', lineHeight:1.75, paddingTop:'.3rem' }}>{s}</div>
            </div>
          ))}
        </div>

        {/* LOCKED + UNLOCK CTA */}
        <div style={{ position:'relative', marginBottom:'2px' }}>
          {/* Blur preview */}
          <div style={{ filter:'blur(5px)', pointerEvents:'none', userSelect:'none', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1px', background:'rgba(255,255,255,.05)' }}>
            {['GTM Strategy','Brand Identity Kit','Risk Register','Pitch Narrative'].map((t,i) => (
              <div key={i} style={{ background:'var(--surface)', padding:'1.8rem' }}>
                <div style={{ height:'8px', background:'rgba(255,255,255,.06)', width:'40%', marginBottom:'1rem' }}/>
                <div style={{ height:'8px', background:'rgba(255,255,255,.04)', width:'100%', marginBottom:'.6rem' }}/>
                <div style={{ height:'8px', background:'rgba(255,255,255,.04)', width:'85%', marginBottom:'.6rem' }}/>
                <div style={{ height:'8px', background:'rgba(255,255,255,.04)', width:'65%' }}/>
              </div>
            ))}
          </div>
          {/* Unlock overlay */}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,transparent,rgba(5,5,5,.75) 20%,rgba(5,5,5,.97) 35%)', display:'flex', alignItems:'flex-end', justifyContent:'center', paddingBottom:'2.5rem' }}>
            <div style={{ textAlign:'center' }}>
              {/* AI Mascot */}
              <div style={{ marginBottom:'1.2rem', display:'flex', justifyContent:'center' }}>
                <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Body */}
                  <rect x="18" y="28" width="36" height="30" rx="4" fill="#1a1714" stroke="#C8102E" strokeWidth="1.5"/>
                  {/* Head */}
                  <rect x="22" y="12" width="28" height="22" rx="4" fill="#1a1714" stroke="#C8102E" strokeWidth="1.5"/>
                  {/* Eyes */}
                  <rect x="27" y="18" width="7" height="5" rx="1" fill="#C8102E" opacity="0.9"/>
                  <rect x="38" y="18" width="7" height="5" rx="1" fill="#C8102E" opacity="0.9"/>
                  {/* Mouth */}
                  <rect x="29" y="27" width="14" height="2" rx="1" fill="#C8102E" opacity="0.5"/>
                  {/* Antenna */}
                  <line x1="36" y1="12" x2="36" y2="6" stroke="#C8102E" strokeWidth="1.5"/>
                  <circle cx="36" cy="5" r="2.5" fill="#C8102E"/>
                  {/* Circuit lines on body */}
                  <line x1="26" y1="40" x2="46" y2="40" stroke="#C8102E" strokeWidth="1" opacity="0.3"/>
                  <line x1="26" y1="46" x2="38" y2="46" stroke="#C8102E" strokeWidth="1" opacity="0.3"/>
                  <circle cx="46" cy="46" r="2" fill="#C8102E" opacity="0.4"/>
                  {/* Arms */}
                  <rect x="8" y="32" width="10" height="4" rx="2" fill="#1a1714" stroke="#C8102E" strokeWidth="1.5"/>
                  <rect x="54" y="32" width="10" height="4" rx="2" fill="#1a1714" stroke="#C8102E" strokeWidth="1.5"/>
                  {/* Legs */}
                  <rect x="24" y="58" width="8" height="10" rx="2" fill="#1a1714" stroke="#C8102E" strokeWidth="1.5"/>
                  <rect x="40" y="58" width="8" height="10" rx="2" fill="#1a1714" stroke="#C8102E" strokeWidth="1.5"/>
                  {/* Glow effect */}
                  <rect x="22" y="12" width="28" height="22" rx="4" fill="#C8102E" opacity="0.03"/>
                </svg>
              </div>
              <div style={{ fontSize:'.75rem', letterSpacing:'.4em', textTransform:'uppercase', color:'var(--red)', marginBottom:'.8rem' }}>▶ Full Report Locked</div>
              <div style={{ fontFamily:'var(--font-playfair),serif', fontSize:'clamp(1.4rem,3vw,2.5rem)', fontWeight:900, marginBottom:'.5rem' }}>Unlock Everything →</div>
              <p style={{ fontSize:'.88rem', color:'var(--dim)', maxWidth:'420px', margin:'0 auto 1.5rem', lineHeight:1.75 }}>GTM playbook, brand identity kit, risk register, and pitch narrative. Instant delivery.</p>
            </div>
          </div>
        </div>

        {/* Tier cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1px', background:'rgba(255,255,255,.05)' }}>
          {TIERS.map(tier => (
            <div key={tier.id} style={{ background:'var(--surface)', padding:'2rem 1.6rem', position:'relative', border: tier.featured ? '1px solid rgba(200,16,46,.35)' : '1px solid transparent', transition:'border-color .2s' }}>
              {tier.featured && <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'var(--red)' }}/>}
              {tier.featured && <div style={{ fontSize:'.92rem', letterSpacing:'.22em', textTransform:'uppercase', color:'var(--red)', marginBottom:'.8rem' }}>Best Value</div>}
              <div style={{ fontFamily:'var(--font-barlow),sans-serif', fontWeight:800, fontSize:'1.2rem', letterSpacing:'.12em', textTransform:'uppercase', marginBottom:'.5rem' }}>{tier.name}</div>
              <div style={{ fontFamily:'var(--font-playfair),serif', fontSize:'3rem', fontWeight:900, lineHeight:1, marginBottom:'.3rem', color: tier.featured?'var(--white)':'var(--white)' }}>
                ${tier.price}
              </div>
              <div style={{ fontSize:'.82rem', color:'var(--dim)', marginBottom:'1.4rem' }}>{tier.description}</div>
              <div style={{ marginBottom:'1.6rem' }}>
                {tier.items.map(item => (
                  <div key={item} style={{ display:'flex', alignItems:'center', gap:'.5rem', fontSize:'.82rem', color:'var(--dim)', padding:'.25rem 0' }}>
                    <span style={{ color:'#3DAA6A', flexShrink:0 }}>✓</span>{item}
                  </div>
                ))}
              </div>
              <button onClick={() => handleSelectTier(tier.id as Tier)} disabled={tier.id==='free'}
                className={tier.id==='free'?'':'btn-cine'}
                style={{ width:'100%', padding:'.85rem', fontFamily:tier.id==='free'?'var(--font-dm-mono),monospace':'var(--font-barlow),sans-serif', fontWeight:tier.id==='free'?400:700, fontSize:tier.id==='free'?'.65rem':'.82rem', letterSpacing:'.15em', textTransform:'uppercase', cursor:tier.id==='free'?'default':'pointer', background:tier.id==='free'?'transparent':'var(--red)', color:tier.id==='free'?'var(--dim)':'#ffffff', border: tier.id==='free'?'1px solid rgba(255,255,255,.08)':'none', opacity:tier.id==='free'?.6:1 }}>
                {tier.id==='free' ? 'Current Plan' : `Unlock → $${tier.price}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
