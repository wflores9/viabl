'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/ui/Navbar'
import { ANALYSIS_TASKS } from '@/types'
type TS = { status:'queued'|'running'|'done'; duration?:string }

export default function AnalyzingPage({ params }: { params:{ id:string } }) {
  const router = useRouter()
  const [pct,   setPct]   = useState(0)
  const [msg,   setMsg]   = useState('Initializing analysis engine...')
  const [tasks, setTasks] = useState<TS[]>(ANALYSIS_TASKS.map(() => ({ status:'queued' })))
  const [done,  setDone]  = useState(false)

  useEffect(() => {
    const total = 7200, per = total / ANALYSIS_TASKS.length; let cur = 0
    const next = () => {
      if (cur >= ANALYSIS_TASKS.length) {
        setMsg('Analysis complete.'); setDone(true)
        setTimeout(() => router.push(`/results/${params.id}`), 900); return
      }
      if (cur > 0) setTasks(t => t.map((tk,i) => i===cur-1 ? { status:'done', duration:`${(Math.random()*.8+.3).toFixed(1)}s` } : tk))
      setTasks(t => t.map((tk,i) => i===cur ? { status:'running' } : tk))
      setMsg(`Analyzing: ${ANALYSIS_TASKS[cur].name}...`)
      setPct(Math.round((cur / ANALYSIS_TASKS.length) * 100))
      cur++; setTimeout(next, per)
    }
    setTimeout(() => { setTasks(t => t.map(() => ({ status:'done', duration:`${(Math.random()*.8+.3).toFixed(1)}s` }))); setPct(100) }, total)
    setTimeout(next, 200)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main style={{ minHeight:'100vh', background:'var(--black)' }}>
      <Navbar/>
      {/* Ambient glow */}
      <div style={{ position:'fixed', top:0, left:'50%', transform:'translateX(-50%)', width:'700px', height:'500px', background:`radial-gradient(ellipse,${done?'rgba(61,170,106,.08)':'rgba(200,16,46,.08)'} 0%,transparent 70%)`, pointerEvents:'none', transition:'background 1s ease' }}/>

      <div style={{ position:'relative', zIndex:1, maxWidth:'580px', margin:'0 auto', padding:'5rem 2rem 6rem', textAlign:'center' }}>

        <div style={{ fontSize:'.54rem', letterSpacing:'.4em', textTransform:'uppercase', color: done ? '#3DAA6A' : 'var(--red)', marginBottom:'2rem', transition:'color .5s' }}>
          {done ? '✓ Analysis Complete' : '▶ Analysis Engine Running'}
        </div>

        {/* Spinning ring */}
        <div style={{ width:'130px', height:'130px', position:'relative', margin:'0 auto 2rem' }}>
          <div style={{ position:'absolute', inset:0, border:'1px solid rgba(255,255,255,.06)', borderRadius:'50%' }}/>
          <div style={{ position:'absolute', inset:'6px', border:`2px solid transparent`, borderTopColor: done ? '#3DAA6A' : 'var(--red)', borderRadius:'50%', animation: done ? 'none' : 'spin 1s linear infinite', transition:'border-top-color .5s' }}/>
          <div style={{ position:'absolute', inset:'20px', border:'1px solid transparent', borderBottomColor:`rgba(${done?'61,170,106':'200,16,46'},.3)`, borderRadius:'50%', animation: done ? 'none' : 'spin 1.8s linear infinite reverse', transition:'border-bottom-color .5s' }}/>
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontSize:'2.2rem', fontWeight:900, color: done ? '#3DAA6A' : 'var(--white)', transition:'color .5s' }}>
            {pct}
          </div>
        </div>

        <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:'clamp(1.6rem,4vw,3rem)', marginBottom:'.5rem', transition:'color .5s', color: done ? '#3DAA6A' : 'var(--white)' }}>
          {done ? 'Verdict ready.' : 'Scanning your idea...'}
        </h2>
        <p style={{ fontSize:'.68rem', color:'var(--dim)', marginBottom:'2.5rem' }}>
          {done ? 'Preparing your report...' : 'Cross-referencing market intelligence corpus'}
        </p>

        {/* Progress bar */}
        <div style={{ height:'2px', background:'rgba(255,255,255,.08)', marginBottom:'.6rem', overflow:'hidden', borderRadius:'1px' }}>
          <div style={{ height:'100%', background: done ? '#3DAA6A' : 'var(--red)', width:`${pct}%`, transition:'width .5s ease, background .5s' }}/>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.55rem', color:'var(--dim)', marginBottom:'2.5rem' }}>
          <span style={{ color: done ? '#3DAA6A' : 'var(--dim)', transition:'color .3s' }}>{msg}</span>
          <span>{pct}%</span>
        </div>

        {/* Task list */}
        <div style={{ border:'1px solid rgba(255,255,255,.07)', background:'#060606', textAlign:'left' }}>
          <div style={{ padding:'.6rem 1rem', borderBottom:'1px solid rgba(255,255,255,.07)', background:'#0C0C0C', fontSize:'.54rem', letterSpacing:'.2em', color:'var(--dim)', textTransform:'uppercase' }}>
            viabl · analysis engine v2.1
          </div>
          <div style={{ padding:'.5rem 0' }}>
            {ANALYSIS_TASKS.map((task, i) => {
              const ts = tasks[i] || { status:'queued' }
              return (
                <div key={task.name} style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'.6rem 1.2rem', opacity: ts.status==='queued' ? .3 : 1, transition:'opacity .3s' }}>
                  <div style={{ width:'7px', height:'7px', borderRadius:'50%', flexShrink:0, transition:'background .3s', background: ts.status==='done' ? '#3DAA6A' : ts.status==='running' ? 'var(--red)' : 'rgba(255,255,255,.15)', animation: ts.status==='running' ? 'pulse .8s ease-in-out infinite' : 'none' }}/>
                  <div style={{ flex:1, fontSize:'.65rem', color: ts.status==='done' ? 'var(--white)' : ts.status==='running' ? 'var(--white)' : 'var(--dim)', transition:'color .3s' }}>{task.name}</div>
                  <div style={{ fontSize:'.56rem', letterSpacing:'.08em', color: ts.status==='done' ? '#3DAA6A' : ts.status==='running' ? 'var(--red)' : 'var(--dim)', textTransform:'uppercase', transition:'color .3s' }}>
                    {ts.status==='done' ? (ts.duration||'✓') : ts.status==='running' ? 'Running...' : 'Queued'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
