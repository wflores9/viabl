'use client'
import { useViablStore } from '@/store/viabl'
import { INDUSTRIES } from '@/types'
export function IntakeForm() {
  const { ideaText, industry, target, setInput } = useViablStore()
  return (
    <div className="relative">
      <div className="absolute pointer-events-none" style={{ top:'-60px',left:'-40px',right:'-40px',bottom:'-60px', background:'radial-gradient(ellipse at 50% 40%,rgba(212,255,0,0.04) 0%,transparent 70%)' }}/>
      <div className="accent-line"/>
      <div className="relative" style={{ background:'var(--s1)', border:'1px solid var(--border)', padding:'36px 32px' }}>
        <div className="absolute bottom-0 right-0 pointer-events-none" style={{ width:'60px',height:'60px',borderRight:'1px solid rgba(212,255,0,0.08)',borderBottom:'1px solid rgba(212,255,0,0.08)' }}/>
        <div className="absolute top-0 left-0 pointer-events-none" style={{ width:'40px',height:'40px',borderLeft:'1px solid rgba(212,255,0,0.08)',borderTop:'1px solid rgba(212,255,0,0.08)' }}/>

        <div className="mb-2">
          <div className="font-mono text-[9px] tracking-[0.22em] uppercase flex items-center gap-3 mb-3" style={{ color:'var(--acid)' }}>
            YOUR BUSINESS IDEA
            <div style={{ flex:1,height:'1px',background:'linear-gradient(90deg,var(--border),transparent)' }}/>
          </div>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-300"
              style={{ background:ideaText.length>0?'linear-gradient(180deg,var(--acid),var(--acid2))':'var(--border2)', boxShadow:ideaText.length>0?'0 0 8px rgba(212,255,0,0.3)':'none' }}/>
            <textarea value={ideaText} onChange={e=>setInput('ideaText',e.target.value)}
              placeholder="e.g. A subscription app that helps restaurant owners track permits and licenses..."
              style={{ width:'100%',background:ideaText.length>0?'rgba(212,255,0,0.02)':'var(--bg)',border:'none',borderBottom:`1px solid ${ideaText.length>0?'rgba(212,255,0,0.15)':'var(--border2)'}`,color:'var(--text)',fontFamily:'var(--font-dm-mono),monospace',fontSize:'14px',lineHeight:'1.8',padding:'16px 16px 16px 20px',outline:'none',resize:'none',height:'130px',transition:'all 0.25s ease',WebkitAppearance:'none',appearance:'none' }}/>
            {ideaText.length > 0 && (
              <div className="absolute bottom-2 right-3 font-mono text-[9px]" style={{ color:ideaText.length>=20?'var(--ok)':'var(--warn)' }}>
                {ideaText.length>=20?'✓':`${20-ideaText.length} more`}
              </div>
            )}
          </div>
        </div>

        <div className="mb-2 mt-6">
          <div className="font-mono text-[9px] tracking-[0.22em] uppercase flex items-center gap-3 mb-3" style={{ color:'var(--m2)' }}>
            INDUSTRY
            <div style={{ flex:1,height:'1px',background:'linear-gradient(90deg,var(--border),transparent)' }}/>
          </div>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ background:industry?'var(--border2)':'var(--border)' }}/>
            <select value={industry} onChange={e=>setInput('industry',e.target.value)}
              style={{ width:'100%',background:industry?'rgba(26,23,20,0.8)':'var(--bg)',border:'none',borderBottom:`1px solid ${industry?'rgba(212,255,0,0.12)':'var(--border2)'}`,color:industry?'var(--text)':'var(--m2)',fontFamily:'var(--font-dm-mono),monospace',fontSize:'14px',padding:'14px 40px 14px 20px',outline:'none',appearance:'none',WebkitAppearance:'none',cursor:'pointer',transition:'all 0.2s' }}>
              <option value="">Select industry...</option>
              {INDUSTRIES.map(ind=><option key={ind} value={ind}>{ind}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 pointer-events-none" style={{ transform:'translateY(-50%)',color:'var(--m2)',fontSize:'10px' }}>▼</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="font-mono text-[9px] tracking-[0.22em] uppercase flex items-center gap-3 mb-3" style={{ color:'var(--m2)' }}>
            TARGET CUSTOMER
            <div style={{ flex:1,height:'1px',background:'linear-gradient(90deg,var(--border),transparent)' }}/>
          </div>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ background:target?'var(--border2)':'var(--border)' }}/>
            <input type="text" value={target} onChange={e=>setInput('target',e.target.value)}
              placeholder="e.g. Restaurant owners, SMEs, freelancers..."
              style={{ width:'100%',background:target?'rgba(26,23,20,0.8)':'var(--bg)',border:'none',borderBottom:`1px solid ${target?'rgba(212,255,0,0.12)':'var(--border2)'}`,color:'var(--text)',fontFamily:'var(--font-dm-mono),monospace',fontSize:'14px',padding:'14px 16px 14px 20px',outline:'none',transition:'all 0.2s',WebkitAppearance:'none',appearance:'none' }}/>
          </div>
        </div>
      </div>
    </div>
  )
}
