'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
interface NavbarProps { step?: number; totalSteps?: number }
export function Navbar({ step, totalSteps = 4 }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <>
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:200,
        padding:'1.4rem 3.5rem', display:'flex', justifyContent:'space-between', alignItems:'center',
        background: scrolled ? 'rgba(5,5,5,.96)' : 'rgba(5,5,5,.6)',
        backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,.06)' : '1px solid transparent',
        transition:'background .3s, border-color .3s',
      }}>
        <Link href="/" style={{fontFamily:'var(--font-barlow),sans-serif',fontWeight:800,fontSize:'1.3rem',letterSpacing:'.18em',color:'var(--white)',textDecoration:'none',display:'flex',alignItems:'center',gap:'2px'}}>
          VIABL<em style={{fontStyle:'normal',color:'var(--red)'}}>.</em>
        </Link>
        <div style={{display:'flex',alignItems:'center',gap:'2rem'}}>
          {step && (
            <div style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
              {Array.from({length:totalSteps},(_,i)=>(
                <div key={i} style={{width:i+1===step?'28px':'8px',height:'2px',borderRadius:'1px',background:i+1<=step?'var(--red)':'rgba(255,255,255,.1)',transition:'width .4s,background .4s'}}/>
              ))}
              <span style={{fontFamily:'var(--font-dm-mono),monospace',fontSize:'.58rem',letterSpacing:'.16em',textTransform:'uppercase',color:'var(--dim)',marginLeft:'.4rem'}}>
                <span style={{color:'var(--red)'}}>{step}</span> / {totalSteps}
              </span>
            </div>
          )}
          <Link href="/analyze" style={{fontFamily:'var(--font-dm-mono),monospace',fontSize:'.62rem',letterSpacing:'.2em',textTransform:'uppercase',color:'var(--white)',textDecoration:'none',border:'1px solid rgba(255,255,255,.12)',padding:'.55rem 1.4rem',transition:'background .25s,border-color .25s'}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='var(--red)';(e.currentTarget as HTMLElement).style.borderColor='var(--red)'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent';(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,.12)'}}>
            Start Analysis →
          </Link>
        </div>
      </nav>
      <div style={{height:'64px'}}/>
    </>
  )
}
