'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/ui/Navbar'

const TERMINAL_LINES = [
  {delay:0,   text:'initializing analysis engine...',color:'var(--m2)'},
  {delay:600, text:'› scanning market signals',      color:'var(--m1)'},
  {delay:1100,text:'✓ Market Demand ........ 85',    color:'var(--ok)'},
  {delay:1500,text:'✓ Competition .......... 62',    color:'var(--ok)'},
  {delay:1900,text:'✓ Moat / Edge .......... 78',    color:'var(--ok)'},
  {delay:2300,text:'! Execution Risk ....... 44',    color:'var(--warn)'},
  {delay:2700,text:'✓ Monetization ........ 88',     color:'var(--ok)'},
  {delay:3100,text:'━━━━━━━━━━━━━━━━━━━━━━━━',      color:'var(--m2)'},
  {delay:3400,text:'SCORE: 74 · VERDICT: VIABLE',    color:'var(--acid)',bold:true},
  {delay:3800,text:'generating brand identity...',   color:'var(--m1)'},
]

const STATS = [{n:'9',l:'Dimensions'},{n:'60s',l:'Report time'},{n:'$19',l:'Full report'},{n:'3K+',l:'Ideas analyzed'}]
const HOW   = [
  {n:'01',t:'Describe Your Idea',    d:'Your idea, industry, target customer. 2 minutes.'},
  {n:'02',t:'AI Scans 9 Dimensions', d:'Market, competition, moat, risks, monetization.'},
  {n:'03',t:'Free Preview',          d:'Overall score + key metrics free. No signup.'},
  {n:'04',t:'Unlock Full Report',    d:'Full analysis, brand identity, pitch deck, GTM.'},
]

