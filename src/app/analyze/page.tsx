'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useViablStore } from '@/store/viabl'
import { Navbar } from '@/components/ui/Navbar'
import { IntakeForm } from '@/components/sections/IntakeForm'

const STEPS = [
  { label:'DESCRIBE YOUR IDEA',      sub:'Be specific — better input means sharper analysis.' },
  { label:'BUSINESS MODEL & MARKET', sub:'One model. One market. Shapes the revenue scoring.' },
  { label:'STAGE & CONTEXT',         sub:'Calibrates recommendation depth and resource advice.' },
]

export default function AnalyzePage() {
  const router = useRouter()
  const { ideaText, industry, target, model, geography, stage, budget, notes } = useViablStore()
  const [step,     setStep]     = useState(1)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [mounted,  setMounted]  = useState(false)
  const [charging, setCharging] = useState(false)

  useEffect(() => { window.scrollTo(0,0); setTimeout(() => setMounted(true), 60) }, [])

  function nextStep() {
    if (step === 1 && ideaText.trim().length < 20) { setError('Please describe your idea in more detail.'); return }
    setError(''); setStep(s => Math.min(s+1,3)); window.scrollTo({ top:0, behavior:'smooth' })
  }
  function prevStep() { setError(''); setStep(s => Math.max(s-1,1)); window.scrollTo({ top:0, behavior:'smooth' }) }

  async function handleAnalyze() {
    setCharging(true); await new Promise(r => setTimeout(r,700)); setCharging(false)
    setLoading(true); setError('')
    try {
      const res  = await fetch('/api/analyze', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ ideaText, industry, target, model, geography, stage, budget, notes }) })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      useViablStore.getState().setAnalysisId(data.analysisId)
      useViablStore.getState().setAnalysisResult(data.result)
      router.push(`/analyzing/${data.analysisId}`)
    } catch(err) { setError(err instanceof Error ? err.message : 'Analysis failed.'); setLoading(false) }
  }

  const cur = STEPS[step-1]

  return (
    <main style={{ minHeight:'100vh', background:'var(--black)' }}>
      <Navbar step={step} totalSteps={3}/>

      {/* Ambient glow */}
      <div style={{ position:'fixed', top:0, left:'50%', transform:'translateX(-50%)', width:'600px', height:'500px', background:'radial-gradient(ellipse,rgba(200,16,46,.07) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 }}/>

      <div style={{ position:'relative', zIndex:1, maxWidth:'720px', margin:'0 auto', padding:'3rem clamp(1.5rem,5vw,3rem) 6rem', opacity:mounted?1:0, transform:mounted?'none':'translateY(16px)', transition:'opacity .5s ease, transform .5s cubic-bezier(.16,1,.3,1)' }}>

        {/* Step indicator */}
        <div style={{ display:'flex', gap:'4px', marginBottom:'2.5rem' }}>
          {[1,2,3].map(s => (
            <div key={s} onClick={() => s < step && setStep(s)}
              style={{ height:'3px', flex:1, background: s < step ? 'var(--red)' : s === step ? 'var(--white)' : 'rgba(255,255,255,.1)', transition:'background .4s', cursor: s < step ? 'pointer' : 'default', borderRadius:'1px' }}/>
          ))}
        </div>

        {/* Header */}
        <div style={{ marginBottom:'2.8rem' }}>
          <div style={{ fontSize:'.54rem', letterSpacing:'.4em', textTransform:'uppercase', color:'var(--red)', marginBottom:'.8rem' }}>
            Step 0{step} of 03 · {cur.label}
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:'clamp(2rem,5vw,4rem)', lineHeight:1.05, marginBottom:'.6rem' }}>
            {step === 1 && <>Tell us <em style={{ fontStyle:'italic', color:'var(--dim)' }}>what you&apos;re building.</em></>}
            {step === 2 && <>How will you <em style={{ fontStyle:'italic', color:'var(--dim)' }}>make money?</em></>}
            {step === 3 && <>Where <em style={{ fontStyle:'italic', color:'var(--dim)' }}>are you now?</em></>}
          </h1>
          <p style={{ fontSize:'.7rem', color:'var(--dim)', lineHeight:1.85 }}>{cur.sub}</p>
        </div>

        {/* Form */}
        <IntakeForm step={step}/>

        {/* Error */}
        {error && (
          <div style={{ marginTop:'1.4rem', padding:'1rem 1.2rem', borderLeft:'2px solid var(--red)', background:'rgba(200,16,46,.06)', fontSize:'.68rem', color:'var(--red)' }}>
            {error}
          </div>
        )}

        {/* Nav buttons */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'2.5rem', paddingTop:'2rem', borderTop:'1px solid rgba(255,255,255,.07)' }}>
          {step > 1
            ? <button onClick={prevStep} style={{ fontFamily:"'DM Mono',monospace", fontSize:'.62rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--dim)', background:'transparent', border:'1px solid rgba(255,255,255,.1)', padding:'.7rem 1.6rem', cursor:'pointer', transition:'all .2s' }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,.3)';(e.currentTarget as HTMLElement).style.color='var(--white)'}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,.1)';(e.currentTarget as HTMLElement).style.color='var(--dim)'}}>
                ← Back
              </button>
            : <div/>
          }
          {step < 3
            ? <button onClick={nextStep} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:'.88rem', letterSpacing:'.22em', textTransform:'uppercase', color:'var(--white)', background:'var(--red)', border:'none', padding:'1rem 2.6rem', cursor:'pointer', transition:'transform .2s' }}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.transform='translateY(-2px)'}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.transform='none'}>
                Continue →
              </button>
            : <button onClick={handleAnalyze} disabled={loading||charging}
                style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:'.88rem', letterSpacing:'.22em', textTransform:'uppercase', color:'var(--white)', background:'var(--red)', border:'none', padding:'1rem 2.6rem', cursor: loading||charging ? 'not-allowed' : 'pointer', opacity: loading||charging ? .5 : 1, transition:'transform .2s, opacity .2s' }}
                onMouseEnter={e=>{if(!loading&&!charging)(e.currentTarget as HTMLElement).style.transform='translateY(-2px)'}}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.transform='none'}>
                {charging ? 'Initializing...' : loading ? 'Analyzing...' : 'Analyze This Idea →'}
              </button>
          }
        </div>

        {step === 3 && (
          <div style={{ textAlign:'right', marginTop:'.7rem', fontSize:'.57rem', color:'var(--dim)', letterSpacing:'.08em' }}>
            <strong style={{ color:'var(--white)' }}>Free preview</strong> instantly · unlock full report for <strong style={{ color:'var(--white)' }}>$19</strong>
          </div>
        )}
      </div>
    </main>
  )
}
