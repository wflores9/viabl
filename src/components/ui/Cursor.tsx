'use client'
import { useEffect, useRef } from 'react'

export function Cursor() {
  const dot  = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const rx   = useRef(0)
  const ry   = useRef(0)
  const mx   = useRef(0)
  const my   = useRef(0)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mx.current = e.clientX
      my.current = e.clientY
      if (dot.current) {
        dot.current.style.left    = e.clientX + 'px'
        dot.current.style.top     = e.clientY + 'px'
        dot.current.style.opacity = '1'
      }
    }

    const loop = () => {
      rx.current += (mx.current - rx.current) * 0.1
      ry.current += (my.current - ry.current) * 0.1
      if (ring.current) {
        ring.current.style.left = rx.current + 'px'
        ring.current.style.top  = ry.current + 'px'
      }
      requestAnimationFrame(loop)
    }

    const over = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('a,button,input,textarea,select,[role="button"],[onclick]')
      if (dot.current)  dot.current.style.transform  = el ? 'translate(-50%,-50%) scale(2.5)' : 'translate(-50%,-50%) scale(1)'
      if (ring.current) ring.current.style.opacity   = el ? '0' : '1'
    }

    document.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    const raf = requestAnimationFrame(loop)

    return () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dot} style={{
        position:'fixed', width:'10px', height:'10px',
        background:'var(--red)', borderRadius:'50%',
        pointerEvents:'none', zIndex:9995,
        transform:'translate(-50%,-50%)',
        transition:'transform .12s, opacity .2s',
        opacity:0,
      }}/>
      <div ref={ring} style={{
        position:'fixed', width:'32px', height:'32px',
        border:'1px solid rgba(200,16,46,.45)', borderRadius:'50%',
        pointerEvents:'none', zIndex:9994,
        transform:'translate(-50%,-50%)',
      }}/>
    </>
  )
}
