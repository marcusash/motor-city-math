# MCM Craft Foundations

Spacing, grid, layout, and typography rules for MCM. The "how does it fit together" file.

## Spacing System (4px Grid)

MCM uses a strict 4px base grid. All spacing values are multiples of 4.

| Context | Value | Token / Usage |
|---------|-------|---------------|
| Inline element gap | 4px | Icon + label gap |
| Within cards | 8px | Card interior padding |
| Input internal padding | 12px | Input left/right |
| Section padding | 16px | Card padding from edge |
| Between sections | 24px | Gap between card groups |
| Major separation | 32px | Between dashboard zones |
| Full-width gutter | 40px | Outer container margin |

**Rule:** Never spec a spacing value that is not on this scale. If 10px "feels right," round to 8px or 12px. Arbitrary values break the grid and accumulate debt.

## Card System

MCM UI is card-based. Card rules:

- Border-radius: `8px` (cards), `4px` (inputs, badges)
- Border: `1px solid` with the appropriate border token
- Shadow: **none** (MCM uses borders for depth, not shadows)
- Background: `--bg-card` (light) or `--bg-card-dark` (dark)
- Padding: 16px (standard), 24px (featured/hero cards)

**Anti-pattern:** No dramatic drop shadows on MCM cards. Elevation is communicated with border color and contrast, not shadow depth.

## Typography Scale

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `--text-4xl` | 40px | 700 | Score display, hero numbers |
| `--text-3xl` | 32px | 700 | Page title |
| `--text-2xl` | 24px | 600 | Section heading |
| `--text-xl` | 20px | 600 | Card heading |
| `--text-lg` | 18px | 400 | Lead paragraph |
| `--text-base` | 16px | 400 | Body, labels |
| `--text-sm` | 14px | 400 | Meta, captions |
| `--text-xs` | 12px | 400 | Legal, footnotes (use sparingly) |

**Headline rules:**
- Weight: 600 minimum for headings
- Tracking: `-0.02em` (tight — MCM is confident, not airy)
- No decorative fonts. System font stack only.
- Math content: KaTeX + Times New Roman (isolated, not mixed into UI text)

**Body rules:**
- Weight: 400 or 500 only
- Line height: 1.5 for paragraph, 1.25 for labels
- No centered body text (left-aligned for legibility)

## Color Token System (Two Coexisting Systems)

MCM has two CSS token systems:

| System | Tokens | Where | Owner |
|--------|--------|-------|-------|
| Shared | `--text-*`, `--bg-*`, `--border-*` | shared/styles.css | GA |
| FD-origin | `--fd-text-*`, `--fd-bg-*` | index.html only | GD spec, GA build |

**Rule:** Never mix systems. If a spec touches index.html, use `--fd-*` tokens. If a spec touches shared UI (dashboard, exam picker), use `--text-*` tokens. When in doubt, ask GA which system the target file uses.

## Grade Threshold System

Grade 4 (highest) = 92%+ score. Three places in the codebase encode this value:

1. `grade4` CSS class trigger
2. `grade-a-flash` animation trigger
3. Chart legend "92%+" label

**Rule:** All three must match. If Marcus changes the threshold, all three must be updated in the same commit. This is a system invariant — spec it as a linked change.

## Contrast Requirements

Minimum ratios (WCAG AA):
- Body text on any background: 4.5:1
- Large text (18px+ bold or 24px+ regular): 3:1
- Interactive elements (focus rings, borders): 3:1
- Placeholders: must NOT use opacity reduction. Set explicit color instead.

**Current known WCAG gaps (as of Sprint 6):**
- Focus ring in light mode: `#1D42BA` on white = 2.09:1 FAIL (fix: `#4A90D9`)
- G4 badge: check dark mode contrast (spec filed to GA)
- Error message text: verify on dark background

## Layout

**Dashboard:**
- Two-column grid (sidebar + main) on desktop
- Mobile: single column stack (sidebar collapses to top strip)

**Exam:**
- Full-screen, centered content, max-width 720px
- Question number + progress always visible (top bar, not page scrollable)
- Timer in top-right, remaining time only

**Scorecard:**
- Full-width table for question-by-question breakdown
- Print-ready (separate print.css, no JavaScript required to print)
