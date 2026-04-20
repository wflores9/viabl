export default function Privacy() {
  return (
    <main style={{ maxWidth:'720px', margin:'0 auto', padding:'6rem 2rem', fontFamily:'var(--font-dm-mono),monospace' }}>
      <div style={{ fontSize:'.7rem', letterSpacing:'.3em', textTransform:'uppercase', color:'var(--red)', marginBottom:'2rem' }}>Privacy Policy</div>
      <h1 style={{ fontFamily:'var(--font-playfair),serif', fontSize:'3rem', fontWeight:900, marginBottom:'3rem' }}>Privacy Policy</h1>
      <div style={{ fontSize:'.9rem', color:'var(--dim)', lineHeight:2, display:'flex', flexDirection:'column', gap:'2rem' }}>
        <section><h2 style={{ color:'var(--white)', marginBottom:'.5rem', fontSize:'1rem', letterSpacing:'.1em', textTransform:'uppercase' }}>Data We Collect</h2><p>We collect the business idea text you submit, your email address when provided for report delivery, and standard analytics data (page views, session duration). We do not collect personal identifying information beyond what is necessary to deliver your report.</p></section>
        <section><h2 style={{ color:'var(--white)', marginBottom:'.5rem', fontSize:'1rem', letterSpacing:'.1em', textTransform:'uppercase' }}>How We Use Your Data</h2><p>Your idea text is used solely to generate your viability analysis. We do not sell, share, or use your idea for any purpose other than delivering your report. Email addresses are used only for report delivery.</p></section>
        <section><h2 style={{ color:'var(--white)', marginBottom:'.5rem', fontSize:'1rem', letterSpacing:'.1em', textTransform:'uppercase' }}>Third Parties</h2><p>We use Stripe for payment processing, Anthropic for AI analysis, and Resend for email delivery. Each operates under their own privacy policies. We do not share your idea text with any third party beyond what is required to process your analysis.</p></section>
        <section><h2 style={{ color:'var(--white)', marginBottom:'.5rem', fontSize:'1rem', letterSpacing:'.1em', textTransform:'uppercase' }}>Data Retention</h2><p>Analysis results are retained for 90 days to allow report re-access. You may request deletion of your data at any time by emailing hello@viabl.co.</p></section>
        <section><h2 style={{ color:'var(--white)', marginBottom:'.5rem', fontSize:'1rem', letterSpacing:'.1em', textTransform:'uppercase' }}>Contact</h2><p>hello@viabl.co</p></section>
      </div>
    </main>
  )
}
