import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Cursor } from '@/components/ui/Cursor'

export const metadata: Metadata = {
  title: 'Viabl — Know Before You Build',
  description: 'AI-powered business viability analysis in 60 seconds. Market size, competition, risks, and a complete brand identity kit.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://viabl.co'),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Viabl — Know Before You Build',
    description: 'AI-powered business viability analysis in 60 seconds.',
    url: 'https://viabl.co',
    siteName: 'Viabl',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Viabl — Know Before You Build',
    description: 'AI-powered business viability analysis in 60 seconds.',
  },
}

export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, maximumScale: 1, themeColor: '#050505'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Barlow+Condensed:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Viabl",
          "url": "https://viabl.co",
          "description": "AI-powered business viability analysis for founders",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "AggregateOffer",
            "lowPrice": "0",
            "highPrice": "149",
            "priceCurrency": "USD",
            "offerCount": "4"
          },
          "featureList": [
            "Market size analysis",
            "Competition scoring",
            "Revenue potential modeling",
            "Risk assessment",
            "Brand identity generation",
            "Pitch deck creation",
            "GTM playbook"
          ]
        })}}
      />
      <body>
        <Cursor />
        {children}
      </body>
    </html>
  )
}
