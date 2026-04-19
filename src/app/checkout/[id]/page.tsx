'use client'
import { useState } from 'react'
import { Navbar } from '@/components/ui/Navbar'
import { useViablStore } from '@/store/viabl'
import { TIERS } from '@/types'
import type { Tier } from '@/types'

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const { selectedTier } = useViablStore()
  const [loading, setLoading] = useState(false)
  const [email,   setEmail]   = useState('')
  const tier = TIERS.find(t => t.id === selectedTier) || TIERS[1]

  async function handlePay() {
    if (!email.includes('@')) return; setLoading(true)
    try {
      const res  = await fetch('/api/checkout', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ analysisId: params.id, tier: tier.id as Exclude<Tier,'free'>, email }) })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch { alert('Something went wrong.'); setLoading(false) }
  }

  return (
    <main style={{ minHeight:'100vh', background:'var(--black)' }}>
      <Navbar/>
      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'3rem clamp(1.5rem,5vw,3rem) 6rem' }}>

        <div style={{ height:'2px', background:'linear-gradient(90deg,var(--red),transparent)', marginBottom:'2.5rem' }}/>

        <div style={{ fontSize:'.56rem', letterSpacing:'.4em', textTransform:'uppercase', color:'var(--red)', marginBottom:'1rem' }}>Step 04 · Unlock Report</div>
        <h1 style={{ fontFamily:'var(--font-playfair),serif', fontWeight:900, fontSize:'clamp(2rem,5vw,4rem)', lineHeight:1.05, marginBottom:'.6rem' }}>
          Unlock Your<br/><em style={{ fontStyle:'italic', color:'var(--dim)' }}>Full Report.</em>
        </h1>
        <p style={{ fontSize:'.7rem', color:'var(--dim)', marginBottom:'3rem', maxWidth:'440px', lineHeight:1.85 }}>
          Complete your order to access every dimension, the brand identity kit, GTM playbook, and pitch narrative.
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'1px', background:'rgba(255,255,255,.05)' }}>
          {/* Left: payment */}
          <div style={{ background:'var(--surface)', padding:'2.5rem' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', fontFamily:'var(--font-dm-mono),monospace', fontSize:'.58rem', letterSpacing:'.14em', textTransform:'uppercase', background:'rgba(196,151,58,.08)', color:'var(--gold)', border:'1px solid rgba(196,151,58,.2)', padding:'.4rem .9rem', marginBottom:'2rem' }}>
              🧪 Test — Card: 4242 4242 4242 4242
            </div>

            <div style={{ marginBottom:'1.6rem' }}>
              <div style={{ fontSize:'.58rem', letterSpacing:'.28em', textTransform:'uppercase', color:'var(--red)', marginBottom:'.7rem', display:'flex', alignItems:'center', gap:'.6rem' }}>
                <span style={{ display:'block', width:'16px', height:'1px', background:'var(--red)' }}/>Email Address
              </div>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                onKeyDown={e => e.key==='Enter'&&handlePay()}/>
            </div>

            <div style={{ background:'#0a0a0a', border:'1px solid rgba(255,255,255,.07)', padding:'1rem 1.2rem', fontSize:'.65rem', color:'var(--dim)', lineHeight:1.7, marginBottom:'1.8rem' }}>
              🔒 You will be redirected to Stripe&apos;s secure checkout. We do not store card details.
            </div>

            <button onClick={handlePay} disabled={loading || !email.includes('@')} className="btn-cine"
              style={{ width:'100%', fontSize:'.88rem', padding:'1.1rem', opacity:(loading||!email.includes('@'))?.4:1 }}>
              {loading ? 'Redirecting...' : `Pay $${tier.price} — Unlock →`}
            </button>
            <div style={{ fontSize:'.58rem', color:'var(--dim)', marginTop:'.8rem', textAlign:'center', letterSpacing:'.08em' }}>
              🔒 Secured by Stripe · 256-bit SSL
            </div>
          </div>

          {/* Right: order summary */}
          <div style={{ background:'#0C0C0C', padding:'2.5rem' }}>
            <div style={{ fontFamily:'var(--font-playfair),serif', fontWeight:900, fontSize:'1.4rem', marginBottom:'1.8rem' }}>Order Summary</div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', paddingBottom:'1.2rem', borderBottom:'1px solid rgba(255,255,255,.07)', marginBottom:'1.2rem' }}>
              <div>
                <div style={{ fontFamily:'var(--font-dm-mono),monospace', fontSize:'.72rem' }}>Viabl {tier.name}</div>
                <div style={{ fontSize:'.58rem', color:'var(--dim)', marginTop:'3px' }}>#{params.id.substring(0,8).toUpperCase()}</div>
              </div>
              <div style={{ fontFamily:'var(--font-playfair),serif', fontWeight:900, fontSize:'1.4rem', color:'var(--white)' }}>${tier.price}</div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.8rem' }}>
              <span style={{ fontSize:'.58rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--dim)' }}>Total today</span>
              <span style={{ fontFamily:'var(--font-playfair),serif', fontSize:'3rem', fontWeight:900 }}>${tier.price}</span>
            </div>
            <div style={{ borderTop:'1px solid rgba(255,255,255,.07)', paddingTop:'1.2rem' }}>
              <div style={{ fontSize:'.55rem', letterSpacing:'.2em', textTransform:'uppercase', color:'var(--dim)', marginBottom:'1rem' }}>Included</div>
              {tier.items.map(item => (
                <div key={item} style={{ display:'flex', alignItems:'center', gap:'.5rem', fontSize:'.62rem', color:'var(--dim)', padding:'.25rem 0' }}>
                  <span style={{ color:'#3DAA6A', flexShrink:0 }}>—</span>{item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
