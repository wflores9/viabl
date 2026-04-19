'use client'
import { useViablStore } from '@/store/viabl'
import { INDUSTRIES, BUSINESS_MODELS, GEOGRAPHIES, STAGES } from '@/types'

const S = {
  label: { fontSize:'.56rem', letterSpacing:'.32em', textTransform:'uppercase' as const, color:'var(--red)', marginBottom:'.7rem', display:'flex', alignItems:'center', gap:'.6rem' },
  line:  { display:'block', width:'16px', height:'1px', background:'var(--red)' },
}

export function IntakeForm({ step = 1 }: { step?: number }) {
  const { ideaText, industry, target, model, geography, stage, budget, notes, setInput } = useViablStore()

  if (step === 1) return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.6rem' }}>
      <div>
        <div style={S.label}><span style={S.line}/>Your Business Idea</div>
        <textarea value={ideaText} onChange={e => setInput('ideaText', e.target.value)}
          placeholder="Describe your idea. What does it do, who does it help, what problem does it solve? Be specific — better input = sharper analysis."
          rows={5} style={{ width:'100%', resize:'none', borderLeft:'2px solid', borderLeftColor: ideaText.length >= 20 ? 'var(--red)' : 'rgba(255,255,255,.1)', paddingLeft:'1rem' }}/>
        <div style={{ fontSize:'.58rem', color: ideaText.length >= 20 ? '#3DAA6A' : 'var(--dim)', marginTop:'.4rem', textAlign:'right' }}>
          {ideaText.length >= 20 ? '✓ Good to go' : `${Math.max(20 - ideaText.length, 0)} more characters`}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.2rem' }}>
        <div>
          <div style={S.label}><span style={S.line}/>Industry</div>
          <div style={{ position:'relative' }}>
            <select value={industry} onChange={e => setInput('industry', e.target.value)} style={{ paddingRight:'2.5rem' }}>
              <option value="">Select...</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            <span style={{ position:'absolute', right:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--dim)', fontSize:'.65rem', pointerEvents:'none' }}>▼</span>
          </div>
        </div>
        <div>
          <div style={S.label}><span style={S.line}/>Target Customer</div>
          <input type="text" value={target} onChange={e => setInput('target', e.target.value)} placeholder="e.g. Solo founders, SMB owners..."/>
        </div>
      </div>
    </div>
  )

  if (step === 2) return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.6rem' }}>
      <div>
        <div style={S.label}><span style={S.line}/>Revenue Model</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2px', background:'rgba(255,255,255,.05)' }}>
          {BUSINESS_MODELS.map(m => (
            <button key={m.label} onClick={() => setInput('model', m.label)}
              style={{ background: model === m.label ? 'rgba(200,16,46,.15)' : 'var(--surface)', border:'none', padding:'1.2rem 1.4rem', textAlign:'left', cursor:'pointer', borderLeft:`2px solid ${model === m.label ? 'var(--red)' : 'transparent'}`, transition:'all .2s' }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:'.9rem', letterSpacing:'.08em', textTransform:'uppercase', color: model === m.label ? 'var(--white)' : 'var(--dim)', marginBottom:'.2rem' }}>{m.label}</div>
              <div style={{ fontSize:'.6rem', color:'var(--dim)' }}>{m.desc}</div>
            </button>
          ))}
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.2rem' }}>
        <div>
          <div style={S.label}><span style={S.line}/>Geography</div>
          <div style={{ position:'relative' }}>
            <select value={geography} onChange={e => setInput('geography', e.target.value)} style={{ paddingRight:'2.5rem' }}>
              <option value="">Select...</option>
              {GEOGRAPHIES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <span style={{ position:'absolute', right:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--dim)', fontSize:'.65rem', pointerEvents:'none' }}>▼</span>
          </div>
        </div>
        <div>
          <div style={S.label}><span style={S.line}/>Monthly Budget</div>
          <input type="number" value={budget || ''} onChange={e => setInput('budget', parseInt(e.target.value) || 0)} placeholder="e.g. 5000"/>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.6rem' }}>
      <div>
        <div style={S.label}><span style={S.line}/>Current Stage</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2px', background:'rgba(255,255,255,.05)' }}>
          {STAGES.map(s => (
            <button key={s.name} onClick={() => setInput('stage', s.name)}
              style={{ background: stage === s.name ? 'rgba(200,16,46,.15)' : 'var(--surface)', border:'none', padding:'1.2rem 1.4rem', textAlign:'left', cursor:'pointer', borderLeft:`2px solid ${stage === s.name ? 'var(--red)' : 'transparent'}`, transition:'all .2s', display:'flex', alignItems:'center', gap:'.8rem' }}>
              <span style={{ fontSize:'1.2rem' }}>{s.icon}</span>
              <div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:'.88rem', letterSpacing:'.08em', textTransform:'uppercase', color: stage === s.name ? 'var(--white)' : 'var(--dim)' }}>{s.name}</div>
                <div style={{ fontSize:'.6rem', color:'var(--dim)' }}>{s.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <div style={S.label}><span style={S.line}/>Biggest Concern <span style={{ color:'var(--dim)', marginLeft:'.3rem' }}>(optional)</span></div>
        <textarea value={notes} onChange={e => setInput('notes', e.target.value)}
          placeholder="What worries you most about this idea? Helps sharpen the risk analysis."
          rows={3} style={{ resize:'none' }}/>
      </div>
    </div>
  )
}
