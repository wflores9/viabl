'use client'
import Link from 'next/link'
interface NavbarProps { step?:number; totalSteps?:number }
export function Navbar({ step, totalSteps=7 }:NavbarProps) {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-6 py-4 border-b border-border bg-bg/94 backdrop-blur-xl">
        <Link href="/" className="font-bebas text-[24px] tracking-widest">
          <span className="text-acid">V</span><span className="text-muted1">IABL</span><span className="text-muted2">.</span>
        </Link>
        <div className="flex items-center gap-4">
          {step && <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-muted2">Step <span className="text-acid">{step}</span> of {totalSteps}</span>}
          <Link href="/analyze" className="bg-acid text-black px-4 py-2 font-mono text-[10px] tracking-[0.14em] uppercase transition-transform hover:-translate-y-px">Start Analysis</Link>
        </div>
      </nav>
      <div className="h-[53px]"/>
    </>
  )
}
