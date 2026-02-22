# MCM Dashboard — Prototype Archive v1

**Project:** Motor City Math (MCM) — Kai Stats Dashboard
**Designer:** FD (Design Director, Forge)
**Session:** Feb 22, 2026
**Status:** Shipped — mockup-ab.html is the design-locked reference

---

## Files in This Project

### Primary Deliverable

**`C:\Github\kai-algebra2-tests\mockup-ab.html`**
Full-page dashboard prototype. A/B selector at top: A = Fill (locked winner), B = Gradient (archived reference).
Contains: hero card, progress chart, Practice 1-3 test cards, navigation tiles.
Status: Production-ready. GA/GD implement from this file.

### Design Reviews

**`C:\Github\kai-algebra2-tests\scorecard.html`** — Scorecard #1
First formal A/B comparison after pivoting to two final variants. FD initially recommended B (Gradient). This document is historical — FD's initial call was wrong.
Fix audit: 6/7 issues resolved, 1 partial, 6 remaining issues identified.

**`C:\Github\kai-algebra2-tests\scorecard-2.html`** — Scorecard #2
Post-pivot review after Marcus correctly identified Fill as the better variant. Documents all resolved issues, fill design philosophy, and 4 remaining open items.
Status: Most current critique record.

### Variant Explorer

**`C:\Github\kai-algebra2-tests\chart-variants.html`** — V1-V7 Chart Explorer
7 chart variants explored before locking A/B. Selector bar at top.
- V1 (Rails): gradient fill + dual rail labels — liked fill, hated rails
- V2 (Zones): too many colors (A/B/C each colored)
- V3 (Gradient): gradient stroke on FA line — right direction, wrong semantics for this use case
- V4 (Area): overdone glow, removed RIB which broke the story
- V5 (Minimal): worst variant — thin lines, no fill, cold and flat. Archived as BAD EXAMPLE.
- V6 (Fill): the winner. Diagonal fill, equal grade spacing, clean opacity hierarchy.
- V7 (Gradient stroke): retained as alternative reference but not the locked choice.

### Original Prototype

**`C:\Github\kai-algebra2-tests\mockup.html`** — Original 4-option mockup
Early exploration before SVG charts were built. Options A-D explored full-page layout patterns.
Status: Archived. Not modified in this session.

---

## Design Decisions Log

### Fill vs. Gradient Stroke

FD initially recommended B (Gradient Stroke) in scorecard.html. Marcus pushed back with a key insight: the fill area GROWS as Kai's score line climbs. At a 47% start, the fill is barely visible. At 88%, it covers most of the chart. The growing visual mass IS the progress narrative — not decoration.

FD re-examined the reasoning and acknowledged the error. Fill was locked as the winner.

**Lesson:** Dynamic fill in a progress chart is semantically correct when the accumulation of area maps to accumulation of achievement. Don't flatten this to a static aesthetic judgment.

### Opacity Hierarchy

Spent significant iteration time calibrating RIB muted track opacity. Values tested:
- 22%: Too faint — invisible in the fill zone
- 38%: Too bright — competed with primary FA data line
- 28%: Calibrated value. Visible for orientation, subordinate to data.

This calibration process is normal and expected for dark-mode charts. Start with a guess, test at actual render size, iterate twice.

### Grade Line Equal Spacing

A=93%, B=80%, C=70% map to y=25.1, 45.7, 61.5 in the SVG formula. The A-B gap (20.6px) and B-C gap (15.8px) are unequal because the thresholds themselves are unequal.

Marcus requested equal visual spacing. C moved to y=66.3 (matching 20.6px gap from B). This is a visual spacing decision, not a mathematical mapping decision. The chart is a student progress tool, not an academic plot.

### Badge Semantics

"Below A" and similar state badges: changed from blue-tinted (#7A9BF0 derived) to neutral gray. Blue tints in dark UIs read as interactive/link affordance. State-only badges that are not interactive must be visually neutral (gray) or achievement-positive (green).

### A Line Visual Weight

Kai's goal is the A threshold. It should read with authority. Changes made:
- A grade line opacity: 48% to 65%
- A label: 10px to 12px, full opacity green
- "Target: A (93%+)" header text: bumped to 0.82rem bold green

The goal is the most important information on the card. Design should reflect that.

---

## Design Tokens (Locked)

```css
--bg: #0d1117;
--card: #161b22;
--raised: #1c2128;
--green: #3FB950;
--text-1: #E6EDF3;
--text-2: #8B949E;
--text-3: #6E7681;
--border: #21262d;
--border2: #30363d;
--r: 10px;
```

---

## SVG Coordinate Reference

```
viewBox="0 0 590 120"
y(score) = 14 + 95*(1 - (score-40)/60)  [range 40-100%, 14px top pad, 95px chart height]

Grade lines (equal visual spacing):
  A (93%): y = 25.1
  B (80%): y = 45.7
  C (70%): y = 66.3 (adjusted for equal spacing — formula would give 61.5)

FA data points: (50,97.9) (213,74.2) (377,42.5) (540,33)
RIB data points: (213,34.6) (377,28.3) (540,21.9)
x positions: 50, 213, 377, 540

Fill gradient: x1=50 y1=108 to x2=540 y2=22 (diagonal, userSpaceOnUse)
  Stops: 0%=rgba(255,255,255,0.01), 55%=rgba(255,255,255,0.08), 100%=rgba(255,255,255,0.17)
Fill baseline: y=108, closed to x=50
```

---

## Prototyping Session Notes

This session was a long design iteration loop — screenshot, critique, fix, relaunch, repeat. Two formal HTML scorecards were built (scorecard.html, scorecard-2.html) to track fix audit status and give Marcus a rich comparison view instead of reading critique text in the terminal.

FD and Marcus discovered together through this process that the critique-scorecard loop is faster and more precise than prose chat critique. When you're down to 2 variants and multiple rounds of fixes, build the scorecard. It externalizes the design judgment in a form Marcus can actually read at screen scale.

See `C:\Github\journal\docs\skills\fd-prototyping.md` for the full methodology developed in this session.
