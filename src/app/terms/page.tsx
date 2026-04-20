export default function Terms() {
  return (
    <main style={{ maxWidth:'720px', margin:'0 auto', padding:'6rem 2rem', fontFamily:'var(--font-dm-mono),monospace' }}>
      <div style={{ fontSize:'.7rem', letterSpacing:'.3em', textTransform:'uppercase', color:'var(--red)', marginBottom:'2rem' }}>Terms of Service</div>
      <h1 style={{ fontFamily:'var(--font-playfair),serif', fontSize:'3rem', fontWeight:900, marginBottom:'3rem' }}>Terms of Service</h1>
      <div style={{ fontSize:'.9rem', color:'var(--dim)', lineHeight:2, display:'flex', flexDirection:'column', gap:'2rem' }}>
        <section><h2 style={{ color:'var(--white)', marginBottom:'.5rem', fontSize:'1rem', letterSpacing:'.1em', textTransform:'uppercase' }}>The Service</h2><p>Viabl provides AI-powered business viability analysis. Results are informational only and do not constitute financial, legal, or business advice. You are solely responsible for any decisions made based on Viabl analysis.</p></section>
        <section><h2 style={{ color:'var(--white)', marginBottom:'.5rem', fontSize:'1rem', letterSpacing:'.1em', textTransform:'uppercase' }}>No Guarantees</h2><p>Viabl analysis reflects AI assessment based on available data at time of generation. Markets change. A high score does not guarantee business success. A low score does not mean your idea will fail. Use this as one input among many.</p></section>
        <section><h2 style={{ color:'var(--white)', marginBottom:'.5rem', fontSize:'1rem', letterSpacing:'.1em', textTransform:'uppercase' }}>Payments & Refunds</h2><p>All purchases are final. Reports are delivered instantly upon payment. If you experience a technical failure that prevents report delivery, contact hello@viabl.co within 24 hours for resolution.</p></section>
        <section><h2 style={{ color:'var(--white)', marginBottom:'.5rem', fontSize:'1rem', letterSpacing:'.1em', textTransform:'uppercase' }}>Intellectual Property</h2><p>You own your idea. We own the analysis format, scoring methodology, and platform. You may use your report for any personal or business purpose.</p></section>
        <section><h2 style={{ color:'var(--white)', marginBottom:'.5rem', fontSize:'1rem', letterSpacing:'.1em', textTransform:'uppercase' }}>Contact</h2><p>hello@viabl.co</p></section>
      </div>
    </main>
  )
}
