'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useViablStore } from '@/store/viabl'
import { Navbar } from '@/components/ui/Navbar'
import { IntakeForm } from '@/components/sections/IntakeForm'
import { BUSINESS_MODELS, GEOGRAPHIES, STAGES } from '@/types'

const LABELS = ['Idea','Model','Stage']
const NODES = [
  {x:'8%', y:'18%',label:'TAM', val:'$4.2B', delay:0},
  {x:'86%',y:'20%',label:'CAC', val:'$120',  delay:0.4},
  {x:'4%', y:'62%',label:'MRR', val:'$25K',  delay:0.8},
  {x:'88%',y:'55%',label:'MOAT',val:'78/100',delay:1.2},
  {x:'12%',y:'82%',label:'LTV', val:'$1,440',delay:1.6},
  {x:'80%',y:'78%',label:'NPS', val:'+62',   delay:2.0},
]

export default function AnalyzePage() {
  const router    = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)
  const {ideaText,industry,target,model,geography,stage,budget,notes,setInput} = useViablStore()
  const [step,     setStep]     = useState(1)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [mounted,  setMounted]  = useState(false)
  const [charging, setCharging] = useState(false)

  useEffect(()=>{ window.scrollTo(0,0); setTimeout(()=>setMounted(true),80) },[])

  useEffect(()=>{
    const canvas = canvasRef.current
    if(!canvas) return
    const ctx = canvas.getContext('2d')
    if(!ctx) return
    canvas.width = window.innerWidth; canvas.height = window.innerHeight
    const pts = Array.from({length:55},()=>({
      x:Math.random()*canvas.width, y:Math.random()*canvas.height,
      vx:(Math.random()-.5)*.28, vy:(Math.random()-.5)*.28,
      r:Math.random()*1.4+.4, o:Math.random()*.35+.08,
    }))
    const draw=()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height)
      pts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy
        if(p.x<0)p.x=canvas.width; if(p.x>canvas.width)p.x=0
        if(p.y<0)p.y=canvas.height; if(p.y>canvas.height)p.y=0
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fillStyle=`rgba(212,255,0,${p.o})`; ctx.fill()
      })
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy)
        if(d<110){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(212,255,0,${.055*(1-d/110)})`;ctx.lineWidth=.5;ctx.stroke()}
      }
      rafRef.current=requestAnimationFrame(draw)
    }
    draw()
    return()=>cancelAnimationFrame(rafRef.current)
  },[])

  function nextStep(){if(step===1&&ideaText.trim().length<20){setError('Please describe your idea in more detail.');return}setError('');setStep(s=>Math.min(s+1,3));window.scrollTo({top:0,behavior:'smooth'})}
  function prevStep(){setError('');setStep(s=>Math.max(s-1,1));window.scrollTo({top:0,behavior:'smooth'})}

  async function handleAnalyze(){
    setCharging(true); await new Promise(r=>setTimeout(r,700)); setCharging(false)
    setLoading(true); setError('')
    try{
      const res=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ideaText,industry,target,model,geography,stage,budget,notes})})
      const data=await res.json()
      if(data.error)throw new Error(data.error)
      useViablStore.getState().setAnalysisId(data.analysisId)
      useViablStore.getState().setAnalysisResult(data.result)
      router.push(`/analyzing/${data.analysisId}`)
    }catch(err){setError(err instanceof Error?err.message:'Analysis failed.');setLoading(false)}
  }

  const heads=[
    {l1:'TELL US YOUR',l2:'IDEA',    sub:'Be specific — better input = sharper analysis.'},
    {l1:'WHAT SPACE',  l2:'ARE YOU IN?',sub:'One model. One market. Shapes revenue scoring.'},
    {l1:'WHERE ARE',   l2:'YOU NOW?',sub:'Shapes recommendation depth and resource advice.'},
  ]
  const h=heads[step-1]

  return(
    <main className="relative" style={{zIndex:2,minHeight:'100vh'}}>
      <Navbar step={step} totalSteps={3}/>

      {/* Particle field */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{zIndex:0,opacity:0.55}}/>

      {/* Dot grid */}
      <div className="fixed inset-0 pointer-events-none" style={{backgroundImage:'radial-gradient(circle,rgba(212,255,0,0.07) 1px,transparent 1px)',backgroundSize:'48px 48px',WebkitMaskImage:'radial-gradient(ellipse 85% 85% at 50% 40%,black 20%,transparent 100%)',maskImage:'radial-gradient(ellipse 85% 85% at 50% 40%,black 20%,transparent 100%)',zIndex:0}}/>

      {/* Floating data nodes — step 1 only */}
      {mounted && NODES.map((n,i)=>(
        <div key={i} className="fixed pointer-events-none"
          style={{left:n.x,top:n.y,zIndex:1,animation:`float ${4+i*.5}s ease-in-out infinite`,animationDelay:`${n.delay}s`,opacity:step===1?.6:0,transition:'opacity 0.5s ease'}}>
          <div style={{background:'rgba(26,23,20,0.85)',border:'1px solid rgba(212,255,0,0.14)',padding:'6px 10px',backdropFilter:'blur(8px)'}}>
            <div className="font-mono" style={{fontSize:'8px',color:'var(--m2)',letterSpacing:'0.14em',textTransform:'uppercase'}}>{n.label}</div>
            <div className="font-bebas" style={{fontSize:'14px',color:'var(--acid)',lineHeight:1.1}}>{n.val}</div>
          </div>
        </div>
      ))}

      {/* Progress bar */}
      <div className="fixed left-0 right-0 z-[199]" style={{top:'64px',height:'2px',background:'var(--border)'}}>
        <div className="h-full transition-all duration-700 ease-out" style={{width:step===1?'33%':step===2?'66%':'100%',background:'var(--acid)',boxShadow:'0 0 16px rgba(212,255,0,0.6)'}}/>
      </div>

      {/* Step pills */}
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

      <div className="relative max-w-[800px] mx-auto px-6 pb-36" style={{paddingTop:'52px',zIndex:2}}>

        {/* Cinematic heading */}
        <div className={`mb-10 transition-all duration-700 ${mounted?'opacity-100 translate-y-0':'opacity-0 translate-y-8'}`}>
          <div className="font-mono text-[9px] tracking-[0.26em] uppercase mb-4 flex items-center gap-3" style={{color:'var(--acid)'}}>
            <span style={{display:'inline-block',width:'20px',height:'1px',background:'var(--acid)'}}/>
            Step 0{step} — {LABELS[step-1]}
            <span style={{display:'inline-block',flex:1,height:'1px',background:'linear-gradient(90deg,var(--border),transparent)'}}/>
          </div>
          <div style={{lineHeight:0.85}}>
            <div className="font-bebas transition-all duration-700" style={{fontSize:'clamp(60px,9vw,110px)',letterSpacing:'0.01em',color:'var(--text)',transitionDelay:'100ms',opacity:mounted?1:0,transform:mounted?'none':'translateY(40px)'}}>
              {h.l1}
            </div>
            <div className="font-bebas transition-all duration-700" style={{fontSize:'clamp(60px,9vw,110px)',letterSpacing:'0.01em',color:'var(--acid)',transitionDelay:'180ms',opacity:mounted?1:0,transform:mounted?'none':'translateY(40px)'}}>
              {h.l2}
            </div>
          </div>
          <p className="font-mono text-[13px] leading-[1.85] mt-4 transition-all duration-700" style={{color:'var(--m1)',maxWidth:'500px',transitionDelay:'260ms',opacity:mounted?1:0,transform:mounted?'none':'translateY(16px)'}}>
            {h.sub}
          </p>
        </div>

        {/* Step 1 */}
        {step===1&&<div className={`transition-all duration-500 ${mounted?'opacity-100 translate-y-0':'opacity-0 translate-y-8'}`} style={{transitionDelay:'300ms'}}><IntakeForm/></div>}

        {/* Step 2 */}
        {step===2&&(
          <div className={`transition-all duration-500 ${mounted?'opacity-100 translate-y-0':'opacity-0 translate-y-8'}`} style={{transitionDelay:'300ms'}}>
            <div className="accent-line"/>
            <div style={{background:'var(--s1)',border:'1px solid var(--border)',padding:'28px'}}>
              <div className="font-mono text-[9px] tracking-[0.22em] uppercase mb-5 flex items-center gap-3" style={{color:'var(--acid)'}}>
                BUSINESS MODEL<span style={{flex:1,height:'1px',background:'linear-gradient(90deg,var(--border),transparent)'}}/>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-8">
                {BUSINESS_MODELS.map(({label,desc})=>(
                  <div key={label} onClick={()=>setInput('model',label)}
                    className="relative overflow-hidden cursor-pointer transition-all duration-200 group"
                    style={{border:`1px solid ${model===label?'var(--acid)':'var(--border2)'}`,background:model===label?'rgba(212,255,0,0.04)':'var(--bg)',padding:'14px 16px',boxShadow:model===label?'0 0 20px rgba(212,255,0,0.08),inset 0 0 20px rgba(212,255,0,0.03)':'none'}}>
                    {model===label&&<div className="absolute top-0 left-0 right-0 h-[2px]" style={{background:'var(--acid)',boxShadow:'0 0 8px rgba(212,255,0,0.6)'}}/>}
                    {model!==label&&<div className="absolute top-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{background:'rgba(212,255,0,0.3)'}}/>}
                    {model===label&&<span className="absolute top-2.5 right-3 font-mono text-[11px]" style={{color:'var(--acid)'}}>✓</span>}
                    <div className="font-mono text-[12px] mb-1" style={{color:'var(--text)'}}>{label}</div>
                    <div className="font-mono text-[10px]" style={{color:'var(--m2)'}}>{desc}</div>
                  </div>
                ))}
              </div>
              <div className="font-mono text-[9px] tracking-[0.22em] uppercase mb-4 flex items-center gap-3" style={{color:'var(--m2)'}}>
                TARGET MARKET<span style={{flex:1,height:'1px',background:'linear-gradient(90deg,var(--border),transparent)'}}/>
              </div>
              <div className="flex flex-wrap gap-2">
                {GEOGRAPHIES.map(geo=>(
                  <button key={geo} onClick={()=>setInput('geography',geo)}
                    className="font-mono text-[11px] px-4 py-2 border transition-all duration-200"
                    style={{borderColor:geography===geo?'var(--acid)':'var(--border2)',background:geography===geo?'var(--acid)':'transparent',color:geography===geo?'#000':'var(--m1)',boxShadow:geography===geo?'0 0 16px rgba(212,255,0,0.3)':'none'}}>
                    {geo}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step===3&&(
          <div className={`transition-all duration-500 ${mounted?'opacity-100 translate-y-0':'opacity-0 translate-y-8'}`} style={{transitionDelay:'300ms'}}>
            <div className="accent-line"/>
            <div style={{background:'var(--s1)',border:'1px solid var(--border)',padding:'28px'}}>
              <div className="font-mono text-[9px] tracking-[0.22em] uppercase mb-5 flex items-center gap-3" style={{color:'var(--acid)'}}>
                FOUNDER STAGE<span style={{flex:1,height:'1px',background:'linear-gradient(90deg,var(--border),transparent)'}}/>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-8">
                {STAGES.map(({icon,name,desc})=>(
                  <div key={name} onClick={()=>setInput('stage',name)}
                    className="relative overflow-hidden cursor-pointer transition-all duration-200 group"
                    style={{border:`1px solid ${stage===name?'var(--acid)':'var(--border2)'}`,background:stage===name?'rgba(212,255,0,0.04)':'var(--bg)',padding:'16px',boxShadow:stage===name?'0 0 20px rgba(212,255,0,0.08)':'none'}}>
                    {stage===name&&<div className="absolute top-0 left-0 right-0 h-[2px]" style={{background:'var(--acid)',boxShadow:'0 0 8px rgba(212,255,0,0.6)'}}/>}
                    {stage!==name&&<div className="absolute top-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{background:'rgba(212,255,0,0.3)'}}/>}
                    {stage===name&&<span className="absolute top-2.5 right-3 font-mono text-[11px]" style={{color:'var(--acid)'}}>✓</span>}
                    <div className="text-[20px] mb-2">{icon}</div>
                    <div className="font-mono text-[12px] mb-1" style={{color:'var(--text)'}}>{name}</div>
                    <div className="font-mono text-[10px]" style={{color:'var(--m2)'}}>{desc}</div>
                  </div>
                ))}
              </div>
              <div className="font-mono text-[9px] tracking-[0.22em] uppercase mb-4 flex items-center gap-3" style={{color:'var(--m2)'}}>
                AVAILABLE BUDGET<span style={{flex:1,height:'1px',background:'linear-gradient(90deg,var(--border),transparent)'}}/>
              </div>
              <div style={{border:'1px solid var(--border)',padding:'20px',background:'var(--bg)',marginBottom:'16px'}}>
                <div className="font-bebas leading-none mb-4" style={{fontSize:'60px',color:'var(--acid)',textShadow:'0 0 30px rgba(212,255,0,0.35)'}}>
                  {budget>=250000?'$250,000+':'$'+budget.toLocaleString()}
                </div>
                <div className="relative h-[2px] mb-4" style={{background:'var(--border2)'}}>
                  <div className="absolute left-0 top-0 h-full transition-all duration-300" style={{width:`${(budget/250000)*100}%`,background:'var(--acid)',boxShadow:'0 0 10px rgba(212,255,0,0.5)'}}/>
                  <input type="range" min={0} max={250000} step={5000} value={budget} onChange={e=>setInput('budget',parseInt(e.target.value))} className="absolute w-full opacity-0 cursor-pointer" style={{inset:'-12px 0',height:'24px'}}/>
                </div>
                <div className="flex justify-between font-mono text-[10px] mb-4" style={{color:'var(--m2)'}}><span>$0</span><span>$250K+</span></div>
                <div className="flex gap-1.5 flex-wrap">
                  {[0,25000,50000,100000,250000].map(v=>(
                    <button key={v} onClick={()=>setInput('budget',v)} className="font-mono text-[10px] px-3 py-1.5 border transition-all duration-150"
                      style={{borderColor:budget===v?'var(--acid)':'var(--border2)',background:budget===v?'var(--acid)':'transparent',color:budget===v?'#000':'var(--m2)',boxShadow:budget===v?'0 0 10px rgba(212,255,0,0.25)':'none'}}>
                      {v===0?'$0':v===250000?'$250K+':'$'+v/1000+'K'}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{border:'1px solid rgba(212,255,0,0.1)',padding:'16px',background:'rgba(212,255,0,0.02)'}}>
                <div className="font-mono text-[9px] tracking-[0.18em] uppercase mb-3 flex items-center gap-2" style={{color:'var(--m2)'}}>
                  <div className="w-[5px] h-[5px] rounded-full bg-ok" style={{animation:'pulse 2s infinite'}}/>Ready to analyze
                </div>
                <div className="font-mono text-[12px] leading-[1.9]" style={{color:'var(--m1)'}}>
                  <div><span style={{color:'var(--acid)'}}>›</span> <strong style={{color:'var(--text)'}}>{ideaText.substring(0,65)}{ideaText.length>65?'...':''}</strong></div>
                  <div><span style={{color:'var(--acid)'}}>›</span> {industry||'—'} · {model||'—'} · {geography}</div>
                  <div><span style={{color:'var(--acid)'}}>›</span> {stage||'—'} · {budget>=250000?'$250K+':'$'+budget.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error&&<div className="mt-4 border p-4 font-mono text-[12px] animate-fade-up" style={{background:'rgba(239,68,68,0.07)',borderColor:'var(--danger)',color:'#f87171'}}>{error}</div>}
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-[190] px-6 py-5" style={{background:'linear-gradient(to top,var(--bg) 55%,transparent)'}}>
        <div className="flex gap-3 max-w-[800px] mx-auto">
          {step>1&&<button onClick={prevStep} className="font-mono text-[11px] px-6 py-4 border transition-all duration-200" style={{background:'transparent',color:'var(--m1)',borderColor:'var(--border2)',whiteSpace:'nowrap'}}>← Back</button>}
          <button onClick={step<3?nextStep:handleAnalyze} disabled={loading||charging}
            className="flex-1 font-bebas tracking-[0.12em] py-4 relative overflow-hidden transition-all duration-200"
            style={{fontSize:'22px',background:charging?'rgba(212,255,0,0.08)':'var(--acid)',color:charging?'var(--acid)':'#000',border:charging?'1px solid var(--acid)':'none',boxShadow:loading?'0 14px 40px rgba(212,255,0,0.4)':'none'}}>
            {charging&&<div className="absolute left-0 top-0 bottom-0" style={{animation:'chargeUp 0.7s ease-out forwards',background:'rgba(212,255,0,0.15)'}}/>}
            {loading?(
              <span className="flex items-center justify-center gap-3">
                <span className="inline-block w-4 h-4 border-2 rounded-full" style={{borderColor:'transparent',borderTopColor:'#000',animation:'spin 0.8s linear infinite'}}/>
                Analyzing your idea...
              </span>
            ):charging?<span style={{position:'relative',zIndex:1}}>CHARGING...</span>
              :step<3?'NEXT STEP →':'ANALYZE MY IDEA →'}
          </button>
        </div>
      </div>
    </main>
  )
}
