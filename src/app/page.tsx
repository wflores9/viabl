import Link from 'next/link'
import { Navbar } from '@/components/ui/Navbar'
export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <section className="max-w-[1100px] mx-auto px-6 pt-14 pb-12">
        <div className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] uppercase text-acid border border-acid/20 bg-acid/4 px-3.5 py-[5px] mb-11">
          <span className="w-[5px] h-[5px] bg-acid rounded-full" style={{animation:'pulse 2s infinite'}}/>
          AI Analysis · Brand Identity · Launch Kit
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-14 items-end">
          <div>
            <h1 className="font-bebas leading-[0.87] mb-6" style={{fontSize:'clamp(72px,9vw,136px)'}}>
              <span className="block text-text">WILL YOUR</span>
              <span className="block" style={{WebkitTextStroke:'1.5px rgba(242,237,232,0.25)',color:'transparent'}}>IDEA</span>
              <span className="block text-acid">SURVIVE?</span>
            </h1>
            <p className="font-mono text-[13px] text-muted1 leading-[1.9] max-w-[420px] mb-8">
              Describe your business idea. Get a full AI viability report in 60 seconds — market size, competition, risks, and a complete brand identity.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              {['Market Size','Competition','Revenue Model','Go/No-Go Score','Brand Identity'].map(f=>(
                <div key={f} className="flex items-center gap-1.5 font-mono text-[10px] text-muted2 tracking-[0.1em] uppercase">
                  <span className="text-acid">✓</span>{f}
                </div>
              ))}
            </div>
            <div className="flex gap-2.5 flex-wrap">
              <Link href="/analyze" className="bg-acid text-black font-bebas text-[20px] tracking-[0.1em] px-9 py-3.5 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(212,255,0,0.28)]">
                RUN VIABL CHECK →
              </Link>
              <Link href="/results/sample" className="bg-transparent text-muted1 border border-border2 font-mono text-[11px] tracking-[0.1em] px-6 py-3.5 transition-all hover:text-text hover:border-muted1">
                See Sample Report
              </Link>
            </div>
          </div>
          <div className="bg-s1 border border-border overflow-hidden">
            <div className="bg-s2 px-4 py-2.5 border-b border-border flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-danger"/>
              <div className="w-2 h-2 rounded-full bg-yellow"/>
              <div className="w-2 h-2 rounded-full bg-ok"/>
              <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-muted2 ml-1">viabl analysis engine</span>
            </div>
            <div className="p-4 font-mono text-[11px] leading-[2]">
              <div className="flex gap-2"><span className="text-acid">›</span><span className="text-muted1">analyzing idea #0042</span></div>
              <div className="flex gap-2"><span className="text-acid">›</span><span className="text-ok">✓</span><span className="text-muted1"> Market Demand ........ 82</span></div>
              <div className="flex gap-2"><span className="text-acid">›</span><span className="text-ok">✓</span><span className="text-muted1"> Competition .......... 61</span></div>
              <div className="flex gap-2"><span className="text-acid">›</span><span className="text-ok">✓</span><span className="text-muted1"> Moat / Edge .......... 78</span></div>
              <div className="flex gap-2"><span className="text-acid">›</span><span className="text-warn">!</span><span className="text-muted1"> Execution Risk ....... 44</span></div>
              <div className="flex gap-2"><span className="text-acid">›</span><span className="text-ok">✓</span><span className="text-muted1"> Monetization ........ 88</span></div>
              <div className="flex gap-2 text-muted2"><span>›</span><span>━━━━━━━━━━━━━━━━━━━━━━━</span></div>
              <div className="flex gap-2"><span className="text-acid">›</span><span className="text-muted1">SCORE: </span><span className="text-acid font-medium">74 · VIABLE</span></div>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-[1100px] mx-auto px-6 pb-16">
        <div className="section-label">How it works</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {[['01','Describe Your Idea','Your idea, industry, target. 60 seconds.'],['02','AI Scans 9 Dimensions','Market, competition, moat, risks, monetization.'],['03','Free Preview','Score + key metrics free. No signup.'],['04','Unlock Full Report','Full analysis, brand identity, pitch deck, GTM.']].map(([n,t,d])=>(
            <div key={n} className="bg-s1 p-7 relative overflow-hidden hover:bg-s2 transition-colors">
              <div className="absolute right-3 bottom-2 font-bebas text-[72px] text-acid/4 leading-none">{n}</div>
              <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-acid mb-3.5">{n} —</div>
              <div className="font-mono text-[12px] mb-2">{t}</div>
              <div className="font-mono text-[11px] text-muted1 leading-[1.75]">{d}</div>
            </div>
          ))}
        </div>
      </section>
      <footer className="border-t border-border px-6 py-6 flex justify-between items-center font-mono text-[10px] text-muted2">
        <div className="font-bebas text-[18px] text-muted2">VIABL.</div>
        <span>© 2026 Viabl — Know before you build</span>
        <span>Privacy · Terms</span>
      </footer>
    </main>
  )
}
