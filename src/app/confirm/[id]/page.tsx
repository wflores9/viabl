'use client'
import Link from'next/link'
import{Navbar}from'@/components/ui/Navbar'
import{useViablStore}from'@/store/viabl'
import{TIERS}from'@/types'
export default function ConfirmPage({params}:{params:{id:string}}){
  const{selectedTier}=useViablStore()
  const tier=TIERS.find(t=>t.id===selectedTier)||TIERS[1]
  return(<main><Navbar step={7}/>
    <div className="max-w-[700px] mx-auto px-6 py-12 pb-20 text-center">
      <div className="w-[76px] h-[76px] border border-acid rounded-full flex items-center justify-center mx-auto mb-9">
        <svg viewBox="0 0 40 40" className="w-8 h-8" stroke="#d4ff00" fill="none" strokeWidth="2.5" strokeDasharray="40" strokeDashoffset="40" style={{animation:'drawCheck 0.4s 0.45s ease forwards'}}><polyline points="8,20 16,28 32,12"/></svg>
      </div>
      <h1 className="font-bebas text-[64px] text-acid tracking-[0.03em] leading-[0.9] mb-3">PAYMENT<br/>CONFIRMED</h1>
      <p className="font-mono text-[13px] text-muted1 mb-10 leading-[1.9]">Your full report is ready. Check your inbox.</p>
      <div className="bg-s1 border border-border p-7 text-left mb-6">
        {[['Order ID',`#VBL-${params.id.substring(0,8).toUpperCase()}`],['Product',`Viabl ${tier.name}`],['Amount',`$${tier.price}.00`],['Card','Visa •••• 4242']].map(([k,v])=>(
          <div key={k} className="flex justify-between py-2.5 border-b border-border last:border-0">
            <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-muted2">{k}</span>
            <span className={`font-mono text-[12px] ${k==='Amount'?'text-acid':''}`}>{v}</span>
          </div>
        ))}
      </div>
      <div className="bg-acid/4 border border-acid/18 p-6 flex items-center justify-between mb-6">
        <div className="text-left"><div className="font-mono text-[13px] mb-1">Viabl_Report_{params.id.substring(0,8)}.pdf</div><div className="font-mono text-[10px] text-muted2">2.4 MB · PDF · Ready</div></div>
        <button className="bg-acid text-black font-bebas text-[17px] tracking-[0.1em] px-6 py-3">↓ DOWNLOAD</button>
      </div>
      <div className="bg-acid/4 border border-acid/18 p-6 text-left mb-6">
        <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-acid mb-2">Next Step Unlocked</div>
        <div className="font-bebas text-[22px] tracking-[0.04em] mb-2">YOUR BRAND IDENTITY IS READY</div>
        <div className="font-mono text-[12px] text-muted1 mb-4">Logos, colors, typography, voice, and social assets.</div>
        <Link href={`/brand/${params.id}`} className="bg-acid text-black font-bebas text-[17px] tracking-[0.1em] px-6 py-3 inline-block">VIEW BRAND GUIDE →</Link>
      </div>
      <div className="flex gap-2.5 justify-center">
        <Link href="/analyze" className="bg-transparent text-muted1 border border-border2 font-mono text-[10px] px-5 py-3 hover:text-text hover:border-muted1">← Analyze Another</Link>
        <Link href={`/results/${params.id}`} className="bg-transparent text-muted1 border border-border2 font-mono text-[10px] px-5 py-3 hover:text-text hover:border-muted1">View Report</Link>
      </div>
    </div>
    <style>{`@keyframes drawCheck{to{stroke-dashoffset:0}}`}</style>
  </main>)
}
