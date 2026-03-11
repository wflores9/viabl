export const metadata = {
  title: 'Viabl — Is Your Idea Worth Building?',
  description: 'Get a full AI business viability report in 60 seconds. Market size, competition, revenue models, risks, and a go/no-go score.',
  metadataBase: new URL('https://viabl.co'),
  openGraph: {
    title: 'Viabl — Is Your Idea Worth Building?',
    description: 'AI-powered business viability analysis in 60 seconds.',
    url: 'https://viabl.co',
    siteName: 'Viabl',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Viabl — Is Your Idea Worth Building?',
    description: 'AI-powered business viability analysis in 60 seconds.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#080808' }}>{children}</body>
    </html>
  )
}
