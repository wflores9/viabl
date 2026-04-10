import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, DM_Mono } from 'next/font/google'
import './globals.css'
const bebas = Bebas_Neue({ weight:'400', subsets:['latin'], variable:'--font-bebas', display:'swap' })
const mono = DM_Mono({ weight:['300','400','500'], subsets:['latin'], variable:'--font-dm-mono', display:'swap' })
export const metadata: Metadata = {
  title: 'Viabl — Know Before You Build',
  description: 'AI-powered business viability analysis in 60 seconds.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://viabl.co'),
  icons: { icon: '/favicon.svg' },
}
export const viewport: Viewport = { width:'device-width', initialScale:1, maximumScale:1, themeColor:'#0e0c0a' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${bebas.variable} ${mono.variable}`}><body>{children}</body></html>
}
