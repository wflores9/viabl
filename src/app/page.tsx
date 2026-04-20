'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/ui/Navbar'

const TERMINAL_LINES = [
  { c:'tc', t:'> viabl analyze "AI-powered invoicing for freelancers"' },
  { c:'to', t:'  Initializing analysis engine v2.1...' },
  { c:'to', t:'  Parsing market intelligence corpus...' },
  { c:'tg', t:'  ✓ Market Demand ............... 79/100' },
  { c:'tg', t:'  ✓ Market Size ................. 88/100' },
  { c:'tg', t:'  ✓ Competition ................. 61/100' },
  { c:'tw', t:'  ! Moat / Edge ................. 64/100' },
  { c:'tg', t:'  ✓ Monetization ................ 91/100' },
  { c:'tw', t:'  ! Execution Risk .............. 55/100' },
  { c:'tg', t:'  ✓ Timing ...................... 82/100' },
  { c:'tg', t:'  ✓ GTM Playbook ................ 76/100' },
  { c:'tg', t:'  ✓ Brand Identity .............. 83/100' },
  { c:'td', t:'  ──────────────────────────────────────' },
  { c:'tv', t:'  VERDICT: VIABLE  ·  SCORE: 74/100' },
]

const DIMS = [
  { n:'01', t:'Market Demand',  d:'Real search signal, trend velocity, and buyer intent.' },
  { n:'02', t:'Market Size',    d:'TAM, SAM, SOM from real data. Not inflated pitch deck numbers.' },
  { n:'03', t:'Competition',    d:"Who's winning, how entrenched, how hard they'll fight." },
  { n:'04', t:'Moat / Edge',    d:'Can you defend position, or does a funded team copy you overnight?' },
  { n:'05', t:'Monetization',   d:'Will people pay — at what price, through which model?' },
  { n:'06', t:'Execution Risk', d:'Technical, regulatory, and ops complexity that quietly kills ideas.' },
  { n:'07', t:'Timing',        d:'Is the market ready? Too early is just as fatal as too late.' },
  { n:'08', t:'GTM Playbook',   d:'Channel strategy, ICP, and early traction path mapped out.' },
  { n:'09', t:'Brand Identity', d:'Name, positioning, identity kit. Ready to launch.' },
]

const STATS = [
  { n:90, s:'%', l1:'of startups fail.', l2:'Most after years of work.' },
  { n:42, s:'%', l1:'fail due to no market need.', l2:'Entirely preventable.' },
  { n:29, s:'%', l1:'run out of cash before', l2:'validating their idea.' },
]

const lc = (c:string) => c==='tg'?'#5DBB63':c==='tw'?'#C4973A':c==='tv'||c==='tc'?'var(--white)':'var(--dim)'

