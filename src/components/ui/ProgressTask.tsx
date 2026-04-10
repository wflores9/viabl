'use client'
import { cn } from '@/lib/utils'
interface P { emoji:string; name:string; status:'queued'|'running'|'done'; duration?:string }
export function ProgressTask({ emoji, name, status, duration }:P) {
  return (
    <div className="grid grid-cols-[36px_1fr_72px] gap-3.5 items-center py-3 border-b border-border last:border-0">
      <div className={cn('w-8 h-8 border flex items-center justify-center text-[13px] flex-shrink-0', status==='done'&&'bg-acid border-acid', status==='running'&&'border-acid', status==='queued'&&'border-border2')}>
        {status==='done'?'✓':emoji}
      </div>
      <div>
        <div className="font-mono text-[12px]">{name}</div>
        <div className={cn('font-mono text-[9px] tracking-[0.12em] uppercase', status==='done'&&'text-ok', status==='running'&&'text-acid', status==='queued'&&'text-muted2')}>
          {status==='done'?'Complete':status==='running'?'Running...':'Queued'}
        </div>
      </div>
      <div className="font-mono text-[11px] text-muted2 text-right">{duration||'—'}</div>
    </div>
  )
}
