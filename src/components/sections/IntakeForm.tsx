'use client'
import { useViablStore } from '@/store/viabl'
import { INDUSTRIES } from '@/types'
export function IntakeForm() {
  const { ideaText, industry, target, setInput } = useViablStore()
  return (
    <div>
      <div className="accent-line"/>
      <div className="card" style={{padding:'32px'}}>
        <div className="section-label">Your business idea</div>
        <textarea value={ideaText} onChange={e=>setInput('ideaText',e.target.value)}
          placeholder="e.g. A subscription app that helps restaurant owners track permits and licenses..."
          className="w-full bg-bg font-mono text-[13px] leading-[1.7] p-[14px_16px] outline-none resize-none h-[110px]"
          style={{border:'1px solid',borderColor:ideaText.length>0?'var(--acid)':'var(--border2)'}}/>
        <div className="section-label mt-4">Industry</div>
        <select value={industry} onChange={e=>setInput('industry',e.target.value)}
          className="w-full bg-bg border border-border2 font-mono text-[13px] p-[14px_16px] outline-none appearance-none"
          style={{color:industry?'var(--text)':'var(--m2)'}}>
          <option value="">Select industry...</option>
          {INDUSTRIES.map(i=><option key={i} value={i}>{i}</option>)}
        </select>
        <div className="section-label mt-4">Target customer</div>
        <input type="text" value={target} onChange={e=>setInput('target',e.target.value)}
          placeholder="e.g. Restaurant owners, SMEs..."
          className="w-full bg-bg border border-border2 font-mono text-[13px] p-[14px_16px] outline-none"/>
      </div>
    </div>
  )
}
