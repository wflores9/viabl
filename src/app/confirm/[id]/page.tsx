'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/ui/Navbar'
import { useViablStore } from '@/store/viabl'
import { TIERS } from '@/types'

interface OrderData {
  tier:           string
  amount:         number
  customer_email: string
  customer_name:  string
  pdf_url:        string | null
}

export default function ConfirmPage({ params }: { params: { id: string } }) {
  const searchParams             = useSearchParams()
  const sessionId                = searchParams.get('session_id')
  const { selectedTier }         = useViablStore()
  const [order, setOrder]        = useState<OrderData | null>(null)
  const [pdfReady, setPdfReady]  = useState(false)

  const tier = TIERS.find(t => t.id === selectedTier) || TIERS[1]

  useEffect(() => {
    // Poll for order data (webhook may take a few seconds)
    let attempts = 0
    const poll = setInterval(async () => {
      attempts++
      try {
        const res  = await fetch(`/api/analysis/${params.id}`)
        const data = await res.json()
        if (data?.overall_score) {
          setOrder({
            tier:           selectedTier,
            amount:         tier.price,
            customer_email: '',
            customer_name:  '',
            pdf_url:        null,
          })
          clearInterval(poll)
        }
      } catch { /* ignore */ }
      if (attempts >= 10) clearInterval(poll)
    }, 2000)
    return () => clearInterval(poll)
  }, [params.id, selectedTier, tier.price])

  async function handleDownloadPDF() {
    setPdfReady(false)
    try {
      const res = await fetch(`/api/pdf/${params.id}`)
      if (!res.ok) throw new Error('PDF not ready')
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `Viabl_Report_${params.id.substring(0,8)}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      setPdfReady(true)
    } catch {
      alert('PDF is being generated. Try again in a moment.')
    }
  }

  return (
    <main>
      <Navbar step={7} />
      <div className="max-w-[700px] mx-auto px-6 py-12 pb-20 text-center">

        {/* Check animation */}
        <div className="w-[76px] h-[76px] border border-acid rounded-full flex items-center justify-center mx-auto mb-9"
          style={{ animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
          <svg viewBox="0 0 40 40" className="w-8 h-8" stroke="#d4ff00" fill="none"
            strokeWidth="2.5" strokeDasharray="40" strokeDashoffset="40"
            style={{ animation: 'drawCheck 0.4s 0.45s ease forwards' }}>
            <polyline points="8,20 16,28 32,12"/>
          </svg>
        </div>

        <h1 className="font-bebas text-[64px] text-acid tracking-[0.03em] leading-[0.9] mb-3">
          PAYMENT<br/>CONFIRMED
        </h1>
        <p className="font-mono text-[13px] text-muted1 mb-10 leading-[1.9]">
          Your full report is ready. Check your inbox for a copy.
        </p>

        {/* Receipt */}
        <div className="bg-s1 border border-border p-7 text-left mb-6">
          {[
            ['Order ID',  `#VBL-${params.id.substring(0,8).toUpperCase()}`],
            ['Product',   `Viabl ${tier.name}`],
            ['Amount',    `$${tier.price}.00`],
            ['Session',   sessionId ? sessionId.substring(0,18)+'...' : '—'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2.5 border-b border-border last:border-0">
              <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-muted2">{k}</span>
              <span className={`font-mono text-[12px] ${k==='Amount'?'text-acid':''}`}>{v}</span>
            </div>
          ))}
        </div>

        {/* PDF download */}
        <div className="bg-acid/4 border border-acid/18 p-6 flex items-center justify-between mb-6">
          <div className="text-left">
            <div className="font-mono text-[13px] mb-1">
              Viabl_Report_{params.id.substring(0,8)}.pdf
            </div>
            <div className="font-mono text-[10px] text-muted2">
              {pdfReady ? '✓ Downloaded' : 'Ready to download'}
            </div>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="bg-acid text-black font-bebas text-[17px] tracking-[0.1em] px-6 py-3 transition-all hover:-translate-y-px"
          >
            ↓ DOWNLOAD
          </button>
        </div>

        {/* Brand next step — show only for founder_pack / launch_kit */}
        {(selectedTier === 'founder_pack' || selectedTier === 'launch_kit') && (
          <div className="bg-acid/4 border border-acid/18 p-6 text-left mb-6">
            <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-acid mb-2">Next Step Unlocked</div>
            <div className="font-bebas text-[22px] tracking-[0.04em] mb-2">YOUR BRAND IDENTITY IS READY</div>
            <div className="font-mono text-[12px] text-muted1 mb-4">
              Logos, colors, typography, voice, and social assets — generated from your idea.
            </div>
            <Link
              href={`/brand/${params.id}`}
              className="bg-acid text-black font-bebas text-[17px] tracking-[0.1em] px-6 py-3 inline-block hover:-translate-y-px transition-all"
            >
              VIEW BRAND GUIDE →
            </Link>
          </div>
        )}

        <div className="flex gap-2.5 justify-center">
          <Link href="/analyze" className="bg-transparent text-muted1 border border-border2 font-mono text-[10px] px-5 py-3 hover:text-text hover:border-muted1">
            ← Analyze Another
          </Link>
          <Link href={`/results/${params.id}`} className="bg-transparent text-muted1 border border-border2 font-mono text-[10px] px-5 py-3 hover:text-text hover:border-muted1">
            View Report
          </Link>
        </div>
      </div>
      <style>{`
        @keyframes popIn { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes drawCheck { to { stroke-dashoffset: 0; } }
      `}</style>
    </main>
  )
}
