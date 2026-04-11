'use client'
import{useState}from'react'
import{useRouter}from'next/navigation'
import{useViablStore}from'@/store/viabl'
import{Navbar}from'@/components/ui/Navbar'
import{IntakeForm}from'@/components/sections/IntakeForm'
import{BUSINESS_MODELS,GEOGRAPHIES,STAGES}from'@/types'
import{cn}from'@/lib/utils'
export default function AnalyzePage(){
  const router=useRouter()
  const{ideaText,industry,target,model,geography,stage,budget,notes,setInput}=useViablStore()
  const[step,setStep]=useState(1)
  const[loading,setLoading]=useState(false)
  const[error,setError]=useState('')
  const LABELS=['Idea','Model','Stage']
  function nextStep(){if(step===1&&ideaText.trim().length<20){setError('Please describe your idea in more detail.');return}setError('');setStep(s=>Math.min(s+1,3));window.scrollTo(0,0)}
  function prevStep(){setError('');setStep(s=>Math.max(s-1,1));window.scrollTo(0,0)}
  async function handleAnalyze(){
    setLoading(true);setError('')
    try{
      const res=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ideaText,industry,target,model,geography,stage,budget,notes})})
      const data=await res.json()
      if(data.error)throw new Error(data.error)
      useViablStore.getState().setAnalysisId(data.analysisId)
      useViablStore.getState().setAnalysisResult(data.result)
      router.push(`/analyzing/${data.analysisId}`)
    }catch(err){setError(err instanceof Error?err.message:'Analysis failed.');setLoading(false)}
  }
  return(<main><Navbar step={step>1?step:undefined}/>
    <div className="fixed top-[53px] left-0 right-0 h-[2px] bg-border z-[199]">
      <div className="h-full bg-acid transition-all duration-500" style={{width:`${(step/3)*100}%`}}/>
    </div>

    {/* Step pills — only show from step 2 onwards */}
    {step>1&&(
      <div className="flex gap-px bg-border border-b border-border sticky top-[55px] z-[100]">
        {LABELS.map((label,i)=>(
          <div key={label} className={cn('flex-1 py-[11px] px-2 font-mono text-[9px] tracking-[0.12em] uppercase text-center transition-all',i+1===step&&'bg-acid text-black',i+1<step&&'bg-s1 text-ok',i+1>step&&'bg-s1 text-muted2')}>
            {i+1<step?'✓ ':`0${i+1} — `}{label}
          </div>
        ))}
      </div>
    )}

    <div className="max-w-[740px] mx-auto px-6 pt-8 pb-32">
      {step===1&&(
        <div>
          <div className="mb-9">
            <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-acid mb-2">Your Idea</div>
            <h2 className="font-bebas text-[44px] leading-[0.95] mb-2.5">TELL US YOUR IDEA</h2>
            <p className="font-mono text-[12px] text-muted1 leading-[1.7]">Describe your idea, industry, and target customer.</p>
          </div>
          <IntakeForm/>
        </div>
      )}
      {step===2&&(
        <div>
          <div className="mb-9"><div className="font-mono text-[9px] tracking-[0.2em] uppercase text-acid mb-2">02 of 03 — Business Model</div><h2 className="font-bebas text-[44px] leading-[0.95] mb-2.5">WHAT SPACE ARE YOU IN?</h2></div>
          <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-muted2 mb-3">Business Model</div>
          <div className="grid grid-cols-2 gap-2 mb-6">{BUSINESS_MODELS.map(({label,desc})=>(<div key={label} onClick={()=>setInput('model',label)} className={cn('border p-3.5 cursor-pointer transition-all',model===label?'border-acid bg-acid/5':'border-border2 bg-s1 hover:border-acid/40')}><div className="font-mono text-[12px] mb-1">{label}</div><div className="font-mono text-[10px] text-muted2">{desc}</div></div>))}</div>
          <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-muted2 mb-3">Target Market</div>
          <div className="flex flex-wrap gap-2">{GEOGRAPHIES.map(geo=>(<button key={geo} onClick={()=>setInput('geography',geo)} className={cn('font-mono text-[11px] px-4 py-2 border transition-all',geography===geo?'bg-acid text-black border-acid':'border-border2 text-muted1 bg-s1 hover:border-acid/40')}>{geo}</button>))}</div>
        </div>
      )}
      {step===3&&(
        <div>
          <div className="mb-9"><div className="font-mono text-[9px] tracking-[0.2em] uppercase text-acid mb-2">03 of 03 — Stage & Resources</div><h2 className="font-bebas text-[44px] leading-[0.95] mb-2.5">WHERE ARE YOU NOW?</h2></div>
          <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-muted2 mb-3">Founder Stage</div>
          <div className="grid grid-cols-2 gap-2 mb-6">{STAGES.map(({icon,name,desc})=>(<div key={name} onClick={()=>setInput('stage',name)} className={cn('border p-4 cursor-pointer transition-all relative',stage===name?'border-acid bg-acid/5':'border-border2 bg-s1 hover:border-acid/40')}>{stage===name&&<span className="absolute top-2.5 right-3 font-mono text-[11px] text-acid">✓</span>}<div className="text-[22px] mb-2">{icon}</div><div className="font-mono text-[12px] mb-1">{name}</div><div className="font-mono text-[10px] text-muted2">{desc}</div></div>))}</div>
          <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-muted2 mb-3">Available Budget</div>
          <div className="bg-s1 border border-border p-5 mb-4">
            <div className="font-bebas text-[52px] text-acid leading-none mb-4">{budget>=250000?'$250,000+':'$'+budget.toLocaleString()}</div>
            <div className="relative h-[2px] bg-border2 mb-3"><div className="h-full bg-acid" style={{width:`${(budget/250000)*100}%`}}/><input type="range" min={0} max={250000} step={5000} value={budget} onChange={e=>setInput('budget',parseInt(e.target.value))} className="absolute inset-y-[-14px] w-full opacity-0 cursor-pointer"/></div>
            <div className="flex justify-between font-mono text-[10px] text-muted2 mb-3"><span>$0</span><span>$250K+</span></div>
            <div className="flex gap-1.5 flex-wrap">{[0,25000,50000,100000,250000].map(v=>(<button key={v} onClick={()=>setInput('budget',v)} className={cn('font-mono text-[10px] px-3 py-1.5 border transition-all',budget===v?'bg-acid text-black border-acid':'border-border2 text-muted2 hover:border-acid/40')}>{v===0?'$0':v===250000?'$250K+':'$'+v/1000+'K'}</button>))}</div>
          </div>
          <div className="bg-acid/4 border border-acid/15 p-4 font-mono text-[12px] text-muted1 leading-[1.9]">
            <span className="text-acid">›</span> <strong className="text-text">{ideaText.substring(0,60)}{ideaText.length>60?'...':''}</strong><br/>
            <span className="text-acid">›</span> Industry: {industry||'—'} · Model: {model||'—'}<br/>
            <span className="text-acid">›</span> Stage: {stage||'—'} · Budget: {budget>=250000?'$250K+':'$'+budget.toLocaleString()}
          </div>
        </div>
      )}
      {error&&<div className="mt-4 bg-danger/7 border border-danger text-red-400 p-3 font-mono text-[12px]">{error}</div>}
    </div>
    <div className="fixed bottom-0 left-0 right-0 px-6 py-3.5 z-[190]" style={{background:'linear-gradient(to top,var(--bg) 65%,transparent)'}}>
      <div className="flex gap-2.5 max-w-[740px] mx-auto">
        {step>1&&<button onClick={prevStep} className="bg-transparent text-muted1 border border-border2 px-4 font-mono text-[10px] cursor-pointer hover:text-text py-3.5 whitespace-nowrap">← Back</button>}
        <button onClick={step<3?nextStep:handleAnalyze} disabled={loading} className="flex-1 bg-acid text-black border-none font-bebas text-[22px] tracking-[0.1em] cursor-pointer hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(212,255,0,0.3)] disabled:opacity-40 disabled:cursor-not-allowed py-4">
          {loading?'Analyzing...':step<3?`NEXT →`:'ANALYZE MY IDEA →'}
        </button>
      </div>
    </div>
  </main>)
}
