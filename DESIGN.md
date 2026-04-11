# Viabl Design System
> For AI coding agents — read this before generating any UI for Viabl.

---

## Identity

Viabl is a business viability analyzer for founders. The aesthetic is **analyst meets streetwear** — Bloomberg Terminal if it dressed like OFF-WHITE. Data-dense, typographically sharp, warm-dark, ruthlessly honest. No decoration for its own sake. Every element earns its place.

Closest references: Nothing Phone OS + The Verge (acid-mint) + Vercel (cold grid precision).

---

## Color Tokens

| Token      | Hex       | Role                                      |
|------------|-----------|-------------------------------------------|
| `--bg`     | `#0e0c0a` | Page background — warm black, not pure    |
| `--s1`     | `#1a1714` | Card surface — primary elevation          |
| `--s2`     | `#201d19` | Raised surface — hover, inputs            |
| `--s3`     | `#272320` | Highest surface — dropdowns, tooltips     |
| `--border` | `#2e2a25` | Default border                            |
| `--border2`| `#3a3530` | Elevated border                           |
| `--text`   | `#f2ede8` | Primary text — warm white, not pure       |
| `--m1`     | `#8a8178` | Muted text — secondary info               |
| `--m2`     | `#5a544d` | Very muted — labels, metadata, timestamps |
| `--acid`   | `#d4ff00` | Primary accent — CTAs, scores, verdicts   |
| `--ok`     | `#22c55e` | GO verdict, positive metrics              |
| `--warn`   | `#f97316` | MAYBE verdict, caution                    |
| `--danger` | `#ef4444` | NO verdict, risk indicators               |
| `--yellow` | `#eab308` | Elevated caution, test mode badges        |

**Rules:**
- Acid (`#d4ff00`) is used ONLY on: CTAs, active states, scores, accent lines, live indicators
- Never use acid for body text or decorative purposes
- Backgrounds are never pure black — always warm dark
- No purple, no gradients on surfaces, no blue except ZenBusiness partner elements

---

## Typography

**Display font:** `Bebas Neue` — variable `--font-bebas`
- Headlines, scores (large numbers), CTAs, verdict labels, step numbers
- Letter spacing: `0.02em` to `0.12em` depending on size
- Never use for body copy or labels

**Body / UI font:** `DM Mono` — variable `--font-dm-mono`
- Everything else: labels, body text, inputs, metadata, tags, prices
- Default size: `13px` for body, `9-10px` for labels/metadata
- Label tracking: `0.14em–0.22em`, always `uppercase`
- No other fonts. Ever.

**Three-layer visual hierarchy (from Nothing design system):**
1. **Display** — Bebas Neue, large, acid or white. Score numbers, headlines, verdicts.
2. **Body** — DM Mono 13px, `--m1`. Explanatory text, paragraphs.
3. **Metadata** — DM Mono 9px uppercase tracked, `--m2`. Labels, timestamps, IDs, tags.

---

## Spacing & Layout

- Max content width: `1100px` (report/landing), `740px` (forms), `680px` (analyzing)
- Card gap (grid seam effect): `3px` — not `gap-4`, not `gap-2`, exactly `3px`
- Card padding: `24px` default, `32px` for forms and hero cards
- Section label margin-bottom: `10px`
- Navbar height: `53px` fixed

**Grid patterns:**
- Two-column report cards: `grid-cols-1 md:grid-cols-2 gap-px bg-border`
- Tier cards: `grid-cols-2 md:grid-cols-4 gap-px bg-border`
- How it works: `grid-cols-2 lg:grid-cols-4 gap-px bg-border`

The `gap-px bg-border` pattern creates a 1px seam between cards using the border color as background — this is the signature layout motif. Do not use regular `gap-*` for card grids.

---

## Component Rules

### Buttons
Primary CTA:   bg-acid text-black font-bebas tracking-[0.1em] — no border-radius
Ghost:         bg-transparent border border-border2 text-muted1 font-mono text-[11px]
Danger:        bg-danger text-white
Disabled:      opacity-40 cursor-not-allowed
Hover:         -translate-y-px + shadow-[0_8px_32px_rgba(212,255,0,0.28)] on primary

### Cards
Background:    bg-s1 border border-border
Hover:         bg-s2 (transition-colors)
Padding:       p-6 (24px) default
Section label: .section-label class (9px mono uppercase tracked with ::after line)

### Inputs / Textareas / Selects
Background:    bg-s1 (or bg-bg for intake form fields)
Border:        border-border2, focus:border-acid
Font:          font-mono text-[13px] (16px on mobile to prevent iOS zoom)
Padding:       p-[14px_16px]
No border-radius

