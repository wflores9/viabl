import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        bebas:   ['var(--font-bebas)',   'sans-serif'],
        mono:    ['var(--font-dm-mono)', 'monospace'],
        playfair:['var(--font-playfair)','serif'],
        barlow:  ['var(--font-barlow)',  'sans-serif'],
      },
      colors: {
        bg:'#050505', bg2:'#0C0C0C', s1:'#0C0C0C', s2:'#111111', s3:'#161616',
        border:'rgba(255,255,255,0.07)', border2:'rgba(255,255,255,0.1)',
        cream:'#F0EDE6', acid:'#d4ff00',
        red:'#C8102E', gold:'#C4973A', dim:'#737068',
        danger:'#ef4444', warn:'#f97316', ok:'#3DAA6A', yellow:'#C4973A',
        muted1:'#9a9388', muted2:'#737068',
      },
    },
  },
  plugins: [],
}
export default config
