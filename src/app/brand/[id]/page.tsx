import Link from'next/link'
import{Navbar}from'@/components/ui/Navbar'
import{SectionLabel}from'@/components/ui/SectionLabel'
export default function BrandPage({params}:{params:{id:string}}){
  return(<main><Navbar step={5}/>
    <div className="max-w-[1100px] mx-auto px-6 py-6 pb-20">
      <div className="bg-s1 border border-border p-9 mb-px grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-10 items-center">
        <div><div className="font-mono text-[9px] tracking-[0.2em] uppercase text-acid mb-2">⑤ Brand Identity System</div><h1 className="font-bebas text-[52px] mb-2">YOUR BRAND,<br/>BUILT FOR YOU</h1><p className="font-mono text-[12px] text-muted1 leading-[1.8]">Logos, colors, typography, voice, and social assets — all generated from your idea.</p></div>
        <div className="bg-acid/5 border border-acid/20 p-5 text-center"><div className="font-mono text-[9px] tracking-[0.18em] uppercase text-muted2 mb-2">Unlock with Founder Pack</div><div className="font-bebas text-[40px] text-acid mb-2">$79</div><Link href={`/results/${params.id}`} className="block bg-acid text-black font-bebas text-[18px] tracking-[0.1em] py-3 text-center">UNLOCK BRAND KIT →</Link></div>
      </div>
      <SectionLabel className="py-4">Brand Colors</SectionLabel>
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-px bg-border mb-px">
        {[['#d4ff00','Acid'],['#0e0c0a','Void'],['#f2ede8','Cream'],['#1a1714','Carbon'],['#ef4444','Risk'],['#22c55e','Go']].map(([hex,name])=>(
          <div key={hex}><div className="h-[72px]" style={{background:hex}}/><div className="bg-s1 p-3"><div className="font-mono text-[9px] tracking-[0.12em] uppercase text-muted1 mb-1">{name}</div><div className="font-mono text-[11px]">{hex}</div></div></div>
        ))}
      </div>
      <SectionLabel className="py-4">Brand Voice</SectionLabel>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border mb-px">
        {[['Tone','Direct. Ruthless. Honest.','No fluff. Tell founders the truth.'],['Personality','Analyst meets streetwear','Bloomberg Terminal dressed like OFF-WHITE.'],['Never Say','"Great idea!" or "Maybe try..."','No hedging. Viabl sharpens thinking.']].map(([l,v,d])=>(
          <div key={l} className="bg-s1 p-5"><div className="font-mono text-[9px] tracking-[0.16em] uppercase text-acid mb-2.5">{l}</div><div className="font-mono text-[13px] mb-2">{v}</div><div className="font-mono text-[11px] text-muted1 leading-[1.7]">{d}</div></div>
        ))}
      </div>
      <SectionLabel className="py-4">ZenBusiness Partner</SectionLabel>
      <div className="bg-s1 border border-border p-8">
        <div className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.18em] uppercase text-[#4488ff] border border-[#4488ff]/25 bg-[#4488ff]/6 px-3 py-1 mb-4">🤝 Verified Partner</div>
        <h3 className="font-bebas text-[28px] mb-2">READY TO MAKE IT OFFICIAL?</h3>
        <p className="font-mono text-[12px] text-muted1 leading-[1.8] mb-4 max-w-[500px]">Form your LLC the same day you get your Viabl report. Trusted by 850K+ entrepreneurs across all 50 states.</p>
        <a href="https://www.zenbusiness.com" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#4488ff] text-white font-bebas text-[18px] tracking-[0.1em] px-6 py-3">FORM YOUR LLC →</a>
      </div>
    </div>
  </main>)
}
