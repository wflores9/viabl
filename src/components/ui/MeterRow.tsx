'use client'
interface P { label:string; value:number; isCompetition?:boolean; isRisk?:boolean }
export function MeterRow({ label, value, isCompetition=false, isRisk=false }:P) {
  const d = (isCompetition||isRisk) ? 100-value : value
  const c = d>=70 ? 'var(--ok)' : d>=45 ? 'var(--yellow)' : 'var(--danger)'
  return (
    <div className="flex items-center gap-3 mb-[11px]">
      <div className="font-mono text-[10px] text-muted2 w-[140px] flex-shrink-0">{label}</div>
      <div className="flex-1 h-[3px] bg-border2"><div className="h-full transition-all duration-[1200ms]" style={{width:`${d}%`,background:c}}/></div>
      <div className="font-mono text-[10px] font-medium w-[26px] text-right" style={{color:c}}>{d}</div>
    </div>
  )
}
