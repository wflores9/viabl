import * as React from 'react'

export function SubscribeEmail() {
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
          <div style={{ fontSize:'22px', fontWeight:700, color:'#f2ede8', marginBottom:'8px' }}>You're on the list.</div>
          <div style={{ fontSize:'14px', color:'#8a8178', lineHeight:1.8, marginBottom:'32px' }}>
            We'll let you know when new features drop.<br/>
            In the meantime — run a free analysis.
          </div>
          <a href="https://viabl.co/analyze" style={{ display:'block', background:'#d4ff00', color:'#000', fontFamily:'monospace', fontSize:'16px', fontWeight:700, letterSpacing:'0.1em', textAlign:'center', padding:'16px 32px', textDecoration:'none' }}>
            RUN FREE ANALYSIS →
          </a>
          <div style={{ height:'1px', background:'#2e2a25', margin:'32px 0 24px' }}/>
          <div style={{ fontSize:'11px', color:'#5a544d' }}>© 2026 Viabl · viabl.co</div>
        </div>
      </body>
    </html>
  )
}
