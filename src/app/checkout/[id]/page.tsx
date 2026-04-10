'use client'
import{useState}from'react'
import{Navbar}from'@/components/ui/Navbar'
import{useViablStore}from'@/store/viabl'
import{TIERS}from'@/types'
import type{Tier}from'@/types'
import{cn}from'@/lib/utils'
export default function CheckoutPage({params}:{params:{id:string}}){
  const{selectedTier}=useViablStore()
  const[loading,setLoading]=useState(false)
  const[email,setEmail]=useState('')
  const tier=TIERS.find(t=>t.id===selectedTier)||TIERS[1]
  async function handlePay(){
    if(!email.includes('@'))return;setLoading(true)
    try{const res=await fetch('/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({analysisId:params.id,tier:tier.id as Exclude<Tier,'free'>,email})});const data=await res.json();if(data.url)window.location.href=data.url}
    catch{alert('Something went wrong.');setLoading(false)}
  }
  return(<main><Navbar step={6}/>
    <div className="max-w-[940px] mx-auto px-6 py-8 pb-20">
      <h1 className="font-bebas text-[44px] tracking-[0.03em] mb-2">CHECKOUT</h1>
      <p className="font-mono text-[12px] text-muted1 mb-8">Complete your order to unlock the full analysis.</p>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-px bg-border">
        <div className="bg-s1 p-8">
          <div className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.14em] uppercase bg-yellow/8 text-yellow border border-yellow/20 px-3 py-1.5 mb-6">🧪 Test Mode — Card: 4242 4242 4242 4242</div>
          <div className="mb-6"><label className="font-mono text-[9px] tracking-[0.12em] uppercase text-muted1 block mb-1.5">Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" className="bg-s2 border border-border2 font-mono text-[13px] p-3 outline-none focus:border-acid w-full"/></div>
          <div className="bg-s2 border border-border2 p-4 font-mono text-[11px] text-muted2 leading-relaxed mb-6">🔒 You will be redirected to Stripe's secure checkout.</div>
          <button onClick={handlePay} disabled={loading||!email.includes('@')} className={cn('w-full py-4 font-bebas text-[22px] tracking-[0.1em] border-none bg-acid text-black hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(212,255,0,0.28)] transition-all','disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0')}>
            {loading?'Redirecting...':`PAY $${tier.price} — UNLOCK →`}
          </button>
          <div className="font-mono text-[10px] text-muted2 mt-2.5">🔒 Secured by Stripe · 256-bit SSL</div>
        </div>
        <div className="bg-s2 p-8">
          <div className="font-bebas text-[22px] tracking-[0.06em] mb-5">Order Summary</div>
          <div className="flex justify-between items-start py-3 border-b border-border"><div><div className="font-mono text-[12px]">Viabl {tier.name}</div><div className="font-mono text-[10px] text-muted2 mt-0.5">#{params.id.substring(0,8).toUpperCase()}</div></div><div className="font-bebas text-[20px] text-acid">${tier.price}</div></div>
          <div className="flex justify-between items-center pt-4 mb-6"><span className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted1">Total today</span><span className="font-bebas text-[48px] text-acid">${tier.price}</span></div>
          <div className="border-t border-border pt-4"><div className="font-mono text-[9px] tracking-[0.14em] uppercase text-muted2 mb-2.5">Included</div>{tier.items.map(item=><div key={item} className="flex items-center gap-1.5 font-mono text-[10px] text-muted1 py-[3px]"><span className="text-acid">—</span>{item}</div>)}</div>
        </div>
      </div>
    </div>
  </main>)
}
