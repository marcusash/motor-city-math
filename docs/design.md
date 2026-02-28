# Design — Motor City Math Visual Design System

## Quick Reference

Motor City Math uses the Detroit Pistons color palette with a bold, confident design language. Built for focus. Minimal distraction.

## Pistons Palette

| Name | Hex | Use |
|------|-----|-----|
| Red | `#C8102E` | Primary CTA, correct answer flash, key points on graphs |
| Blue | `#1D42BA` | Secondary CTA, chart lines, links |
| Navy | `#002D62` | Headers, dark backgrounds |
| Chrome | `#BEC0C2` | Borders, grid lines, secondary text |
| White | `#FFFFFF` | Card backgrounds, input fields |

## Typography

- Headings: `'Inter', sans-serif` — bold, clear
- Body: `'Inter', sans-serif` — regular weight
- Math: MathJax (local bundle) — LaTeX rendering
- Code: `'Courier New', monospace` — for technical notation

## Component Rules

- Cards: white background, `border-radius: 8px`, subtle shadow
- Buttons: full-width on mobile, rounded, 44px min tap target (ADHD, motor)
- Feedback: appears inline below input, fades in 200ms, disappears after 3s
- Progress bar: shows question X of N, always visible at top

## ADHD Design Principles

1. One action at a time
2. Clear hierarchy — one thing is most important per screen
3. No carousels, no slides, no animations longer than 300ms
4. Large tap targets on mobile
5. Generous whitespace — breathing room reduces anxiety

## Full Specification

See `.design-system.md` for the complete design spec (typography scale, spacing system, responsive breakpoints, dark mode, print styles, animation guidelines).

---

*Owner: FD (design system) + GD (implementation) | GP (doc summary)*
