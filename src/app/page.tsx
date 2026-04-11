'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/ui/Navbar'

const TERMINAL_LINES = [
  { delay: 0,    text: 'boot: viabl analysis engine v2.1',  color: 'var(--m2)' },
  { delay: 500,  text: '> loading market intelligence...',  color: 'var(--m1)' },
  { delay: 900,  text: '> scanning 847,293 data points',    color: 'var(--m1)' },
  { delay: 1300, text: '✓ Market Demand ........ 85/100',   color: 'var(--ok)' },
  { delay: 1650, text: '✓ Competition .......... 62/100',   color: 'var(--ok)' },
  { delay: 1950, text: '✓ Moat / Edge .......... 78/100',   color: 'var(--ok)' },
  { delay: 2250, text: '! Execution Risk ....... 44/100',   color: 'var(--warn)' },
  { delay: 2550, text: '✓ Monetization ......... 88/100',   color: 'var(--ok)' },
  { delay: 2900, text: '─────────────────────────────────', color: 'var(--border2)' },
  { delay: 3100, text: 'VERDICT: VIABLE  SCORE: 74/100',   color: 'var(--acid)', bold: true },
  { delay: 3500, text: '> generating brand identity kit...', color: 'var(--m1)' },
]

const METRICS = [
  { label: 'Market Demand',     val: 85, color: 'var(--ok)' },
  { label: 'Revenue Potential', val: 88, color: 'var(--ok)' },
  { label: 'Moat / Edge',       val: 78, color: 'var(--ok)' },
  { label: 'Execution Risk',    val: 56, color: 'var(--yellow)' },
  { label: 'Competition',       val: 62, color: 'var(--ok)' },
]

const WORDS = [
  { word: 'WILL',     outline: false, acid: false },
  { word: 'YOUR',     outline: false, acid: false },
  { word: 'IDEA',     outline: true,  acid: false },
  { word: 'SURVIVE?', outline: false, acid: true  },
]