export default function LandingPage() {
  const [heroIn,    setHeroIn]    = useState(false)
  const [termLines, setTermLines] = useState<string[]>([])
  const [termDone,  setTermDone]  = useState(false)
  const [heroPct,   setHeroPct]   = useState(0)
  const tbRef      = useRef<HTMLDivElement>(null)
  const termFired  = useRef(false)
  const glowRef    = useRef<HTMLDivElement>(null)

  // Trigger hero after intro
  useEffect(() => {
    const t1 = setTimeout(() => setHeroIn(true), 3400)
    const t2 = setTimeout(() => {
      let v = 0
      const t = setInterval(() => { v += 2; if (v >= 90) { v = 90; clearInterval(t) } setHeroPct(v) }, 40)
    }, 5000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Scroll reveal — run after hero fires so DOM is populated
  useEffect(() => {
    if (!heroIn) return
    const reveal = () => {
      document.querySelectorAll('.r, .dc, .step-row, .ts-card').forEach(el => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight - 60) el.classList.add('v')
      })
    }
    reveal() // immediate pass
    window.addEventListener('scroll', reveal, { passive: true })
    return () => window.removeEventListener('scroll', reveal)
  }, [heroIn])

  // Terminal
  useEffect(() => {
    const tio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !termFired.current) {
          termFired.current = true
          let i = 0
          const run = () => {
            if (i >= TERMINAL_LINES.length) { setTermDone(true); return }
            const ln = TERMINAL_LINES[i++]
            setTermLines(p => [...p, ln.c + '|' + ln.t])
            if (tbRef.current) tbRef.current.scrollTop = tbRef.current.scrollHeight
            setTimeout(run, ln.c === 'tc' ? 480 : 150)
          }
          setTimeout(run, 300)
          tio.disconnect()
        }
      })
    }, { threshold: 0.3 })
    if (tbRef.current) tio.observe(tbRef.current)
    return () => tio.disconnect()
  }, [])

  // Parallax glow
  useEffect(() => {
    const fn = () => { if (glowRef.current) glowRef.current.style.transform = `translateX(-50%) translateY(${window.scrollY * .18}px)` }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <main style={{ position:'relative', zIndex:2, minHeight:'100vh' }}>
      <Navbar />

      {/* CINEMATIC INTRO */}
      <div style={{
        position:'fixed', inset:0, background:'#000', zIndex:9960,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        animation:'cinOut .9s cubic-bezier(.7,0,.3,1) 3s forwards',
        pointerEvents: heroIn ? 'none' : 'auto',
      }}>
        <style>{`@keyframes cinOut{0%{clip-path:inset(0 0 0 0)}100%{clip-path:inset(0 0 100% 0)}}`}</style>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(5rem,18vw,14rem)', fontWeight:900, fontStyle:'italic', color:'var(--white)', letterSpacing:'-.03em', opacity:0, animation:'iw .7s ease .3s forwards' }}>
          IDEA<span style={{ color:'var(--red)' }}>?</span>
        </div>
        <div style={{ fontSize:'.75rem', letterSpacing:'.42em', textTransform:'uppercase', color:'var(--dim)', marginTop:'1.6rem', opacity:0, animation:'iw .5s ease 1.1s forwards' }}>
          viabl · analysis engine · v2.1
        </div>
        <div style={{ width:0, height:'1px', background:'var(--red)', marginTop:'1.2rem', animation:'ibar .7s ease 1.7s forwards' }}/>
      </div>

      {/* ── HERO ── */}
      <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', justifyContent:'center', padding:'8rem clamp(1.5rem,7vw,7rem) 4rem', position:'relative', overflow:'hidden' }}>
        <div ref={glowRef} style={{ position:'absolute', top:'-10%', left:'50%', transform:'translateX(-50%)', width:'800px', height:'800px', background:'radial-gradient(ellipse,rgba(200,16,46,.12) 0%,transparent 68%)', pointerEvents:'none' }}/>

        <div style={{ fontSize:'.75rem', letterSpacing:'.42em', textTransform:'uppercase', color:'var(--red)', marginBottom:'1.8rem', display:'flex', alignItems:'center', gap:'.6rem', opacity: heroIn ? 1 : 0, transition:'opacity .6s ease .1s' }}>
          <span style={{ display:'inline-block', width:'6px', height:'6px', borderRadius:'50%', background:'var(--red)', animation:'pulse 2s infinite' }}/>
          Analysis Engine Active · 3,800+ Ideas Scanned
        </div>

        <h1 style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, lineHeight:.88, marginBottom:'2.5rem' }}>
          {[
            { txt:'Will Your',  size:'clamp(2rem,6vw,6.5rem)',   color:'var(--dim)',   italic:true  },
            { txt:'IDEA',       size:'clamp(5rem,16vw,16rem)',    color:'var(--white)', italic:false },
            { txt:'Survive?',   size:'clamp(2rem,6vw,6.5rem)',   color:'var(--red)',   italic:true  },
          ].map((row, i) => (
            <span key={row.txt} style={{ display:'block', overflow:'hidden' }}>
              <span style={{
                display:'block',
                fontSize: row.size,
                color: row.color,
                fontStyle: row.italic ? 'italic' : 'normal',
                letterSpacing: i === 1 ? '-.03em' : undefined,
                opacity: heroIn ? 1 : 0,
                transform: heroIn ? 'none' : 'translateY(110%)',
                transition: `opacity .9s cubic-bezier(.16,1,.3,1) ${.15 + i * .18}s, transform .9s cubic-bezier(.16,1,.3,1) ${.15 + i * .18}s`,
              }}>{row.txt}</span>
            </span>
          ))}
        </h1>

        <p style={{ maxWidth:'440px', fontSize:'.92rem', lineHeight:1.9, color:'var(--dim)', marginBottom:'2.2rem', opacity: heroIn ? 1 : 0, transition:'opacity .7s ease .7s' }}>
          Most founders build first, discover failure later. Viabl scans 9 critical dimensions and delivers a full verdict before you spend a dollar.
        </p>

        <div style={{ display:'flex', gap:'1.4rem', alignItems:'center', opacity: heroIn ? 1 : 0, transition:'opacity .7s ease .85s' }}>
          <Link href="/analyze" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:'1rem', letterSpacing:'.22em', textTransform:'uppercase', color:'var(--white)', background:'var(--red)', textDecoration:'none', padding:'1rem 2.6rem', display:'inline-block', transition:'transform .2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform='translateY(-2px)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform='none'}>
            Run Viabl Check →
          </Link>
          <a href="#tension" style={{ fontSize:'.82rem', color:'var(--dim)', letterSpacing:'.1em', textDecoration:'none', display:'flex', alignItems:'center', gap:'.4rem', transition:'color .2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color='var(--white)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color='var(--dim)'}>
            <span style={{ color:'var(--red)' }}>→</span> Why this exists
          </a>
        </div>

        {/* Aside stat */}
        <div style={{ position:'absolute', right:'5rem', top:'50%', transform:'translateY(-50%)', textAlign:'right', opacity: heroIn ? 1 : 0, transition:'opacity .7s ease 1s' }}>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'5rem', fontWeight:900, display:'block', lineHeight:1 }}>{heroPct}%</span>
          <span style={{ fontSize:'.75rem', letterSpacing:'.16em', color:'var(--dim)', textTransform:'uppercase', lineHeight:1.8 }}>
            of startups fail<br/>before product-<br/>market fit
          </span>
        </div>

        {/* Scroll indicator */}
        <div style={{ position:'absolute', bottom:'2rem', left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:'.5rem', opacity: heroIn ? 1 : 0, transition:'opacity .7s ease 1.1s' }}>
          <div style={{ width:'1px', height:'44px', background:'linear-gradient(to bottom,var(--red),transparent)', animation:'sp 2s ease-in-out infinite' }}/>
          <span style={{ fontSize:'.72rem', letterSpacing:'.3em', color:'var(--dim)', textTransform:'uppercase' }}>scroll</span>
        </div>
      </section>

      {/* ── TENSION ── */}
      <section id="tension" style={{ padding:'6rem clamp(1.5rem,7vw,7rem)', background:'var(--black)', position:'relative' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 80% 50%,rgba(200,16,46,.08) 0%,transparent 60%)', pointerEvents:'none' }}/>
        <div className="cine-tag">The Problem</div>
        <h2 className="r" style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(2.5rem,5vw,5rem)', fontWeight:900, lineHeight:1.08, maxWidth:'620px', marginBottom:'3rem' }}>
          Most founders discover<br/><em style={{ fontStyle:'italic', color:'var(--red)' }}>failure</em> the expensive way.
        </h2>
        {/* Stat cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2px' }}>
          {STATS.map((s, i) => <StatCard key={i} {...s} delay={i * .1} />)}
        </div>
      </section>

      {/* ── 9 DIMENSIONS ── */}
      <section style={{ padding:'6rem clamp(1.5rem,7vw,7rem)', background:'var(--surface)', borderTop:'1px solid rgba(255,255,255,.05)' }}>
        <div className="cine-tag">The Intelligence</div>
        <p className="r" style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.4rem,3.5vw,3.5rem)', fontWeight:400, fontStyle:'italic', color:'var(--dim)', marginBottom:'.4rem' }}>
          Before you build, <strong style={{ fontWeight:900, fontStyle:'normal', color:'var(--white)' }}>before you spend anything</strong>,
        </p>
        <h2 className="r" style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.4rem,3.5vw,3.5rem)', fontWeight:900, marginBottom:'2.5rem' }}>
          Scan <span style={{ color:'var(--red)' }}>9 dimensions</span> of viability.
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1px', background:'rgba(255,255,255,.06)' }}>
          {DIMS.map((d, i) => <DimCard key={d.n} {...d} delay={i * .04} />)}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding:'6rem clamp(1.5rem,7vw,7rem)', background:'var(--black)', borderTop:'1px solid rgba(255,255,255,.05)' }}>
        <div className="cine-tag">The Process</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5rem', alignItems:'start' }}>
          <div style={{ position:'sticky', top:'24vh' }}>
            <h2 className="r" style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(2.5rem,4.5vw,4.8rem)', fontWeight:900, lineHeight:1.05, marginBottom:'1.4rem' }}>
              Four minutes.<br/>Full verdict.
            </h2>
            <p className="r" style={{ fontSize:'.92rem', color:'var(--dim)', lineHeight:1.85, maxWidth:'320px' }}>
              No consultants. No surveys. Deep intelligence delivered before you commit to anything.
            </p>
          </div>
          <div>
            {[
              { n:'01', t:'Describe Your Idea',    d:'Concept, target market, and problem. Two minutes. No essays.' },
              { n:'02', t:'AI Scans 9 Dimensions', d:'The engine cross-references market data, competitive signals, and monetization patterns.' },
              { n:'03', t:'Free Preview',           d:'Instant viability score and key metrics. Zero signup. See the verdict first.' },
              { n:'04', t:'Unlock Full Report',     d:'Complete analysis, brand identity kit, GTM playbook. $19. One decision that saves thousands.' },
            ].map((step, i) => (
              <div key={step.n} className="step-row" style={{ display:'flex', gap:'1.6rem', padding:'2rem 0', borderBottom:'1px solid rgba(255,255,255,.07)', transitionDelay:`${i * .1}s` }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'2.8rem', fontWeight:900, color:'rgba(255,255,255,.06)', lineHeight:1, flexShrink:0, width:'42px' }}>{step.n}</div>
                <div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:'1rem', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:'.5rem', color:'var(--white)' }}>{step.t}</div>
                  <div style={{ fontSize:'.85rem', color:'var(--dim)', lineHeight:1.75 }}>{step.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TERMINAL ── */}
      <section style={{ padding:'0 clamp(1.5rem,7vw,7rem) 6rem', background:'var(--black)' }}>
        <div className="r" style={{ maxWidth:'660px', margin:'0 auto', border:'1px solid rgba(255,255,255,.08)', background:'#060606' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'.4rem', padding:'.65rem 1rem', borderBottom:'1px solid rgba(255,255,255,.07)', background:'#0C0C0C' }}>
            <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:'var(--red)' }}/>
            <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:'var(--gold)' }}/>
            <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#2a2a2a' }}/>
            <span style={{ fontSize:'.75rem', color:'var(--dim)', letterSpacing:'.1em', margin:'0 auto' }}>viabl · analysis engine v2.1</span>
          </div>
          <div ref={tbRef} style={{ padding:'1.4rem 1.6rem', minHeight:'240px', fontSize:'1rem', lineHeight:2, overflowY:'auto', maxHeight:'340px' }}>
            {termLines.map((raw, i) => {
              const idx = raw.indexOf('|'); const c = raw.slice(0,idx); const t = raw.slice(idx+1)
              return <span key={i} style={{ display:'block', color:lc(c), fontWeight: c==='tv'?500:400 }}>{t}</span>
            })}
            {termDone && <span style={{ display:'inline-block', width:'7px', height:'.85em', background:'var(--red)', verticalAlign:'text-bottom', animation:'blink 1s step-end infinite' }}/>}
          </div>
        </div>
      </section>

      {/* ── PROOF ── */}
      <section style={{ padding:'5rem clamp(1.5rem,7vw,7rem)', background:'var(--surface)', borderTop:'1px solid rgba(255,255,255,.05)', borderBottom:'1px solid rgba(255,255,255,.05)' }}>
        <p className="r" style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.3rem,2.8vw,2.8rem)', fontWeight:400, fontStyle:'italic', color:'var(--dim)', marginBottom:'3rem', textAlign:'center' }}>
          Numbers from <strong style={{ fontStyle:'normal', fontWeight:900, color:'var(--white)' }}>real founders</strong> who ran the check.
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1px', background:'rgba(255,255,255,.06)' }}>
          {[
            { n:'3,800+', l:'Ideas Analyzed' },
            { n:'60s',    l:'Average Report Time' },
            { n:'9',      l:'Dimensions Scanned' },
            { n:'$19',    l:'Full Report' },
          ].map((stat, i) => (
            <div key={stat.l} className="r" style={{ background:'var(--surface)', padding:'2.5rem 1.6rem', textAlign:'center', transitionDelay:`${i * .08}s` }}>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(2.5rem,4.5vw,4.5rem)', fontWeight:900, display:'block', marginBottom:'.4rem' }}>{stat.n}</span>
              <span style={{ fontSize:'.75rem', letterSpacing:'.2em', color:'var(--dim)', textTransform:'uppercase' }}>{stat.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINALE ── */}
      <section style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', background:'var(--black)', overflow:'hidden', position:'relative', padding:'5rem clamp(1.5rem,7vw,7rem)' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center,rgba(200,16,46,.13) 0%,transparent 60%)' }}/>
        <div className="r" style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontSize:'.72rem', letterSpacing:'.42em', textTransform:'uppercase', color:'var(--red)', marginBottom:'1.6rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'.6rem' }}>
            <span style={{ display:'block', width:'20px', height:'1px', background:'var(--red)' }}/>
            The Choice
            <span style={{ display:'block', width:'20px', height:'1px', background:'var(--red)' }}/>
          </div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, lineHeight:.88, marginBottom:'2.5rem' }}>
            <span style={{ display:'block', fontSize:'clamp(1.6rem,4vw,4rem)', fontStyle:'italic', color:'var(--dim)' }}>Know before</span>
            <span style={{ display:'block', fontSize:'clamp(4rem,12vw,12rem)', color:'var(--white)', letterSpacing:'-.02em' }}>YOU BUILD.</span>
            <span style={{ display:'block', fontSize:'clamp(1.6rem,4vw,4rem)', fontStyle:'italic', color:'var(--red)' }}>or pay the tuition later.</span>
          </h2>
          <p style={{ fontSize:'1rem', color:'var(--dim)', marginBottom:'2.2rem', letterSpacing:'.06em' }}>
            Free preview · 60 seconds · No signup required
          </p>
          <Link href="/analyze" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:'1rem', letterSpacing:'.25em', textTransform:'uppercase', color:'var(--white)', background:'var(--red)', textDecoration:'none', padding:'1.1rem 4rem', display:'inline-block', transition:'background .25s, color .25s' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background='var(--white)'; el.style.color='var(--red)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background='var(--red)'; el.style.color='var(--white)' }}>
            Run Viabl Check →
          </Link>
          <span style={{ display:'block', fontSize:'.72rem', color:'var(--dim)', marginTop:'1.2rem', letterSpacing:'.14em' }}>
            $19 to unlock the full report · Instant delivery · No fluff
          </span>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding:'1.4rem clamp(1.5rem,7vw,7rem)', borderTop:'1px solid rgba(255,255,255,.07)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:'1rem', letterSpacing:'.14em', color:'var(--dim)' }}>
          VIABL<em style={{ fontStyle:'normal', color:'var(--red)' }}>.</em>
        </div>
        <div style={{ fontSize:'.72rem', color:'var(--dim)', letterSpacing:'.07em' }}>© 2026 Viabl — Know Before You Build</div>
        <div style={{ display:'flex', gap:'1.6rem' }}>
          {[['Privacy','/privacy'],['Terms','/terms']].map(([l,href]) => (
            <a key={l} href={href} style={{ fontSize:'.72rem', color:'var(--dim)', textDecoration:'none', letterSpacing:'.1em', transition:'color .2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color='var(--white)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color='var(--dim)'}>
              {l}
            </a>
          ))}
          <Link href="/analyze" style={{ fontSize:'.72rem', color:'var(--dim)', textDecoration:'none', letterSpacing:'.1em', transition:'color .2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color='var(--white)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color='var(--dim)'}>
            Analyze →
          </Link>
        </div>
      </footer>
    </main>
  )
}

