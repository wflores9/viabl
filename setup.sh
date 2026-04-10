#!/bin/bash
mkdir -p src/app/api/analyze "src/app/api/analysis/[id]" src/app/api/checkout "src/app/api/webhook/stripe" src/app/api/subscribe src/app/analyze "src/app/analyzing/[id]" "src/app/results/[id]" "src/app/brand/[id]" "src/app/checkout/[id]" "src/app/confirm/[id]" src/components/ui src/components/sections src/lib/ai src/lib/stripe src/lib/email src/lib/db src/store src/types public 2>/dev/null

cat > package.json << 'EOF'
{"name":"viabl","version":"1.0.0","private":true,"scripts":{"dev":"next dev","build":"next build","start":"next start","lint":"next lint"},"dependencies":{"@anthropic-ai/sdk":"^0.39.0","@supabase/supabase-js":"^2.43.0","clsx":"^2.1.1","framer-motion":"^11.3.0","next":"14.2.5","react":"^18","react-dom":"^18","resend":"^3.2.0","stripe":"^16.0.0","tailwind-merge":"^2.3.0","zustand":"^4.5.4"},"devDependencies":{"@types/node":"^20","@types/react":"^18","@types/react-dom":"^18","autoprefixer":"^10.4.19","eslint":"^8","eslint-config-next":"14.2.5","postcss":"^8.4.38","tailwindcss":"^3.4.4","typescript":"^5"}}
EOF

cat > tsconfig.json << 'EOF'
{"compilerOptions":{"lib":["dom","dom.iterable","esnext"],"allowJs":true,"skipLibCheck":true,"strict":true,"noEmit":true,"esModuleInterop":true,"module":"esnext","moduleResolution":"bundler","resolveJsonModule":true,"isolatedModules":true,"jsx":"preserve","incremental":true,"plugins":[{"name":"next"}],"paths":{"@/*":["./src/*"]}},"include":["next-env.d.ts","**/*.ts","**/*.tsx",".next/types/**/*.ts"],"exclude":["node_modules"]}
EOF

cat > next.config.ts << 'EOF'
import type { NextConfig } from 'next'
const nextConfig: NextConfig = {}
export default nextConfig
EOF

cat > tailwind.config.ts << 'EOF'
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
EOF

cat > postcss.config.js << 'EOF'
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }
EOF

cat > .gitignore << 'EOF'
.env.local
.env*.local
node_modules/
.next/
out/
*.tsbuildinfo
.DS_Store
EOF

cat > .env.example << 'EOF'
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_REPORT=
STRIPE_PRICE_FOUNDER_PACK=
STRIPE_PRICE_LAUNCH_KIT=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=reports@viabl.co
NEXT_PUBLIC_APP_URL=https://viabl.co
NODE_ENV=development
EOF

echo "✓ Config files done"
