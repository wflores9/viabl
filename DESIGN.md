# Viabl Design System

## Color Tokens
| Token     | Hex       | Usage                          |
|-----------|-----------|--------------------------------|
| `--bg`    | `#0e0c0a` | Page background                |
| `--s1`    | `#1a1714` | Card background                |
| `--s2`    | `#201d19` | Elevated surface               |
| `--s3`    | `#272320` | Hover state                    |
| `--border`| `#2e2a25` | Default border                 |
| `--border2`| `#3a3530`| Elevated border                |
| `--text`  | `#f2ede8` | Primary text                   |
| `--m1`    | `#8a8178` | Muted text                     |
| `--m2`    | `#5a544d` | Very muted / labels            |
| `--acid`  | `#d4ff00` | Primary accent — CTAs, scores  |
| `--ok`    | `#22c55e` | Positive / GO verdict          |
| `--warn`  | `#f97316` | Warning / MAYBE verdict        |
| `--danger`| `#ef4444` | Risk / NO verdict              |
| `--yellow`| `#eab308` | Caution                        |

## Typography
- **Display**: `Bebas Neue` — headlines, scores, CTAs, verdicts
- **Body/UI**: `DM Mono` — everything else, monospace feel throughout

## Spacing
- Gap between stacked cards: `3px` (not a full gap, creates grid seam effect)
- Card padding: `24px` default, `32px` for forms
- Max content width: `1100px` (report), `740px` (forms), `680px` (analyzing)

## Component Rules
- No rounded corners except `rounded-full` for dot indicators
- No gradients on backgrounds — grain texture only
- Acid used ONLY on: CTAs, active states, scores, verdicts, accent lines
- Section labels: 9px, 0.22em tracking, uppercase, with `::after` line

## Verdict Colors
- GO → `#16a34a` (green)
- MAYBE → `#d97706` (amber)
- NO → `#dc2626` (red)

## Paywall Pattern
- Blur: `blur-[5px]` on locked content
- Overlay: gradient from transparent to `rgba(14,12,10,0.97)` at 32%
- Gate: 4-tier TierCard grid inside overlay

## File Naming
- Pages: `src/app/[route]/page.tsx`
- Components: `PascalCase.tsx`
- Lib: `camelCase.ts`
- API routes: `src/app/api/[route]/route.ts`
