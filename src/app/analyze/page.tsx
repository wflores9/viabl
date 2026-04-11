'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useViablStore } from '@/store/viabl'
import { Navbar } from '@/components/ui/Navbar'
import { IntakeForm } from '@/components/sections/IntakeForm'
import { BUSINESS_MODELS, GEOGRAPHIES, STAGES } from '@/types'
const LABELS = ['Idea','Model','Stage']
export default function AnalyzePage() {
  const router = useRouter()
  const { ideaText,industry,target,model,geography,stage,budget,notes,setInput } = useViablStore()
  const [step,setStep]=useState(1)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')
  const [mounted,setMounted]=useState(false)
  useEffect(()=>{setTimeout(()=>setMounted(true),50)},[])
  function nextStep(){if(step===1&&ideaText.trim().length<20){setError('Please describe your idea in more detail.');return}setError('');setStep(s=>Math.min(s+1,3));window.scrollTo({top:0,behavior:'smooth'})}
  function prevStep(){setError('');setStep(s=>Math.max(s-1,1));window.scrollTo({top:0,behavior:'smooth'})}
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
  return(
    <main className="relative" style={{zIndex:2,minHeight:'100vh'}}>
      <Navbar step={step} totalSteps={3}/>
      <div className="fixed inset-0 pointer-events-none" style={{backgroundImage:'linear-gradient(rgba(212,255,0,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(212,255,0,0.02) 1px,transparent 1px)',backgroundSize:'80px 80px',WebkitMaskImage:'radial-gradient(ellipse 70% 70% at 50% 30%,black 30%,transparent 100%)',maskImage:'radial-gradient(ellipse 70% 70% at 50% 30%,black 30%,transparent 100%)',zIndex:0}}/>
      <div className="fixed left-0 right-0 z-[199]" style={{top:'64px',height:'2px',background:'var(--border)'}}>
        <div className="h-full transition-all duration-700 ease-out" style={{width:step===1?'33%':step===2?'66%':'100%',background:'var(--acid)',boxShadow:'0 0 12px rgba(212,255,0,0.5)'}}/>
      </div>
      {step>1&&(
        <div className="flex gap-px border-b sticky z-[100]" style={{top:'66px',background:'var(--border)',borderColor:'var(--border)'}}>
          {LABELS.map((label,i)=>(
            <div key={label} className="flex-1 py-3 px-2 font-mono text-[9px] tracking-[0.14em] uppercase text-center transition-all duration-300"
              style={{background:i+1===step?'var(--acid)':'var(--s1)',color:i+1===step?'#000':i+1<step?'var(--ok)':'var(--m2)'}}>
              {i+1<step?'✓ ':`0${i+1} — `}{label}
            </div>
          ))}
        </div>
      )}
      <div className="relative max-w-[800px] mx-auto px-6 pb-36" style={{paddingTop:'48px',zIndex:1}}>
        {step===1&&(
          <div className="transition-all duration-500" style={{opacity:mounted?1:0,transform:mounted?'none':'translateY(24px)'}}>
            <div className="mb-10">
              <div className="font-mono text-[9px] tracking-[0.24em] uppercase mb-3" style={{color:'var(--acid)'}}>Step 01 — Your Idea</div>
              <h1 className="font-bebas leading-[0.9] mb-4" style={{fontSize:'clamp(56px,8vw,96px)',letterSpacing:'0.01em'}}>
                TELL US YOUR<br/><span style={{color:'var(--acid)',textShadow:'0 0 40px rgba(212,255,0,0.2)'}}>IDEA</span>
              </h1>
              <p className="font-mono text-[13px] leading-[1.85]" style={{color:'var(--m1)',maxWidth:'480px'}}>Describe your business idea, industry, and who you're building for. Be specific — better input = sharper analysis.</p>
            </div>
            <IntakeForm/>
          </div>
        )}
        {step===2&&(
          <div className="transition-all duration-500" style={{opacity:mounted?1:0,transform:mounted?'none':'translateY(24px)'}}>
            <div className="mb-10">
              <div className="font-mono text-[9px] tracking-[0.24em] uppercase mb-3" style={{color:'var(--acid)'}}>Step 02 — Business Model</div>
              <h1 className="font-bebas leading-[0.9] mb-4" style={{fontSize:'clamp(56px,8vw,96px)',letterSpacing:'0.01em'}}>
                WHAT SPACE<br/><span style={{color:'var(--acid)',textShadow:'0 0 40px rgba(212,255,0,0.2)'}}>ARE YOU IN?</span>
              </h1>
              <p className="font-mono text-[13px] leading-[1.85]" style={{color:'var(--m1)'}}>One model. One market. Shapes how we score your revenue potential.</p>
            </div>
            <div className="accent-line"/>
            <div style={{background:'var(--s1)',border:'1px solid var(--border)',padding:'28px'}}>
              <div className="font-mono text-[9px] tracking-[0.22em] uppercase mb-5" style={{color:'var(--acid)'}}>BUSINESS MODEL</div>
              <div className="grid grid-cols-2 gap-2 mb-8">
                {BUSINESS_MODELS.map(({label,desc},i)=>(
                  <div key={label} onClick={()=>setInput('model',label)} className="relative overflow-hidden cursor-pointer transition-all duration-200"
                    style={{border:`1px solid ${model===label?'var(--acid)':'var(--border2)'}`,background:model===label?'rgba(212,255,0,0.04)':'var(--bg)',padding:'14px 16px'}}>
                    {model===label&&<div className="absolute top-0 left-0 right-0 h-[2px]" style={{background:'var(--acid)',boxShadow:'0 0 8px rgba(212,255,0,0.4)'}}/>}
                    {model===label&&<span className="absolute top-2.5 right-3 font-mono text-[11px]" style={{color:'var(--acid)'}}>✓</span>}
                    <div className="font-mono text-[12px] mb-1" style={{color:'var(--text)'}}>{label}</div>
                    <div className="font-mono text-[10px]" style={{color:'var(--m2)'}}>{desc}</div>
                  </div>
                ))}
              </div>
              <div className="font-mono text-[9px] tracking-[0.22em] uppercase mb-4" style={{color:'var(--m2)'}}>TARGET MARKET</div>
              <div className="flex flex-wrap gap-2">
                {GEOGRAPHIES.map(geo=>(
                  <button key={geo} onClick={()=>setInput('geography',geo)} className="font-mono text-[11px] px-4 py-2 border transition-all duration-200"
                    style={{borderColor:geography===geo?'var(--acid)':'var(--border2)',background:geography===geo?'var(--acid)':'transparent',color:geography===geo?'#000':'var(--m1)',boxShadow:geography===geo?'0 0 12px rgba(212,255,0,0.2)':'none'}}>
                    {geo}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {step===3&&(
          <div className="transition-all duration-500" style={{opacity:mounted?1:0,transform:mounted?'none':'translateY(24px)'}}>
            <div className="mb-10">
              <div className="font-mono text-[9px] tracking-[0.24em] uppercase mb-3" style={{color:'var(--acid)'}}>Step 03 — Stage & Resources</div>
              <h1 className="font-bebas leading-[0.9] mb-4" style={{fontSize:'clamp(56px,8vw,96px)',letterSpacing:'0.01em'}}>
                WHERE ARE<br/><span style={{color:'var(--acid)',textShadow:'0 0 40px rgba(212,255,0,0.2)'}}>YOU NOW?</span>
              </h1>
              <p className="font-mono text-[13px] leading-[1.85]" style={{color:'var(--m1)'}}>Shapes recommendation depth and resource allocation advice.</p>
            </div>
            <div className="accent-line"/>
            <div style={{background:'var(--s1)',border:'1px solid var(--border)',padding:'28px'}}>
              <div className="font-mono text-[9px] tracking-[0.22em] uppercase mb-5" style={{color:'var(--acid)'}}>FOUNDER STAGE</div>
              <div className="grid grid-cols-2 gap-2 mb-8">
                {STAGES.map(({icon,name,desc},i)=>(
                  <div key={name} onClick={()=>setInput('stage',name)} className="relative overflow-hidden cursor-pointer transition-all duration-200"
                    style={{border:`1px solid ${stage===name?'var(--acid)':'var(--border2)'}`,background:stage===name?'rgba(212,255,0,0.04)':'var(--bg)',padding:'16px'}}>
                    {stage===name&&<div className="absolute top-0 left-0 right-0 h-[2px]" style={{background:'var(--acid)',boxShadow:'0 0 8px rgba(212,255,0,0.4)'}}/>}
                    {stage===name&&<span className="absolute top-2.5 right-3 font-mono text-[11px]" style={{color:'var(--acid)'}}>✓</span>}
                    <div className="text-[20px] mb-2">{icon}</div>
                    <div className="font-mono text-[12px] mb-1" style={{color:'var(--text)'}}>{name}</div>
                    <div className="font-mono text-[10px]" style={{color:'var(--m2)'}}>{desc}</div>
                  </div>
                ))}
              </div>
              <div className="font-mono text-[9px] tracking-[0.22em] uppercase mb-4" style={{color:'var(--m2)'}}>AVAILABLE BUDGET</div>
              <div style={{border:'1px solid var(--border)',padding:'20px',background:'var(--bg)',marginBottom:'16px'}}>
                <div className="font-bebas leading-none mb-4" style={{fontSize:'60px',color:'var(--acid)',textShadow:'0 0 30px rgba(212,255,0,0.3)'}}>
                  {budget>=250000?'$250,000+':'$'+budget.toLocaleString()}
                </div>
                <div className="relative h-[2px] mb-4" style={{background:'var(--border2)'}}>
                  <div className="absolute left-0 top-0 h-full transition-all duration-300" style={{width:`${(budget/250000)*100}%`,background:'var(--acid)',boxShadow:'0 0 8px rgba(212,255,0,0.4)'}}/>
                  <input type="range" min={0} max={250000} step={5000} value={budget} onChange={e=>setInput('budget',parseInt(e.target.value))} className="absolute w-full opacity-0 cursor-pointer" style={{inset:'-12px 0',height:'24px'}}/>
                </div>
                <div className="flex justify-between font-mono text-[10px] mb-4" style={{color:'var(--m2)'}}><span>$0</span><span>$250K+</span></div>
                <div className="flex gap-1.5 flex-wrap">
                  {[0,25000,50000,100000,250000].map(v=>(
                    <button key={v} onClick={()=>setInput('budget',v)} className="font-mono text-[10px] px-3 py-1.5 border transition-all duration-150"
                      style={{borderColor:budget===v?'var(--acid)':'var(--border2)',background:budget===v?'var(--acid)':'transparent',color:budget===v?'#000':'var(--m2)'}}>
                      {v===0?'$0':v===250000?'$250K+':'$'+v/1000+'K'}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{border:'1px solid rgba(212,255,0,0.1)',padding:'16px',background:'rgba(212,255,0,0.02)'}}>
                <div className="font-mono text-[9px] tracking-[0.18em] uppercase mb-3" style={{color:'var(--m2)'}}>Analysis Preview</div>
                <div className="font-mono text-[12px] leading-[1.9]" style={{color:'var(--m1)'}}>
                  <div><span style={{color:'var(--acid)'}}>›</span> <strong style={{color:'var(--text)'}}>{ideaText.substring(0,65)}{ideaText.length>65?'...':''}</strong></div>
                  <div><span style={{color:'var(--acid)'}}>›</span> {industry||'—'} · {model||'—'} · {geography}</div>
                  <div><span style={{color:'var(--acid)'}}>›</span> {stage||'—'} · {budget>=250000?'$250K+':'$'+budget.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        )}
        {error&&<div className="mt-4 border p-4 font-mono text-[12px]" style={{background:'rgba(239,68,68,0.07)',borderColor:'var(--danger)',color:'#f87171'}}>{error}</div>}
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-[190] px-6 py-5" style={{background:'linear-gradient(to top,var(--bg) 55%,rgba(14,12,10,0) 100%)'}}>
        <div className="flex gap-3 max-w-[800px] mx-auto">
          {step>1&&<button onClick={prevStep} className="font-mono text-[11px] px-6 py-4 border transition-all duration-200" style={{background:'transparent',color:'var(--m1)',borderColor:'var(--border2)',whiteSpace:'nowrap'}}>← Back</button>}
          <button onClick={step<3?nextStep:handleAnalyze} disabled={loading} className="btn-acid flex-1 font-bebas tracking-[0.12em] py-4" style={{fontSize:'22px'}}>
            {loading?(
              <span className="flex items-center justify-center gap-3">
                <span className="inline-block w-4 h-4 border-2 rounded-full" style={{borderColor:'transparent',borderTopColor:'#000',animation:'spin 1s linear infinite'}}/>
                Analyzing...
              </span>
            ):step<3?'NEXT STEP →':'ANALYZE MY IDEA →'}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </main>
  )
}