export default function LandingPage() {
  const [visibleLines, setVisibleLines] = useState<number[]>([])
  const [barWidths,    setBarWidths]    = useState<number[]>(METRICS.map(() => 0))
  const [mounted,      setMounted]      = useState(false)
  const [count,        setCount]        = useState(3000)
  const [scanY,        setScanY]        = useState(-10)
  const rafRef = useRef<number>(0)
  const syRef  = useRef(-10)

  useEffect(() => {
    setMounted(true)
    TERMINAL_LINES.forEach((line, i) => {
      setTimeout(() => setVisibleLines(v => [...v, i]), line.delay + 300)
    })
    setTimeout(() => {
      METRICS.forEach((m, i) => {
        setTimeout(() => {
          setBarWidths(prev => { const n = [...prev]; n[i] = m.val; return n })
        }, i * 130)
      })
    }, 1800)
    const int = setInterval(() => setCount(c => Math.min(c + 7, 3847)), 80)
    const scan = () => {
      syRef.current = syRef.current > 110 ? -10 : syRef.current + 0.15
      setScanY(syRef.current)
      rafRef.current = requestAnimationFrame(scan)
    }
    rafRef.current = requestAnimationFrame(scan)
    return () => { clearInterval(int); cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <main className="relative" style={{ zIndex: 2, minHeight: '100vh' }}>
      <Navbar />

      <section className="relative overflow-hidden" style={{ minHeight: 'calc(100vh - 53px)' }}>

        {/* Grid background */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(212,255,0,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(212,255,0,0.025) 1px,transparent 1px)',
          backgroundSize: '80px 80px',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%)',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%)',
        }}/>

        {/* Scanline */}
        <div className="absolute left-0 right-0 pointer-events-none" style={{
          top: `${scanY}%`, height: '2px',
          background: 'linear-gradient(90deg,transparent,rgba(212,255,0,0.07),transparent)',
        }}/>

        {/* Ambient glow */}
        <div className="absolute pointer-events-none" style={{
          top: '5%', left: '-15%', width: '65%', height: '75%',
          background: 'radial-gradient(ellipse,rgba(212,255,0,0.055) 0%,transparent 65%)',
        }}/>

        <div className="max-w-[1400px] mx-auto px-8 pt-12 pb-16 relative">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_520px] gap-12 items-start">

            {/* LEFT */}
            <div>
              {/* Live badge */}
              <div className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.22em] uppercase border px-3.5 py-[5px] mb-10 transition-all duration-700"
                style={{ color:'var(--acid)',borderColor:'rgba(212,255,0,0.18)',background:'rgba(212,255,0,0.04)', opacity:mounted?1:0,transform:mounted?'none':'translateY(12px)' }}>
                <span className="w-[5px] h-[5px] bg-acid rounded-full flex-shrink-0" style={{ animation:'pulse 2s infinite' }}/>
                {count.toLocaleString()} ideas analyzed · Live
              </div>

              {/* Massive headline */}
              <div className="mb-8">
                {WORDS.map(({ word, outline, acid }, i) => (
                  <div key={word} className="overflow-hidden" style={{ lineHeight: 0.83 }}>
                    <div className="font-bebas transition-all duration-700"
                      style={{
                        fontSize: 'clamp(88px,11.5vw,168px)',
                        letterSpacing: '0.01em',
                        transitionDelay: `${i * 90}ms`,
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'none' : 'translateY(60px)',
                        color: acid ? 'var(--acid)' : outline ? 'transparent' : 'var(--text)',
                        WebkitTextStroke: outline ? '1.5px rgba(242,237,232,0.18)' : undefined,
                        textShadow: acid ? '0 0 80px rgba(212,255,0,0.25)' : undefined,
                      }}>
                      {word}
                    </div>
                  </div>
                ))}
              </div>

              <p className="font-mono text-[14px] leading-[1.9] mb-8 transition-all duration-700"
                style={{ color:'var(--m1)',maxWidth:'480px',transitionDelay:'400ms',opacity:mounted?1:0,transform:mounted?'none':'translateY(16px)' }}>
                Describe your idea. Get a full AI viability report in 60 seconds —
                market size, competition, risks, and a complete brand identity kit.
              </p>

              <div className="flex flex-wrap gap-2 mb-10 transition-all duration-700"
                style={{ transitionDelay:'480ms',opacity:mounted?1:0,transform:mounted?'none':'translateY(12px)' }}>
                {['9 Dimensions','Market Analysis','Risk Scoring','Brand Identity','GTM Playbook'].map(f => (
                  <span key={f} className="font-mono text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 border"
                    style={{ color:'var(--m1)',borderColor:'var(--border)',background:'var(--s1)' }}>
                    {f}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 flex-wrap items-center transition-all duration-700"
                style={{ transitionDelay:'540ms',opacity:mounted?1:0,transform:mounted?'none':'translateY(12px)' }}>
                <Link href="/analyze" className="btn-acid font-bebas text-[24px] px-12 py-4">
                  RUN VIABL CHECK →
                </Link>
                <div className="font-mono text-[10px] leading-relaxed" style={{ color:'var(--m2)' }}>
                  <span style={{ color:'var(--acid)' }}>Free preview</span> · 60 seconds · No signup
                </div>
              </div>
            </div>

            {/* RIGHT — Terminal + metrics */}
            <div className="transition-all duration-700 xl:mt-4"
              style={{ transitionDelay:'200ms',opacity:mounted?1:0,transform:mounted?'none':'translateY(30px) scale(0.97)' }}>

              {/* Terminal */}
              <div className="mb-3" style={{ background:'var(--s1)',border:'1px solid var(--border)' }}>
                <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ background:'var(--s2)',borderColor:'var(--border)' }}>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background:'#ff5f57' }}/>
                    <div className="w-3 h-3 rounded-full" style={{ background:'#febc2e' }}/>
                    <div className="w-3 h-3 rounded-full" style={{ background:'#28c840' }}/>
                  </div>
                  <span className="font-mono text-[9px] tracking-[0.14em] uppercase ml-2 flex-1" style={{ color:'var(--m2)' }}>
                    viabl · analysis engine
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-[5px] h-[5px] rounded-full" style={{ background:'var(--ok)',animation:'pulse 2s infinite' }}/>
                    <span className="font-mono text-[8px] tracking-[0.12em]" style={{ color:'var(--ok)' }}>LIVE</span>
                  </div>
                </div>
                <div className="p-5 font-mono text-[11px] leading-[1.85]" style={{ minHeight:'260px' }}>
                  {TERMINAL_LINES.map((line, i) => (
                    <div key={i} className="flex gap-2.5 transition-all duration-300"
                      style={{ opacity:visibleLines.includes(i)?1:0,transform:visibleLines.includes(i)?'none':'translateY(6px)' }}>
                      <span style={{ color:'var(--acid)',flexShrink:0 }}>›</span>
                      <span style={{ color:line.color,fontWeight:line.bold?600:400 }}>{line.text}</span>
                    </div>
                  ))}
                  {visibleLines.length >= TERMINAL_LINES.length && (
                    <div className="flex gap-2.5 mt-0.5">
                      <span style={{ color:'var(--acid)',flexShrink:0 }}>›</span>
                      <span style={{ color:'var(--m2)' }}>BRAND:</span>
                      <span style={{ color:'var(--acid)' }}>generating</span>
                      <span className="cursor"/>
                    </div>
                  )}
                </div>
              </div>

              {/* Metrics panel */}
              <div style={{ background:'var(--s1)',border:'1px solid var(--border)',padding:'20px 20px 16px' }}>
                <div className="section-label mb-4">Live Score Preview</div>
                {METRICS.map((m, i) => (
                  <div key={m.label} className="flex items-center gap-3 mb-[10px]">
                    <div className="font-mono text-[10px] flex-shrink-0 w-[130px]" style={{ color:'var(--m2)' }}>{m.label}</div>
                    <div className="flex-1 h-[2px]" style={{ background:'var(--border2)' }}>
                      <div className="h-full transition-all duration-[1200ms] ease-out"
                        style={{ width:`${barWidths[i]}%`,background:m.color,boxShadow:`0 0 6px ${m.color}66` }}/>
                    </div>
                    <div className="font-mono text-[10px] font-medium w-[28px] text-right" style={{ color:m.color }}>
                      {barWidths[i]}
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3 mt-1 border-t" style={{ borderColor:'var(--border)' }}>
                  <div>
                    <div className="font-mono text-[9px] tracking-[0.16em] uppercase mb-1" style={{ color:'var(--m2)' }}>Overall Score</div>
                    <div className="font-bebas text-[44px] leading-none" style={{ color:'var(--acid)',textShadow:'0 0 30px rgba(212,255,0,0.3)' }}>74</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[9px] tracking-[0.16em] uppercase mb-1" style={{ color:'var(--m2)' }}>Verdict</div>
                    <div className="font-bebas text-[16px] tracking-[0.12em] px-4 py-1" style={{ background:'#16a34a',color:'#fff',boxShadow:'0 0 20px rgba(34,197,94,0.3)' }}>
                      VIABLE →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px mt-16 transition-all duration-700"
            style={{ background:'var(--border)',border:'1px solid var(--border)',transitionDelay:'700ms',opacity:mounted?1:0,transform:mounted?'none':'translateY(16px)' }}>
            {[{n:'9',l:'Analysis dimensions'},{n:'60s',l:'Average report time'},{n:'$19',l:'Full report unlock'},{n:'3.8K+',l:'Ideas analyzed'}].map(({ n, l }) => (
              <div key={l} className="hover-acid py-6 px-8 text-center transition-all" style={{ background:'var(--s1)' }}>
                <div className="font-bebas text-[36px] leading-none mb-1.5" style={{ color:'var(--acid)' }}>{n}</div>
                <div className="font-mono text-[9px] tracking-[0.16em] uppercase" style={{ color:'var(--m2)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background:'var(--bg2)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)' }}>
        <div className="max-w-[1400px] mx-auto px-8 py-16">
          <div className="section-label mb-8">How it works</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background:'var(--border)' }}>
            {[
              {n:'01',t:'Describe Your Idea',    d:'Idea, industry, target customer. No essays. 2 minutes.'},
              {n:'02',t:'AI Scans 9 Dimensions', d:'Market demand, competition, moat, risks, monetization.'},
              {n:'03',t:'Free Preview',           d:'Overall score + key metrics instantly. Zero signup.'},
              {n:'04',t:'Unlock Full Report',     d:'Full analysis, brand identity, pitch deck, GTM playbook.'},
            ].map(({ n, t, d }) => (
              <div key={n} className="hover-acid relative overflow-hidden p-8 group transition-all" style={{ background:'var(--s1)' }}>
                <div className="absolute right-4 bottom-3 font-bebas leading-none pointer-events-none select-none"
                  style={{ fontSize:'100px',color:'rgba(212,255,0,0.03)' }}>{n}</div>
                <div className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-300 origin-left scale-x-0 group-hover:scale-x-100"
                  style={{ background:'var(--acid)' }}/>
                <div className="font-mono text-[9px] tracking-[0.2em] uppercase mb-5" style={{ color:'var(--acid)' }}>{n} —</div>
                <div className="font-mono text-[13px] tracking-[0.04em] mb-2.5" style={{ color:'var(--text)' }}>{t}</div>
                <div className="font-mono text-[11px] leading-[1.85]" style={{ color:'var(--m1)' }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t px-8 py-7 flex justify-between items-center font-mono text-[10px]"
        style={{ borderColor:'var(--border)',color:'var(--m2)' }}>
        <div className="font-bebas text-[22px]" style={{ color:'var(--m2)',letterSpacing:'0.06em' }}>VIABL.</div>
        <span>© 2026 Viabl — Know before you build</span>
        <span className="hidden sm:block">Privacy · Terms</span>
      </footer>
    </main>
  )
}
