'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SuccessContent() {
  const params = useSearchParams()
  const sessionId = params.get('session_id')

  return (
    <div style={{ background:'#080808', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:32, fontFamily:"'DM Sans', sans-serif" }}>
      <div style={{ textAlign:'center', maxWidth:480 }}>
        <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'3rem', letterSpacing:'0.05em', marginBottom:8 }}>
          viabl<span style={{color:'#d4ff00'}}>.</span><span style={{color:'#d4ff00', fontSize:'0.6em'}}>co</span>
        </div>
        <div style={{ width:56, height:56, borderRadius:'50%', background:'#d4ff00', display:'flex', alignItems:'center', justifyContent:'center', margin:'24px auto', fontSize:24 }}>✓</div>
        <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'2rem', letterSpacing:'0.05em', color:'#f0f0f0', marginBottom:12 }}>
          Payment confirmed
        </div>
        <div style={{ fontSize:14, color:'#666', lineHeight:1.7, marginBottom:32 }}>
          Your full Viabl report is ready. Head back to run your complete analysis with all premium insights unlocked.
        </div>
        <a href="/" style={{ display:'inline-block', background:'#d4ff00', color:'#000', fontFamily:"'Bebas Neue', sans-serif", fontSize:'1.1rem', letterSpacing:'0.1em', padding:'14px 32px', textDecoration:'none' }}>
          Run my analysis →
        </a>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
