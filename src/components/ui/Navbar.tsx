'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface NavbarProps { step?: number; totalSteps?: number }

export function Navbar({ step, totalSteps = 7 }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-6 transition-all duration-300"
        style={{
          height:'53px',
          borderBottom:`1px solid ${scrolled?'var(--border)':'transparent'}`,
          background:scrolled?'rgba(14,12,10,0.96)':'rgba(14,12,10,0.7)',
          backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
        }}>
        <Link href="/" className="font-bebas text-[22px] tracking-widest group">
          <span style={{color:'var(--acid)'}} className="transition-all group-hover:drop-shadow-[0_0_8px_rgba(212,255,0,0.6)]">V</span>
          <span style={{color:'var(--m1)'}}>IABL</span>
          <span style={{color:'var(--m2)'}}>.</span>
        </Link>
        <div className="flex items-center gap-4">
          {step && (
            <div className="hidden sm:flex items-center gap-1.5">
              {Array.from({length:totalSteps},(_,i)=>(
                <div key={i} className="transition-all duration-300"
                  style={{width:i+1===step?'20px':'6px',height:'2px',background:i+1<=step?'var(--acid)':'var(--border2)',borderRadius:'1px'}}/>
              ))}
              <span className="font-mono text-[9px] tracking-[0.16em] uppercase ml-1" style={{color:'var(--m2)'}}>
                <span style={{color:'var(--acid)'}}>{step}</span>/{totalSteps}
              </span>
            </div>
          )}
          <Link href="/analyze" className="btn-acid font-mono text-[10px] tracking-[0.14em] uppercase"
            style={{padding:'7px 16px',fontSize:'10px'}}>
            Start Analysis
          </Link>
        </div>
      </nav>
      <div style={{height:'53px'}}/>
    </>
  )
}
