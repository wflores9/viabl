import * as React from 'react'

interface PurchaseEmailProps {
  tier: string
  amount: number
  reportUrl: string
  pdfUrl?: string
  brandKitUrl?: string
}

export function PurchaseEmail({ tier, amount, reportUrl, pdfUrl, brandKitUrl }: PurchaseEmailProps) {
  return (
    <html>
      <body style={{ background:'#0e0c0a', color:'#f2ede8', fontFamily:'monospace', margin:0, padding:0 }}>
        <div style={{ maxWidth:'600px', margin:'0 auto', padding:'40px 32px' }}>
          <div style={{ marginBottom:'32px' }}>
            <span style={{ fontFamily:'monospace', fontSize:'28px', fontWeight:700, letterSpacing:'0.06em' }}>
              <span style={{ color:'#d4ff00' }}>V</span>IABL.
            </span>
          </div>
          <div style={{ height:'2px', background:'linear-gradient(90deg,#d4ff00,transparent)', marginBottom:'32px' }}/>

          <div style={{ fontSize:'22px', fontWeight:700, color:'#f2ede8', marginBottom:'8px' }}>Payment confirmed.</div>
          <div style={{ fontSize:'14px', color:'#8a8178', marginBottom:'32px' }}>
            Your {tier} is ready to download.
          </div>

          <div style={{ background:'#1a1714', border:'1px solid #2e2a25', padding:'20px', marginBottom:'24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
              <span style={{ color:'#8a8178', fontSize:'12px' }}>Plan</span>
              <span style={{ color:'#f2ede8', fontSize:'12px', fontWeight:600 }}>{tier.toUpperCase()}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ color:'#8a8178', fontSize:'12px' }}>Amount</span>
              <span style={{ color:'#d4ff00', fontSize:'12px', fontWeight:600 }}>${(amount/100).toFixed(2)}</span>
            </div>
          </div>

          <a href={reportUrl} style={{ display:'block', background:'#d4ff00', color:'#000', fontFamily:'monospace', fontSize:'16px', fontWeight:700, letterSpacing:'0.1em', textAlign:'center', padding:'16px 32px', textDecoration:'none', marginBottom:'12px' }}>
            VIEW REPORT →
          </a>

          {pdfUrl && (
            <a href={pdfUrl} style={{ display:'block', background:'#1a1714', color:'#d4ff00', fontFamily:'monospace', fontSize:'14px', fontWeight:600, letterSpacing:'0.1em', textAlign:'center', padding:'14px 32px', textDecoration:'none', border:'1px solid #d4ff00', marginBottom:'12px' }}>
              DOWNLOAD PDF →
            </a>
          )}

          {brandKitUrl && (
            <a href={brandKitUrl} style={{ display:'block', background:'#1a1714', color:'#f2ede8', fontFamily:'monospace', fontSize:'14px', fontWeight:600, letterSpacing:'0.1em', textAlign:'center', padding:'14px 32px', textDecoration:'none', border:'1px solid #2e2a25', marginBottom:'24px' }}>
              DOWNLOAD BRAND KIT →
            </a>
          )}

          <div style={{ height:'1px', background:'#2e2a25', marginBottom:'24px' }}/>
          <div style={{ fontSize:'11px', color:'#5a544d' }}>© 2026 Viabl · viabl.co</div>
        </div>
      </body>
    </html>
  )
}
