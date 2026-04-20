'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/ui/Navbar'
import { useViablStore } from '@/store/viabl'
import { TIERS } from '@/types'

export default function ConfirmPage({ params }: { params: { id: string } }) {
  const searchParams           = useSearchParams()
  const { selectedTier }       = useViablStore()
  const [ready,    setReady]   = useState(false)
  const [dlState,  setDlState] = useState<'idle'|'loading'|'done'>('idle')
  const tier = TIERS.find(t => t.id === selectedTier) || TIERS[0]

  // Poll until analysis is confirmed in DB
  useEffect(() => {
    let attempts = 0
    const poll = setInterval(async () => {
      attempts++
      try {
        const res  = await fetch(`/api/analysis/${params.id}`)
        const data = await res.json()
        if (data?.overall_score) { setReady(true); clearInterval(poll) }
      } catch { /* ignore */ }
      if (attempts >= 10) { setReady(true); clearInterval(poll) }
    }, 2000)
    // Show UI after 2s regardless
    setTimeout(() => setReady(true), 2000)
    return () => clearInterval(poll)
  }, [params.id])

  async function handleDownload() {
    setDlState('loading')
    try {
      const res = await fetch(`/api/pdf/${params.id}`)
      const ct  = res.headers.get('content-type') || ''

      if (ct.includes('text/html')) {
        // Fallback: open printable HTML in new tab
        const html = await res.text()
        const blob = new Blob([html], { type:'text/html' })
        const url  = URL.createObjectURL(blob)
        window.open(url, '_blank')
        setTimeout(() => URL.revokeObjectURL(url), 10000)
      } else {
        // Real PDF download
        const blob = await res.blob()
        const url  = URL.createObjectURL(blob)
        const a    = document.createElement('a')
        a.href = url; a.download = `Viabl_Report_${params.id.substring(0,8)}.pdf`; a.click()
        URL.revokeObjectURL(url)
      }
      setDlState('done')
    } catch {
      alert('Report is ready — try again in a moment.')
      setDlState('idle')
    }
  }

  return (
    <main style={{ minHeight:'100vh', background:'var(--black)' }}>
      <Navbar/>
      {/* Ambient glow */}
      <div style={{ position:'fixed', top:0, left:'50%', transform:'translateX(-50%)', width:'600px', height:'500px', background:'radial-gradient(ellipse,rgba(61,170,106,.08) 0%,transparent 70%)', pointerEvents:'none' }}/>

      <div style={{ position:'relative', zIndex:1, maxWidth:'600px', margin:'0 auto', padding:'5rem 2rem 6rem', textAlign:'center' }}>

        {/* Check animation */}
        <div style={{ width:'76px', height:'76px', border:'1px solid #3DAA6A', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 2rem', animation:'popIn .5s cubic-bezier(.34,1.56,.64,1) both' }}>
          <svg viewBox="0 0 40 40" width="28" height="28" stroke="#3DAA6A" fill="none" strokeWidth="2.5"
            strokeDasharray="40" strokeDashoffset="40" style={{ animation:'drawCheck .4s .45s ease forwards' }}>
            <polyline points="8,20 16,28 32,12"/>
          </svg>
        </div>

        <div style={{ fontSize:'.54rem', letterSpacing:'.4em', textTransform:'uppercase', color:'#3DAA6A', marginBottom:'1rem' }}>
          ▶ Payment Confirmed
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:'clamp(2rem,5vw,3.5rem)', lineHeight:1.05, marginBottom:'1rem' }}>
          Your report<br/><em style={{ fontStyle:'italic', color:'var(--dim)' }}>is unlocked.</em>
        </h1>
        <p style={{ fontSize:'.92rem', color:'var(--dim)', lineHeight:1.85, maxWidth:'400px', margin:'0 auto 3rem' }}>
          Full analysis, brand identity kit, GTM playbook, and risk register. The designed PDF includes everything formatted for sharing and printing.
        </p>

        {/* Order summary */}
        <div style={{ border:'1px solid rgba(255,255,255,.07)', background:'var(--surface)', padding:'1.6rem', textAlign:'left', marginBottom:'2.5rem' }}>
          <div style={{ fontSize:'.54rem', letterSpacing:'.28em', textTransform:'uppercase', color:'var(--red)', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'.5rem' }}>
            <span style={{ display:'block', width:'14px', height:'1px', background:'var(--red)' }}/>Order Details
          </div>
          {[
            ['Report ID',  `#${params.id.substring(0,8).toUpperCase()}`],
            ['Plan',       tier.name],
            ['Amount',     `$${tier.price}`],
            ['Delivery',   'Instant · Web + PDF'],
          ].map(([k,v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'.55rem 0', borderBottom:'1px solid rgba(255,255,255,.05)' }}>
              <span style={{ fontSize:'.62rem', color:'var(--dim)' }}>{k}</span>
              <span style={{ fontSize:'.62rem', color:'var(--white)', fontFamily:"'DM Mono',monospace" }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display:'flex', flexDirection:'column', gap:'.8rem', maxWidth:'320px', margin:'0 auto' }}>

          <button onClick={handleDownload} disabled={dlState==='loading'}
            style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:'1rem', letterSpacing:'.22em', textTransform:'uppercase', color:'var(--white)', background:'var(--red)', border:'none', padding:'1rem', cursor: dlState==='loading'?'not-allowed':'pointer', opacity: dlState==='loading'?.6:1, transition:'transform .2s', width:'100%' }}
            onMouseEnter={e=>{if(dlState!=='loading')(e.currentTarget as HTMLElement).style.transform='translateY(-2px)'}}
            onMouseLeave={e=>(e.currentTarget as HTMLElement).style.transform='none'}>
            {dlState==='loading' ? 'Generating PDF...' : dlState==='done' ? '✓ Downloaded' : '↓ Download PDF Report'}
          </button>

          <Link href={`/results/${params.id}`}
            style={{ fontFamily:"'DM Mono',monospace", fontSize:'.82rem', letterSpacing:'.15em', textTransform:'uppercase', color:'var(--dim)', textDecoration:'none', border:'1px solid rgba(255,255,255,.1)', padding:'.8rem', textAlign:'center', transition:'all .2s', display:'block' }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,.3)';(e.currentTarget as HTMLElement).style.color='var(--white)'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,.1)';(e.currentTarget as HTMLElement).style.color='var(--dim)'}}>
            View Report Online →
          </Link>

          <Link href={`/brand/${params.id}`}
            style={{ fontFamily:"'DM Mono',monospace", fontSize:'.82rem', letterSpacing:'.15em', textTransform:'uppercase', color:'var(--dim)', textDecoration:'none', border:'1px solid rgba(255,255,255,.1)', padding:'.8rem', textAlign:'center', transition:'all .2s', display:'block' }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(200,16,46,.4)';(e.currentTarget as HTMLElement).style.color='var(--white)'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,.1)';(e.currentTarget as HTMLElement).style.color='var(--dim)'}}>
            View Brand Identity Kit →
          </Link>

          <Link href="/"
            style={{ fontSize:'.58rem', color:'var(--dim)', textDecoration:'none', textAlign:'center', letterSpacing:'.1em', marginTop:'.3rem', transition:'color .2s', display:'block' }}
            onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='var(--white)'}
            onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='var(--dim)'}>
            Analyze another idea →
          </Link>
        </div>
      </div>
    </main>
  )
}
