import * as React from 'react'

interface ReportEmailProps {
  score: number
  verdict: string
  ideaSummary: string
  reportUrl: string
  tier: string
}

export function ReportEmail({ score, verdict, ideaSummary, reportUrl, tier }: ReportEmailProps) {
  const verdictColor = verdict === 'GO' ? '#22c55e' : verdict === 'MAYBE' ? '#f97316' : '#ef4444'
  return (
    <html>
      <body style={{ background:'#0e0c0a', color:'#f2ede8', fontFamily:'monospace', margin:0, padding:0 }}>
        <div style={{ maxWidth:'600px', margin:'0 auto', padding:'40px 32px' }}>

          {/* Header */}
          <div style={{ marginBottom:'32px' }}>
            <span style={{ fontFamily:'monospace', fontSize:'28px', fontWeight:700, letterSpacing:'0.06em' }}>
              <span style={{ color:'#d4ff00' }}>V</span>IABL.
            </span>
          </div>

          <div style={{ height:'2px', background:'linear-gradient(90deg,#d4ff00,transparent)', marginBottom:'32px' }}/>

          {/* Score */}
          <div style={{ marginBottom:'24px' }}>
            <div style={{ fontSize:'11px', letterSpacing:'0.2em', textTransform:'uppercase', color:'#5a544d', marginBottom:'8px' }}>
              YOUR VIABILITY SCORE
            </div>
            <div style={{ fontSize:'80px', fontWeight:700, color:'#d4ff00', lineHeight:1, marginBottom:'8px' }}>
              {score}
            </div>
            <div style={{ display:'inline-block', background:verdictColor, color:'#fff', fontFamily:'monospace', fontSize:'14px', letterSpacing:'0.16em', padding:'4px 16px', fontWeight:700 }}>
              {verdict === 'GO' ? 'STRONG GO' : verdict === 'MAYBE' ? 'VIABLE WITH CONDITIONS' : 'HIGH RISK'}
            </div>
          </div>

          <div style={{ height:'1px', background:'#2e2a25', marginBottom:'24px' }}/>

          {/* Idea */}
          <div style={{ marginBottom:'32px' }}>
            <div style={{ fontSize:'11px', letterSpacing:'0.2em', textTransform:'uppercase', color:'#5a544d', marginBottom:'8px' }}>IDEA ANALYZED</div>
            <div style={{ fontSize:'14px', color:'#8a8178', lineHeight:1.7 }}>{ideaSummary}</div>
          </div>

          {/* CTA */}
          <a href={reportUrl} style={{ display:'block', background:'#d4ff00', color:'#000', fontFamily:'monospace', fontSize:'16px', fontWeight:700, letterSpacing:'0.1em', textAlign:'center', padding:'16px 32px', textDecoration:'none', marginBottom:'32px' }}>
            VIEW FULL REPORT →
          </a>

          {/* Tier info */}
          <div style={{ background:'#1a1714', border:'1px solid #2e2a25', padding:'16px 20px', marginBottom:'32px' }}>
            <div style={{ fontSize:'11px', letterSpacing:'0.16em', textTransform:'uppercase', color:'#5a544d', marginBottom:'8px' }}>YOUR PLAN</div>
            <div style={{ fontSize:'14px', color:'#f2ede8', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>{tier}</div>
          </div>

          <div style={{ height:'1px', background:'#2e2a25', marginBottom:'24px' }}/>

          {/* Footer */}
          <div style={{ fontSize:'11px', color:'#5a544d', lineHeight:1.8 }}>
            <div>Not financial or legal advice.</div>
            <div>© 2026 Viabl · <a href="https://viabl.co" style={{ color:'#d4ff00', textDecoration:'none' }}>viabl.co</a></div>
          </div>
        </div>
      </body>
    </html>
  )
}
