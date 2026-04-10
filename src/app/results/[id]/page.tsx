'use client'
import{useState}from'react'
import{useRouter}from'next/navigation'
import{Navbar}from'@/components/ui/Navbar'
import{MeterRow}from'@/components/ui/MeterRow'
import{ModelTag}from'@/components/ui/ModelTag'
import{TierCard}from'@/components/ui/TierCard'
import{SectionLabel}from'@/components/ui/SectionLabel'
import{useViablStore}from'@/store/viabl'
import{TIERS}from'@/types'
import type{AnalysisResult,Tier}from'@/types'
import{cn}from'@/lib/utils'
const SAMPLE:AnalysisResult={overall_score:78,verdict:'GO',idea_summary:'Permit & License SaaS for Restaurants',one_liner:'"Compliance automation for food operators who cannot afford to get shut down"',summary:'Large underserved market with acute pain and high willingness to pay. Low direct competition in SMB segment.',market_size:'Large and underserved. 1M+ US restaurants each managing 8-15 permits annually. Compliance software market $4.2B growing 12% YoY.',demand_signal:'Strong. 60% of closures involve compliance issues. Shutdown costs average $15K-$50K. Pain directly tied to revenue loss.',competition:'Fragmented. Toast and Square touch adjacent problems. Specialized players target enterprise. SMB segment is wide open.',metrics:{'Market Demand':85,'Competition':35,'Revenue Potential':80,'Execution Risk':52,'Moat / Edge':70,'Customer Acquisition':65,'Regulatory':40,'Tech Feasibility':82,'Founder-Market Fit':68},revenue_models:['SaaS Subscription','Per-location pricing','Annual plans','Add-on services'],mrr_potential:'$49-$149/mo per location. At 500 locations, $25K-$75K MRR.',top_risks:['Data sourcing — permit databases vary by municipality. 18-month engineering project.','Restaurant tech adoption is low. Long sales cycles, high CS overhead.','Toast or Square could build this as a free feature.'],next_steps:["Cold email 20 restaurant owners. Ask how they track permits. Don't pitch software.","Build a free Permit Expiry Calculator landing page. Collect emails.","Partner with a restaurant accountant. Rev-share gets you 50 customers fast."],dimensions:[],recommendations:{gtm:[],tools:[],first_30_days:[]}}
export default function ResultsPage({params}:{params:{id:string}}){
  const router=useRouter()
  const{analysisResult,setSelectedTier}=useViablStore()
  const[copilotOpen,setCopilotOpen]=useState(false)
  const r=analysisResult||SAMPLE
  const sColor=r.overall_score>=70?'var(--acid)':r.overall_score>=45?'var(--yellow)':'var(--danger)'
  const vBg=r.verdict==='GO'?'#16a34a':r.verdict==='MAYBE'?'#d97706':'#dc2626'
  async function handleSelectTier(tier:Tier){
    if(tier==='free')return
    setSelectedTier(tier)
    const res=await fetch('/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({analysisId:params.id,tier})})
    const data=await res.json()
    if(data.url)window.location.href=data.url
  }
  return(<main><Navbar step={4}/>
    <div className="max-w-[1100px] mx-auto px-6 py-6 pb-20">
      <div className="accent-line"/>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-px bg-border mb-px">
        <div className="card flex gap-8 items-start flex-wrap relative" style={{paddingLeft:'44px'}}>
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-acid"/>
          <div className="font-bebas text-[108px] leading-none flex-shrink-0" style={{color:sColor}}>{r.overall_score}</div>
          <div className="flex-1 min-w-[200px]">
            <div className="font-bebas text-[32px] tracking-[0.04em] mb-2.5">{r.verdict==='GO'?'STRONG GO':r.verdict==='MAYBE'?'VIABLE WITH CONDITIONS':'HIGH RISK'}</div>
            <div className="font-mono text-[12px] text-muted1 leading-[1.85] max-w-[480px]">{r.summary}</div>
            <div className="font-bebas text-[13px] tracking-[0.15em] px-3.5 py-1 mt-3 inline-block" style={{background:vBg,color:'#fff'}}>{r.verdict}</div>
          </div>
        </div>
        <div className="card flex flex-col gap-3.5">
          {[['ID',`#${params.id.substring(0,8).toUpperCase()}`],['Score',`${r.overall_score}/100`],['Verdict',r.verdict]].map(([k,v])=>(
            <div key={k}><div className="font-mono text-[9px] tracking-[0.16em] uppercase text-muted2 mb-[3px]">{k}</div><div className={cn('font-mono text-[12px]',k==='Score'&&'text-acid')}>{v}</div></div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border mb-px">
        <div className="card"><SectionLabel>Market Size</SectionLabel><p className="font-mono text-[13px] leading-[1.75] text-muted1">{r.market_size}</p></div>
        <div className="card"><SectionLabel>Demand Signal</SectionLabel><p className="font-mono text-[13px] leading-[1.75] text-muted1">{r.demand_signal}</p></div>
      </div>
      <div className="card mb-px"><SectionLabel>Competitive Landscape</SectionLabel><p className="font-mono text-[13px] leading-[1.75] text-muted1">{r.competition}</p></div>
      <div className="card mb-px"><SectionLabel>Analysis Metrics</SectionLabel>{Object.entries(r.metrics).map(([k,v])=><MeterRow key={k} label={k} value={v} isCompetition={k==='Competition'} isRisk={k==='Execution Risk'||k==='Regulatory'}/>)}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border mb-px">
        <div className="card"><SectionLabel>Revenue Models</SectionLabel><div className="mb-3.5">{r.revenue_models.map(m=><ModelTag key={m} label={m}/>)}</div><SectionLabel className="mt-4">MRR Potential</SectionLabel><p className="font-mono text-[13px] leading-[1.75] text-muted1">{r.mrr_potential}</p></div>
        <div className="card"><SectionLabel>Top Risks</SectionLabel>{r.top_risks.map((risk,i)=><div key={i} className="flex gap-2.5 mb-2.5 font-mono text-[13px] leading-[1.65] text-muted1"><div className="w-[5px] h-[5px] rounded-full bg-warn flex-shrink-0 mt-[7px]"/><div>{risk}</div></div>)}</div>
      </div>
      <div className="card mb-px"><SectionLabel>Your Next 3 Moves</SectionLabel>{r.next_steps.map((s,i)=>(<div key={i} className={cn('flex gap-4 py-3.5 items-start',i<2&&'border-b border-border')}><div className="font-bebas text-[20px] text-acid flex-shrink-0 leading-[1.4]">0{i+1}</div><div className="font-mono text-[13px] leading-[1.7] text-muted1 pt-0.5">{s}</div></div>))}</div>
      <div className="relative">
        <div className="pointer-events-none select-none blur-[5px] flex flex-col gap-px bg-border">{[...Array(4)].map((_,i)=><div key={i} className="bg-s1 p-5 grid grid-cols-[160px_1fr] gap-3.5"><div><div className="h-[10px] bg-s2 w-[70%] mb-1.5"/><div className="h-[10px] bg-s2 w-[50%]"/></div><div><div className="h-[10px] bg-s2 w-full mb-1.5"/><div className="h-[10px] bg-s2 w-[85%] mb-1.5"/><div className="h-[10px] bg-s2 w-[65%]"/></div></div>)}</div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 pt-20 pb-9" style={{background:'linear-gradient(to bottom,transparent,rgba(14,12,10,0.75) 18%,rgba(14,12,10,0.97) 32%)'}}>
          <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted1 mb-5">7 dimensions locked · Full brand identity locked</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border w-full max-w-[960px] mb-3.5">
            {TIERS.map(tier=><TierCard key={tier.id} name={tier.name} price={tier.price} description={tier.description} items={tier.items} featured={tier.featured} badge={tier.featured?'Best Value':undefined} disabled={tier.id==='free'} ctaLabel={tier.id==='free'?'Current Plan':'Unlock →'} onSelect={()=>handleSelectTier(tier.id)}/>)}
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-3"><button onClick={()=>router.push('/analyze')} className="bg-transparent text-muted1 border border-border2 font-mono text-[11px] tracking-[0.1em] uppercase px-5 py-3 hover:text-text hover:border-muted1">← Analyze another idea</button></div>
    </div>
    <button onClick={()=>setCopilotOpen(!copilotOpen)} className="fixed bottom-6 right-6 z-[300] bg-bg border border-acid text-acid px-4 py-2.5 font-mono text-[9px] tracking-[0.16em] uppercase flex items-center gap-2 hover:bg-acid/6">
      <span className="w-[5px] h-[5px] bg-acid rounded-full flex-shrink-0" style={{animation:'pulse 2s infinite'}}/>{'>'} ASK VIABL
    </button>
    {copilotOpen&&(<div className="fixed bottom-16 right-6 w-[300px] bg-s1 border border-border p-5 z-[300]">
      <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-muted2 mb-3.5">Viabl Copilot</div>
      {['What does my execution risk score mean?','How do I improve my competition score?','What should I do in the first 30 days?'].map(q=><div key={q} className="font-mono text-[10px] text-muted1 p-2 border border-border2 mb-1.5 cursor-pointer hover:border-acid hover:text-text">{q}</div>)}
      <input type="text" placeholder="> ask anything..." className="w-full bg-s2 border border-border2 font-mono text-[12px] p-2.5 outline-none mt-2 focus:border-acid"/>
    </div>)}
  </main>)
}
