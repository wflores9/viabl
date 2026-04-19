'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/ui/Navbar'
import type { BrandKit } from '@/types'

const S = {
  tag: { fontSize:'.54rem', letterSpacing:'.38em', textTransform:'uppercase' as const, color:'var(--red)', display:'flex', alignItems:'center', gap:'.6rem', padding:'1.6rem 0 1rem' },
  line: { display:'block', width:'18px', height:'1px', background:'var(--red)' },
  card: { background:'var(--surface)', padding:'1.8rem' },
  label: { fontSize:'.54rem', letterSpacing:'.26em', textTransform:'uppercase' as const, color:'var(--dim)', marginBottom:'.6rem' },
}

function Skeleton({ w = '100%', h = '1rem' }: { w?: string; h?: string }) {
  return <div style={{ width:w, height:h, background:'rgba(255,255,255,.06)', borderRadius:'2px', animation:'pulse .8s ease-in-out infinite' }}/>
}

export default function BrandPage({ params }: { params: { id: string } }) {
  const [kit,     setKit]     = useState<BrandKit | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    fetch(`/api/brand/${params.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setKit(data)
      })
      .catch(() => setError('Failed to load brand kit.'))
      .finally(() => setLoading(false))
  }, [params.id])

  return (
    <main style={{ minHeight:'100vh', background:'var(--black)' }}>
      <Navbar step={5} totalSteps={5}/>
      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'3rem clamp(1.5rem,5vw,3rem) 6rem' }}>

        {/* Header */}
        <div style={{ height:'2px', background:'linear-gradient(90deg,var(--red),transparent)', marginBottom:'1px' }}/>
        <div style={{ background:'var(--surface)', border:'1px solid rgba(255,255,255,.07)', padding:'3rem', marginBottom:'2px', display:'grid', gridTemplateColumns:'1fr auto', gap:'3rem', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:'.54rem', letterSpacing:'.4em', textTransform:'uppercase', color:'var(--red)', marginBottom:'1rem' }}>▶ Brand Identity System</div>
            {loading ? (
              <>
                <Skeleton w="60%" h="3rem"/><div style={{ height:'.8rem' }}/>
                <Skeleton w="80%" h="1.2rem"/>
              </>
            ) : kit ? (
              <>
                <h1 style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:'clamp(2.5rem,5vw,4.5rem)', lineHeight:1.05, marginBottom:'.7rem' }}>
                  {kit.name}<em style={{ fontStyle:'normal', color:'var(--red)' }}>.</em>
                </h1>
                <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, fontSize:'1.2rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--dim)', marginBottom:'1rem' }}>
                  &ldquo;{kit.tagline}&rdquo;
                </p>
                <p style={{ fontSize:'.7rem', color:'var(--dim)', lineHeight:1.85, maxWidth:'520px' }}>{kit.positioning}</p>
              </>
            ) : (
              <p style={{ fontSize:'.7rem', color:'var(--red)' }}>{error || 'Brand kit unavailable.'}</p>
            )}
          </div>
          <div style={{ background:'rgba(200,16,46,.05)', border:'1px solid rgba(200,16,46,.2)', padding:'2rem', textAlign:'center', minWidth:'200px', flexShrink:0 }}>
            <div style={{ fontSize:'.54rem', letterSpacing:'.2em', textTransform:'uppercase', color:'var(--dim)', marginBottom:'.8rem' }}>Included in Founder Pack</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'3.5rem', fontWeight:900, lineHeight:1, marginBottom:'.3rem' }}>$79</div>
            <div style={{ fontSize:'.56rem', color:'var(--dim)', marginBottom:'1.2rem' }}>one-time · no subscription</div>
            <Link href={`/results/${params.id}`} style={{ display:'block', background:'var(--red)', color:'var(--white)', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:'.82rem', letterSpacing:'.2em', textTransform:'uppercase', padding:'.9rem 1.4rem', textDecoration:'none', textAlign:'center', transition:'background .2s' }}>
              Unlock Brand Kit →
            </Link>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign:'center', padding:'4rem', fontSize:'.68rem', color:'var(--dim)' }}>
            <div style={{ width:'32px', height:'32px', border:'2px solid transparent', borderTopColor:'var(--red)', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 1rem' }}/>
            Generating your brand identity...
          </div>
        )}

        {!loading && kit && (
          <>
            {/* Brand Colors */}
            <div style={S.tag}><span style={S.line}/>Brand Colors</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'1px', background:'rgba(255,255,255,.05)', marginBottom:'2px' }}>
              {[
                { hex: kit.primary_color,  name:'Primary',   use:'CTAs, accents' },
                { hex: kit.accent_color,   name:'Accent',    use:'Highlights' },
                { hex:'#F0EDE6',           name:'Ivory',     use:'Headlines' },
                { hex:'#050505',           name:'Black',     use:'Background' },
                { hex:'#0C0C0C',           name:'Surface',   use:'Cards' },
                { hex:'#737068',           name:'Muted',     use:'Body copy' },
              ].map(c => (
                <div key={c.hex}>
                  <div style={{ height:'72px', background:c.hex }}/>
                  <div style={{ background:'var(--surface)', padding:'.9rem .8rem' }}>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:'.75rem', textTransform:'uppercase', marginBottom:'.2rem' }}>{c.name}</div>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'.56rem', color:'var(--dim)', marginBottom:'.2rem' }}>{c.hex}</div>
                    <div style={{ fontSize:'.54rem', color:'var(--dim)' }}>{c.use}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Brand Voice */}
            <div style={S.tag}><span style={S.line}/>Brand Voice</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1px', background:'rgba(255,255,255,.05)', marginBottom:'2px' }}>
              {[
                { l:'Tone',        v:kit.voice_tone,        d:'The emotional register for all communications.' },
                { l:'Personality', v:kit.voice_personality,  d:'The human analogy that captures brand feel.' },
                { l:'Never Say',   v:kit.voice_avoid,        d:'Language that dilutes or misrepresents the brand.' },
              ].map(({ l, v, d }) => (
                <div key={l} style={S.card}>
                  <div style={S.label}>{l}</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:'1.05rem', letterSpacing:'.06em', textTransform:'uppercase', marginBottom:'.6rem', color:'var(--white)' }}>{v}</div>
                  <div style={{ fontSize:'.63rem', color:'var(--dim)', lineHeight:1.7 }}>{d}</div>
                </div>
              ))}
            </div>

            {/* Typography */}
            <div style={S.tag}><span style={S.line}/>Typography System</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1px', background:'rgba(255,255,255,.05)', marginBottom:'2px' }}>
              <div style={{ ...S.card }}>
                <div style={S.label}>Display / Headlines</div>
                <div style={{ fontFamily:`'${kit.font_display}',serif`, fontSize:'clamp(2rem,4.5vw,3.5rem)', fontWeight:900, lineHeight:.95, marginBottom:'.7rem' }}>
                  {kit.font_display}
                </div>
                <div style={{ fontSize:'.62rem', color:'var(--dim)', lineHeight:1.75 }}>Hero headlines, section titles, key callouts</div>
              </div>
              <div style={{ ...S.card }}>
                <div style={S.label}>Body / UI</div>
                <div style={{ fontFamily:`'${kit.font_body}',sans-serif`, fontSize:'1.6rem', fontWeight:400, lineHeight:1.4, marginBottom:'.7rem', color:'var(--dim)' }}>
                  {kit.font_body}<br/>
                  <span style={{ fontSize:'.9rem' }}>The quick brown fox jumps over the lazy dog.</span>
                </div>
                <div style={{ fontSize:'.62rem', color:'var(--dim)', lineHeight:1.75 }}>Body text, UI labels, navigation</div>
              </div>
            </div>

            {/* ICP + Pitch */}
            <div style={S.tag}><span style={S.line}/>Positioning</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1px', background:'rgba(255,255,255,.05)', marginBottom:'2px' }}>
              <div style={S.card}>
                <div style={S.label}>Ideal Customer Profile</div>
                <p style={{ fontSize:'.72rem', color:'var(--white)', lineHeight:1.85, borderLeft:'2px solid var(--red)', paddingLeft:'1rem' }}>{kit.icp}</p>
              </div>
              <div style={S.card}>
                <div style={S.label}>Elevator Pitch</div>
                <p style={{ fontSize:'.72rem', color:'var(--white)', lineHeight:1.85, borderLeft:'2px solid var(--red)', paddingLeft:'1rem' }}>{kit.elevator_pitch}</p>
              </div>
            </div>

            {/* Domain Ideas */}
            <div style={S.tag}><span style={S.line}/>Domain Ideas</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1px', background:'rgba(255,255,255,.05)', marginBottom:'2px' }}>
              {kit.domain_ideas.map((d, i) => (
                <div key={i} style={{ ...S.card, textAlign:'center' }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:'1.1rem', letterSpacing:'.06em', color:'var(--white)', marginBottom:'.3rem' }}>{d}</div>
                  <div style={{ fontSize:'.56rem', color:'var(--dim)' }}>.com</div>
                </div>
              ))}
            </div>

            {/* ZenBusiness */}
            <div style={S.tag}><span style={S.line}/>Partner</div>
            <div style={{ background:'var(--surface)', border:'1px solid rgba(255,255,255,.07)', padding:'2.5rem', display:'grid', gridTemplateColumns:'1fr auto', gap:'3rem', alignItems:'center' }}>
              <div>
                <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', fontSize:'.54rem', letterSpacing:'.2em', textTransform:'uppercase', color:'#4488ff', border:'1px solid rgba(68,136,255,.25)', padding:'.35rem .8rem', marginBottom:'1rem' }}>
                  🤝 Verified Partner
                </div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:'clamp(1.2rem,2.5vw,2rem)', marginBottom:'.7rem' }}>
                  Ready to make <em style={{ fontStyle:'italic', color:'var(--dim)' }}>{kit.name}</em> official?
                </h3>
                <p style={{ fontSize:'.7rem', color:'var(--dim)', lineHeight:1.85, maxWidth:'460px' }}>
                  Form your LLC the same day you launch your brand. Trusted by 850,000+ entrepreneurs across all 50 states.
                </p>
              </div>
              <div style={{ textAlign:'center', flexShrink:0 }}>
                <a href="https://www.zenbusiness.com" target="_blank" rel="noopener noreferrer"
                  style={{ display:'inline-block', background:'#4488ff', color:'#fff', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:'.88rem', letterSpacing:'.2em', textTransform:'uppercase', padding:'.95rem 2.4rem', textDecoration:'none', transition:'background .2s' }}>
                  Form Your LLC →
                </a>
                <div style={{ fontSize:'.54rem', color:'var(--dim)', marginTop:'.6rem' }}>850K+ businesses formed</div>
              </div>
            </div>
          </>
        )}

        <div style={{ marginTop:'2.5rem', textAlign:'center' }}>
          <Link href={`/results/${params.id}`} style={{ fontSize:'.6rem', color:'var(--dim)', textDecoration:'none', letterSpacing:'.12em', textTransform:'uppercase', transition:'color .2s', display:'inline-flex', alignItems:'center', gap:'.5rem' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color='var(--white)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color='var(--dim)'}>
            ← Back to Report
          </Link>
        </div>
      </div>
    </main>
  )
}
