'use client'
import { cn } from '@/lib/utils'
interface P { name:string; price:number; description:string; items:string[]; featured?:boolean; badge?:string; disabled?:boolean; ctaLabel?:string; onSelect?:()=>void }
export function TierCard({ name, price, description, items, featured, badge, disabled, ctaLabel, onSelect }:P) {
  return (
    <div className={cn('p-6 relative transition-colors cursor-pointer', featured?'bg-acid':'bg-s1 hover:bg-s2')} onClick={!disabled?onSelect:undefined}>
      {badge && <div className={cn('font-mono text-[8px] tracking-[0.18em] uppercase px-2 py-[3px] inline-block mb-3', featured?'bg-black text-acid':'bg-s3 text-muted1')}>{badge}</div>}
      <div className={cn('font-bebas text-[18px] mb-1', featured?'text-black':'text-text')}>{name}</div>
      <div className={cn('font-bebas text-[44px] leading-none mb-3', featured?'text-black':'text-acid')}>{price===0?'$0':`$${price}`}</div>
      <div className={cn('font-mono text-[10px] mb-3 leading-relaxed', featured?'text-black/70':'text-muted1')}>{description}</div>
      <ul>{items.map(i=><li key={i} className="flex items-center gap-1.5 font-mono text-[10px] mb-[3px]"><span className={featured?'text-black':'text-acid'}>—</span><span className={featured?'text-black/80':'text-muted1'}>{i}</span></li>)}</ul>
      <button disabled={disabled} className={cn('w-full mt-4 py-[10px] font-bebas text-[14px] tracking-[0.1em] border-none', featured?'bg-black text-acid':'bg-s3 text-text', disabled&&'opacity-30 cursor-not-allowed', !disabled&&'hover:opacity-80')}>
        {ctaLabel||'Unlock →'}
      </button>
    </div>
  )
}
