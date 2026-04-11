'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
interface NavbarProps { step?: number; totalSteps?: number }
export function Navbar({ step, totalSteps = 3 }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-8 transition-all duration-300"
        style={{ height:'64px', borderBottom:`1px solid ${scrolled?'var(--border)':'transparent'}`, background:scrolled?'rgba(14,12,10,0.97)':'rgba(14,12,10,0.6)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)' }}>
        <Link href="/" className="font-bebas tracking-widest group flex items-baseline gap-1" style={{ fontSize:'28px' }}>
          <span style={{ color:'var(--acid)' }} className="transition-all duration-200 group-hover:drop-shadow-[0_0_12px_rgba(212,255,0,0.7)]">V</span>
          <span style={{ color:'var(--text)' }}>IABL</span>
          <span style={{ color:'var(--m2)' }}>.</span>
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase ml-1 self-center" style={{ color:'var(--m2)' }}>co</span>
        </Link>
        {step && (
          <div className="hidden sm:flex items-center gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="transition-all duration-500" style={{ width:i+1===step?'28px':'8px', height:'2px', background:i+1<=step?'var(--acid)':'var(--border2)', borderRadius:'1px', boxShadow:i+1===step?'0 0 8px rgba(212,255,0,0.5)':'none' }}/>
                {i + 1 < totalSteps && <div style={{ width:'4px', height:'4px', background:'var(--border2)', borderRadius:'50%' }}/>}
              </div>
            ))}
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase ml-2" style={{ color:'var(--m2)' }}>
              <span style={{ color:'var(--acid)' }}>{step}</span> / {totalSteps}
            </span>
          </div>
        )}
        <Link href="/analyze" className="btn-acid font-bebas tracking-[0.12em]" style={{ fontSize:'15px', padding:'10px 24px' }}>
          Start Analysis →
        </Link>
      </nav>
      <div style={{ height:'64px' }}/>
    </>
  )
}