/* ── STAT CARD ── */
function StatCard({ n, s, l1, l2, delay }: { n:number; s:string; l1:string; l2:string; delay:number }) {
  const [val, setVal]   = useState(0)
  const [vis, setVis]   = useState(false)
  const ref             = useRef<HTMLDivElement>(null)
  const fired           = useRef(false)

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !fired.current) {
          fired.current = true; setVis(true)
          let v = 0; const step = Math.max(n / 55, 1)
          const t = setInterval(() => {
            v += step; if (v >= n) { v = n; clearInterval(t) }
            setVal(Math.floor(v))
          }, 28)
        }
      })
    }, { threshold: 0.2 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [n])

  return (
    <div ref={ref} className="ts-card" style={{ transitionDelay:`${delay}s` }}>
      <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(3rem,5.5vw,5.5rem)', fontWeight:900, display:'block', marginBottom:'.4rem' }}>{val}{s}</span>
      <span style={{ fontSize:'.62rem', letterSpacing:'.08em', color:'var(--dim)', lineHeight:1.75, display:'block' }}>{l1}</span>
      <span style={{ fontSize:'.62rem', letterSpacing:'.08em', color:'var(--dim)', lineHeight:1.75, display:'block' }}>{l2}</span>
    </div>
  )
}

/* ── DIM CARD ── */
function DimCard({ n, t, d, delay }: { n:string; t:string; d:string; delay:number }) {
  const [hov, setHov] = useState(false)
  return (
    <div className="dc" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:'var(--surface)', padding:'1.8rem 1.6rem', position:'relative', overflow:'hidden', transitionDelay:`${delay}s` }}>
      <div style={{ position:'absolute', top:0, left:0, width:'100%', height:'2px', background:'var(--red)', transform: hov?'scaleX(1)':'scaleX(0)', transformOrigin:'left', transition:'transform .3s ease' }}/>
      <div style={{ fontSize:'.72rem', letterSpacing:'.3em', color:'var(--red)', marginBottom:'.7rem' }}>{n}</div>
      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:'.95rem', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:'.5rem', color:'var(--white)' }}>{t}</div>
      <div style={{ fontSize:'.64rem', color:'var(--dim)', lineHeight:1.75 }}>{d}</div>
    </div>
  )
}
