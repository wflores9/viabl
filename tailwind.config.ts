import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: { bebas: ['var(--font-bebas)','sans-serif'], mono: ['var(--font-dm-mono)','monospace'] },
      colors: { bg:'#0e0c0a',bg2:'#141210',s1:'#1a1714',s2:'#201d19',s3:'#272320',border:'#2e2a25',border2:'#3a3530',cream:'#f2ede8',acid:'#d4ff00',danger:'#ef4444',warn:'#f97316',ok:'#22c55e',yellow:'#eab308',muted1:'#8a8178',muted2:'#5a544d' },
      animation: { 'pulse-dot':'pulseDot 2s infinite','blink':'blink 0.9s step-end infinite','fade-up':'fadeUp 0.4s ease both','pop-in':'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both' },
      keyframes: { pulseDot:{'0%,100%':{opacity:'1'},'50%':{opacity:'0.25'}},blink:{'0%,100%':{opacity:'1'},'50%':{opacity:'0'}},fadeUp:{from:{opacity:'0',transform:'translateY(16px)'},to:{opacity:'1',transform:'translateY(0)'}},popIn:{from:{transform:'scale(0)',opacity:'0'},to:{transform:'scale(1)',opacity:'1'}} },
    },
  },
  plugins: [],
}
export default config
