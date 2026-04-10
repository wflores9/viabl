'use client'
import{useEffect,useState}from'react'
import{useRouter}from'next/navigation'
import{Navbar}from'@/components/ui/Navbar'
import{ProgressTask}from'@/components/ui/ProgressTask'
import{ANALYSIS_TASKS}from'@/types'
type TS={status:'queued'|'running'|'done';duration?:string}
export default function AnalyzingPage({params}:{params:{id:string}}){
  const router=useRouter()
  const[pct,setPct]=useState(0)
  const[msg,setMsg]=useState('Initializing...')
  const[tasks,setTasks]=useState<TS[]>(ANALYSIS_TASKS.map(()=>({status:'queued'})))
  useEffect(()=>{
    const total=7200,per=total/ANALYSIS_TASKS.length;let cur=0
    function next(){
      if(cur>=ANALYSIS_TASKS.length){setMsg('Analysis complete.');setTimeout(()=>router.push(`/results/${params.id}`),600);return}
      if(cur>0){const p=cur-1;setTasks(t=>t.map((tk,i)=>i===p?{status:'done',duration:`${(Math.random()*.8+.3).toFixed(1)}s`}:tk))}
      setTasks(t=>t.map((tk,i)=>i===cur?{status:'running'}:tk))
      setMsg(`Analyzing: ${ANALYSIS_TASKS[cur].name}...`)
      setPct(Math.round((cur/ANALYSIS_TASKS.length)*100))
      cur++;setTimeout(next,per)
    }
    setTimeout(()=>{setTasks(t=>t.map((tk,i)=>i===ANALYSIS_TASKS.length-1?{status:'done',duration:`${(Math.random()*.8+.3).toFixed(1)}s`}:tk));setPct(100)},total)
    next()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return(<main><Navbar step={3}/>
    <div className="max-w-[680px] mx-auto px-6 pt-10 pb-16 text-center">
      <div className="font-bebas text-[148px] text-acid leading-none relative inline-block">{pct}<span className="text-[56px] absolute bottom-5 -right-11 text-acid/35">%</span></div>
      <div className="h-[2px] bg-border my-2"><div className="h-full bg-acid transition-all duration-500" style={{width:`${pct}%`}}/></div>
      <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted1 text-left mb-10">{msg}</div>
      <div className="text-left">{ANALYSIS_TASKS.map((task,i)=><ProgressTask key={task.name} emoji={task.emoji} name={task.name} status={tasks[i]?.status||'queued'} duration={tasks[i]?.duration}/>)}</div>
    </div>
  </main>)
}
