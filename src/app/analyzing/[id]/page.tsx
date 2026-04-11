'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/ui/Navbar'
import { ANALYSIS_TASKS } from '@/types'
type TS = {status:'queued'|'running'|'done';duration?:string}
export default function AnalyzingPage({params}:{params:{id:string}}) {
  const router = useRouter()
  const [pct, setPct]     = useState(0)
  const [msg, setMsg]     = useState('Initializing analysis engine...')
  const [tasks, setTasks] = useState<TS[]>(ANALYSIS_TASKS.map(()=>({status:'queued'})))
  const [done, setDone]   = useState(false)
  useEffect(()=>{
    const total=7200,per=total/ANALYSIS_TASKS.length;let cur=0
    function next(){
      if(cur>=ANALYSIS_TASKS.length){setMsg('Analysis complete.');setDone(true);setTimeout(()=>router.push(`/results/${params.id}`),800);return}
      if(cur>0){const p=cur-1;setTasks(t=>t.map((tk,i)=>i===p?{status:'done',duration:`${(Math.random()*.8+.3).toFixed(1)}s`}:tk))}
      setTasks(t=>t.map((tk,i)=>i===cur?{status:'running'}:tk))
      setMsg(`Analyzing: ${ANALYSIS_TASKS[cur].name}...`)
      setPct(Math.round((cur/ANALYSIS_TASKS.length)*100))
      cur++;setTimeout(next,per)
    }
    setTimeout(()=>{setTasks(t=>t.map((tk,i)=>i===ANALYSIS_TASKS.length-1?{status:'done',duration:`${(Math.random()*.8+.3).toFixed(1)}s`}:tk));setPct(100)},total)
    setTimeout(next,200)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return(<main style={{position:'relative',zIndex:2}}><Navbar/>
    <div className="max-w-[680px] mx-auto px-6 pt-12 pb-16 text-center">
      <div className="relative inline-block mb-2">
        <div className="font-bebas leading-none transition-all duration-300"
          style={{fontSize:'clamp(120px,18vw,180px)',color:'var(--acid)',textShadow:done?'0 0 60px rgba(212,255,0,0.5)':'0 0 30px rgba(212,255,0,0.2)',transition:'text-shadow 0.5s ease'}}>
          {pct}
        </div>
        <span className="absolute font-bebas" style={{fontSize:'clamp(40px,6vw,60px)',color:'rgba(212,255,0,0.3)',bottom:'14px',right:'-50px'}}>%</span>
      </div>
      <div className="h-[2px] my-3 relative overflow-hidden" style={{background:'var(--border)'}}>
        <div className="absolute left-0 top-0 h-full transition-all duration-500 ease-out"
          style={{width:`${pct}%`,background:'var(--acid)',boxShadow:'0 0 16px rgba(212,255,0,0.6)'}}/>
      </div>
      <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-left mb-10 transition-all duration-300"
        style={{color:done?'var(--ok)':'var(--m1)'}}>
        {done?'✓ ':''}{msg}
      </div>
      <div className="text-left">
        {ANALYSIS_TASKS.map((task,i)=>{
          const ts=tasks[i]||{status:'queued'}
          return(
            <div key={task.name} className="grid items-center py-3 border-b transition-all duration-200"
              style={{gridTemplateColumns:'36px 1fr 72px',gap:'14px',borderColor:'var(--border)',opacity:ts.status==='queued'?0.4:1}}>
              <div className="w-8 h-8 border flex items-center justify-center text-[13px] flex-shrink-0 transition-all duration-300"
                style={{borderColor:ts.status!=='queued'?'var(--acid)':'var(--border2)',background:ts.status==='done'?'var(--acid)':'transparent',animation:ts.status==='running'?'borderPulse 1s infinite':'none',boxShadow:ts.status==='done'?'0 0 12px rgba(212,255,0,0.3)':ts.status==='running'?'0 0 8px rgba(212,255,0,0.2)':'none'}}>
                {ts.status==='done'?'✓':task.emoji}
              </div>
              <div>
                <div className="font-mono text-[12px]" style={{color:'var(--text)'}}>{task.name}</div>
                <div className="font-mono text-[9px] tracking-[0.12em] uppercase transition-colors duration-200"
                  style={{color:ts.status==='done'?'var(--ok)':ts.status==='running'?'var(--acid)':'var(--m2)'}}>
                  {ts.status==='done'?'Complete':ts.status==='running'?'Running...':'Queued'}
                </div>
              </div>
              <div className="font-mono text-[11px] text-right" style={{color:'var(--m2)'}}>{ts.duration||'—'}</div>
            </div>
          )
        })}
      </div>
    </div>
  </main>)
}