export default function LandingPage() {
  const [visible,  setVisible]  = useState<number[]>([])
  const [mounted,  setMounted]  = useState(false)

  useEffect(() => {
    setMounted(true)
    TERMINAL_LINES.forEach((line,i)=>{
      setTimeout(()=>setVisible(v=>[...v,i]),line.delay+400)
    })
  },[])

  return (
    <main style={{position:'relative',zIndex:2}}>
      <Navbar/>

      {/* ── HERO ── */}
      <section className="max-w-[1100px] mx-auto px-6 pt-16 pb-14 relative">
        <div className="absolute top-0 left-0 pointer-events-none"
          style={{width:'600px',height:'400px',background:'radial-gradient(ellipse at 20% 40%,rgba(212,255,0,0.04) 0%,transparent 60%)'}}/>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] uppercase border px-3.5 py-[5px] mb-12 transition-all duration-700"
          style={{color:'var(--acid)',borderColor:'rgba(212,255,0,0.2)',background:'rgba(212,255,0,0.04)',opacity:mounted?1:0,transform:mounted?'none':'translateY(16px)'}}>
          <span className="w-[5px] h-[5px] bg-acid rounded-full" style={{animation:'pulse 2s infinite'}}/>
          AI Analysis · Brand Identity · Launch Kit
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 items-center">
          <div>
            {/* Headline — staggered */}
            {['WILL YOUR',null,'SURVIVE?'].map((word,i)=>(
              <div key={i} className="overflow-hidden">
                <h1 className="font-bebas block transition-all duration-700"
                  style={{
                    fontSize:'clamp(80px,10vw,148px)',lineHeight:0.85,letterSpacing:'0.01em',
                    transitionDelay:`${(i+1)*100}ms`,
                    opacity:mounted?1:0,transform:mounted?'none':'translateY(48px)',
                    color: i===2?'var(--acid)':undefined,
                    WebkitTextStroke: i===1?'1.5px rgba(242,237,232,0.2)':undefined,
                    ...(i===1?{color:'transparent'}:{}),
                    textShadow: i===2?'0 0 40px rgba(212,255,0,0.35)':undefined,
                  }}>
                  {word ?? 'IDEA'}
                </h1>
              </div>
            ))}

            <p className="font-mono text-[13px] leading-[1.95] max-w-[440px] mb-8 transition-all duration-700"
              style={{color:'var(--m1)',transitionDelay:'400ms',opacity:mounted?1:0,transform:mounted?'none':'translateY(16px)'}}>
              Describe your business idea. Get a full AI viability report in 60 seconds — market size, competition, risks, and a complete brand identity kit.
            </p>

            <div className="flex flex-wrap gap-3 mb-10 transition-all duration-700"
              style={{transitionDelay:'500ms',opacity:mounted?1:0,transform:mounted?'none':'translateY(12px)'}}>
              {['Market Size','Competition','Revenue Model','Go/No-Go Score','Brand Identity'].map(f=>(
                <div key={f} className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] uppercase" style={{color:'var(--m2)'}}>
                  <span style={{color:'var(--acid)'}}>✓</span>{f}
                </div>
              ))}
            </div>

            <div className="flex gap-3 flex-wrap transition-all duration-700"
              style={{transitionDelay:'550ms',opacity:mounted?1:0,transform:mounted?'none':'translateY(12px)'}}>
              <Link href="/analyze" className="btn-acid font-bebas text-[22px] px-10 py-4">
                RUN VIABL CHECK →
              </Link>
              <Link href="/results/sample" className="hover-acid font-mono text-[11px] tracking-[0.1em] px-6 py-4 border transition-all"
                style={{borderColor:'var(--border2)',color:'var(--m1)'}}>
                See Sample Report
              </Link>
            </div>
          </div>

          {/* Terminal */}
          <div className="transition-all duration-700"
            style={{transitionDelay:'600ms',opacity:mounted?1:0,transform:mounted?'none':'translateY(24px) scale(0.97)',background:'var(--s1)',border:'1px solid var(--border)'}}>
            <div className="flex items-center gap-2 px-4 py-3 border-b"
              style={{background:'var(--s2)',borderColor:'var(--border)'}}>
              <div className="w-2.5 h-2.5 rounded-full bg-danger"/>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow"/>
              <div className="w-2.5 h-2.5 rounded-full bg-ok"/>
              <span className="font-mono text-[9px] tracking-[0.14em] uppercase ml-2" style={{color:'var(--m2)'}}>viabl · analysis engine</span>
              <div className="ml-auto flex items-center gap-1">
                <div className="w-[5px] h-[5px] rounded-full bg-ok" style={{animation:'pulse 2s infinite'}}/>
                <span className="font-mono text-[8px]" style={{color:'var(--ok)'}}>LIVE</span>
              </div>
            </div>
            <div className="p-5 font-mono text-[11px] leading-[1.9]" style={{minHeight:'280px'}}>
              {TERMINAL_LINES.map((line,i)=>(
                <div key={i} className="flex gap-2 transition-all duration-300"
                  style={{opacity:visible.includes(i)?1:0,transform:visible.includes(i)?'none':'translateY(8px)'}}>
                  <span style={{color:'var(--acid)'}}>›</span>
                  <span style={{color:line.color,fontWeight:line.bold?500:400}}>{line.text}</span>
                </div>
              ))}
              {visible.length>=TERMINAL_LINES.length&&(
                <div className="flex gap-2 mt-1">
                  <span style={{color:'var(--acid)'}}>›</span>
                  <span style={{color:'var(--m2)'}}>BRAND:</span>
                  <span style={{color:'var(--acid)'}}>generating</span>
                  <span className="cursor"/>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="max-w-[1100px] mx-auto px-6 mb-16 transition-all duration-700"
        style={{transitionDelay:'700ms',opacity:mounted?1:0,transform:mounted?'none':'translateY(12px)'}}>
        <div className="grid grid-cols-4 gap-px" style={{background:'var(--border)',border:'1px solid var(--border)'}}>
          {STATS.map(({n,l})=>(
            <div key={l} className="hover-acid text-center py-5 px-4 transition-all" style={{background:'var(--s1)'}}>
              <div className="font-bebas text-[32px] leading-none mb-1" style={{color:'var(--acid)'}}>{n}</div>
              <div className="font-mono text-[9px] tracking-[0.16em] uppercase" style={{color:'var(--m2)'}}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-[1100px] mx-auto px-6 pb-20">
        <div className="section-label mb-6">How it works</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{background:'var(--border)'}}>
          {HOW.map(({n,t,d},i)=>(
            <div key={n} className="hover-acid relative overflow-hidden p-7 transition-all duration-700"
              style={{background:'var(--s1)',transitionDelay:`${0.8+i*0.08}s`,opacity:mounted?1:0,transform:mounted?'none':'translateY(20px)'}}>
              <div className="absolute right-3 bottom-2 font-bebas leading-none pointer-events-none select-none"
                style={{fontSize:'80px',color:'rgba(212,255,0,0.04)'}}>{n}</div>
              <div className="font-mono text-[9px] tracking-[0.18em] uppercase mb-4" style={{color:'var(--acid)'}}>{n} —</div>
              <div className="font-mono text-[12px] tracking-[0.04em] mb-2" style={{color:'var(--text)'}}>{t}</div>
              <div className="font-mono text-[11px] leading-[1.8]" style={{color:'var(--m1)'}}>{d}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t px-6 py-6 flex justify-between items-center font-mono text-[10px]"
        style={{borderColor:'var(--border)',color:'var(--m2)'}}>
        <div className="font-bebas text-[20px]" style={{color:'var(--m2)'}}>VIABL.</div>
        <span>© 2026 Viabl — Know before you build</span>
        <span>Privacy · Terms</span>
      </footer>
    </main>
  )
}