### Section Labels
```css
.section-label {
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--m2);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}
```

### Accent Line
height: 2px
background: linear-gradient(90deg, var(--acid), transparent)
margin-bottom: 3px
Used at the top of major content sections.

### Meter Bars (from existing repo)
Track:  h-[3px] bg-border2
Fill:   bg-ok (≥70) | bg-yellow (45-69) | bg-danger (<45)
Label:  font-mono text-[10px] text-muted2 w-[140px]
Value:  font-mono text-[10px] font-medium w-[26px] text-right
Note:   Competition and risk metrics are inverted (100 - value)

### Progress / Analyzing Screen (Nothing dot-matrix influence)
Counter:    font-bebas text-[148px] text-acid — the dominant element
% symbol:   text-[56px] text-acid/35 — subdued, positioned bottom-right of number
Track:      h-[2px] bg-border — thin, architectural
Fill:       bg-acid transition-all
Task rows:  grid-cols-[36px_1fr_72px] — icon | name+status | duration
Task icon:  w-8 h-8 border — queued:border-border2 | running:border-acid | done:bg-acid

### Paywall Gate
Blur:     blur-[5px] on locked content rows
Overlay:  linear-gradient(to bottom, transparent, rgba(14,12,10,0.75) 18%, rgba(14,12,10,0.97) 32%)
Tiers:    grid-cols-2 md:grid-cols-4 gap-px bg-border inside overlay
Featured: bg-acid text-black — all child text forced to black

---

## Verdict System

| Verdict | Score | Background | Usage |
|---------|-------|------------|-------|
| GO      | ≥70   | `#16a34a`  | Strong positive |
| MAYBE   | 45-69 | `#d97706`  | Conditional |
| NO      | <45   | `#dc2626`  | Negative |

Score number color matches verdict: acid for GO, yellow for MAYBE, danger for NO.

---

## Grain & Atmosphere

```css
/* Grain texture — always present */
body::after {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512'...");
  opacity: 0.025;
  pointer-events: none;
  z-index: 9999;
}

/* Warm vignette */
body::before {
  background: radial-gradient(ellipse at 50% 0%, rgba(212,180,120,.04) 0%, transparent 70%);
  pointer-events: none;
}
```

---

## What NOT to Do

- No rounded corners (except `rounded-full` for dot indicators and check rings)
- No gradients on card backgrounds or surfaces
- No purple anywhere
- No `Inter`, `Roboto`, `Arial`, `Space Grotesk` or any sans-serif
- No `gap-4` or `gap-2` between major card grids — use `gap-px bg-border`
- No acid (#d4ff00) on body text or decorative elements
- No emojis in UI (only in stage selector cards and educational resource icons)
- No border-radius on buttons, inputs, cards, or tags
- Never use `rounded-lg`, `rounded-md`, `rounded-sm`
- Don't soften the design — it should feel like a tool, not a product

---

## Page-Specific Notes

### `/` Landing
- Hero: `clamp(72px, 9vw, 136px)` Bebas Neue headline
- Terminal widget: static fake terminal showing scores — dark surface, red/yellow/green dots
- How it works: 4-col card grid with large ghost numbers (acid/4 opacity) as background decoration

### `/analyze` Step 1 (Intake Form — DO NOT CHANGE LAYOUT)
YOUR BUSINESS IDEA   ← textarea, full width, border turns acid on focus/typing
INDUSTRY             ← select dropdown, full width, stacked below
TARGET CUSTOMER      ← text input, full width, stacked below
[ RUN VIABL CHECK → ]  ← full-width acid button, Bebas Neue
Free preview · 60 seconds · No signup  ← muted metadata below CTA
This layout is locked. Do not side-by-side, do not reorder, do not add fields.

### `/results/[id]` Report
- Verdict banner: left acid stripe (w-[3px]) + large score number + verdict badge
- All 9 metric bars visible free
- Revenue models + risks: 2-col grid
- Next 3 moves: numbered 01/02/03 in acid Bebas
- Paywall: blurred fake rows + 4-tier gate overlay

### `/analyzing/[id]`
- Centered layout, `max-w-[680px]`
- Giant % counter is the hero — 148px Bebas Neue
- Task list below, left-aligned

---

## File Conventions
Pages:       src/app/[route]/page.tsx
UI prims:    src/components/ui/PascalCase.tsx
Sections:    src/components/sections/PascalCase.tsx
API routes:  src/app/api/[route]/route.ts
Types:       src/types/index.ts — single source of truth
Store:       src/store/viabl.ts — Zustand

