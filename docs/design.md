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

## Dashboard activity cards

The current always-dark dashboard uses `shared/activity-cards.js` and scoped
`.activity-card` styles in `index.html`. This contract supersedes the older
white-card summary above for dashboard activities only. Graphs, chart wrappers,
standards tiles, and dormant recent-result components are not part of this change.

All Fall, Spring and Winter activity/resource cards use the same shell:

1. Content/source label, full-width wrapping title, then known subject/standards.
2. A separate neutral percentage row. Preserve recorded precision, including zero.
3. Labeled points, attempt, teacher grade, teacher rubric, teacher standards,
   known question count and duration, in that order. Omit unavailable fields.
4. Footer with the available date and its provenance, a short factual note when
   needed, and one destination label. PDF links announce their new tab.

| Variant | Use |
|---|---|
| `teacher-result` | Teacher assessments/quizzes; rubric and standards are separate from calculated percentages and raw points. |
| `practice-result` | Practice, scan-based review or homework; the source label distinguishes them. |
| `resource` | Unscored resources; show a neutral status, not a fabricated percentage or attempt. |

Spring still uses GitHub results over local results, sorts by the latest
timestamp, hides absent records and displays the latest attempt. Winter still
sorts by first-attempt date and displays the latest recorded percentage; when
that percentage is missing, its existing first-attempt fallback is explicitly
labeled. A recorded zero is not missing. Archived activities without a record say
"No score recorded", not "Not attempted". A points denominator never supplies a
question count. Teacher rubric values are never converted into percentages.
Fall totals continue to come from the existing report score rows; review/scan
dates retain their original meaning. No score selection or persistence is changed.

Cards have identical padding, borders, title/result typography and metadata order.
The existing responsive grid stretches each row; text wraps without truncation,
absolute badges, fixed title heights or nested controls. Cards with destinations
are links with visible keyboard focus; records without destinations are articles.
Unknown subjects are omitted rather than guessed. `render` escapes all text and
attribute values.

Regression coverage: `tests/dashboard-cards.test.cjs` checks variants, missing/
zero/decimal values, teacher rubrics, record policies and immutable graph source
fingerprints from the pre-template baseline. `tests/dashboard-cards.browser.test.cjs`
checks cards at 320/390/768/1280px, a 200%-zoom-equivalent narrow CSS viewport,
keyboard focus, overflow and same-data before/after graph images when supplied
the baseline HTML via `MCM_CARD_BASELINE`.

The #23 review evidence is retained in `artifacts/dashboard-card-templates/`:
390px and 1280px before/after card grids and paired 1280px graph captures.
The browser comparison uses identical score fixtures and clock, exact SVG markup
and dimensions, and at most one raster channel level of Chromium rounding.
Only capture position is normalized, because taller cards move later graphs to
different document offsets; no production graph styles or geometry are changed.
The 640px viewport at device scale factor 2 represents a 1280px display at 200%
zoom; it is a reflow-equivalent check, not an actual browser-toolbar zoom test.

---

*Owner: FD (design system) + GD (implementation) | GP (doc summary)*
