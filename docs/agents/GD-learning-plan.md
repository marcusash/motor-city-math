# GD Learning Plan — Design Engineer, Grind Org

> Started: Feb 21, 2026. FR-assigned. Marcus reads this.

---

## Context

I own the Motor City Math design system. My domain: Detroit Pistons visual identity applied to a study tool for Kai (15, ADHD). Pure HTML/CSS/JS, no frameworks. My work ships directly to a student studying for Algebra II retakes. The stakes are real.

---

## Skills Sprint (FR Directive, Feb 21)

Priority skills from skills.sh mapped to my domain:

1. **web-design-guidelines** (115k installs) — formal design standards to fill in gaps the Pistons brand guide doesn't cover
2. **frontend-design** (86k installs) — component architecture and design-to-implementation handoff patterns
3. **Microsoft Inclusive Design** — ADHD patterns. Required for Kai. Not covered by skills.sh.
4. **canvas-design** (9.5k installs) — MCM uses Chart.js. I should be designing those charts, not leaving them to GA with defaults.
5. **WCAG 2.2 AA** — color contrast verification for the Pistons palette, focus management, keyboard nav

---

## The Bar

*FR asked: who are the world-class practitioners in your specific discipline? Honest self-assessment.*

### 1. Ethan Marcotte — Responsive Web Design

Ethan coined responsive design. His bar: layout decisions that serve all screen sizes equally, not "works on desktop, tolerable on mobile." MCM's exam pages currently break at 375px for graph questions. My type scale migration and `.progress-strip` work move us toward Ethan's standard. Where I am today: I can migrate tokens and fix breakpoints. Where Ethan is: he thinks in system terms from day one, never retrofitting. I retrofit. That's the gap.

### 2. Aarron Walter — Designing for Emotion (Maslow for UX)

Aarron's book defined emotional design for the web. His bar: interfaces that are functional, reliable, usable, AND pleasurable. His hierarchy for Kai would say: first get the exam grading right (functional), then make it reliable (no crashes), then make it clear (usable), then make it feel like a coaching session (pleasurable). I've been working mostly at the "pleasurable" layer (coach voice, jersey stripe cards, sparklines) while GA handles the functional/reliable layer. Aarron would say I'm skipping layers. The coach voice scorecard I shipped is closer to his bar than anything else I've done. But it only works because GA made the grading work first. I need to understand the full stack better to design for Aarron's hierarchy properly.

### 3. The Khan Academy Design Team — ADHD-Aware Ed-Tech

No single person here. But Khan Academy's design team holds the bar for educational UI for students with varied attention spans. Their decisions: one concept per screen, progress always visible, mastery before moving on. Their color system is restrained. Their feedback is immediate and specific. My "answered card" blue border and "smart Up Next" hero card are attempts at their standard. Where I am: I implement ADHD patterns when they're specified. Their bar: they derive the patterns from first principles for each new interaction. I'm applying a checklist. They're doing the thinking. That's the gap I'm closing.

---

## Lessons from FD's Design Review (Feb 19)

Seven things I'm changing permanently:

1. **Verify property names against actual data shapes** before writing JS. `last.correct` vs `last.score` cost GA a fix.
2. **Check variable scope** before using values across function boundaries. `tkCorrect` scoping bug was mine.
3. **Design QA is not implementation.** I own review. GA owns build. That boundary is a feature, not a constraint.
4. **Do not modify 70KB legacy files** (nonlinear_exam_mvp.html). Risk of truncation is real. Proven twice.
5. **Canvas hex is acceptable** in Chart.js contexts. CSS custom properties don't work in canvas ctx. Stop flagging it.
6. **Write specs GA can implement directly** — not prose, but structured field-by-field descriptions.
7. **Post-mortem every bug that ships to production.** Not optional. Committed to retro.md.

---

## Open Growth Areas

- Chart design: I haven't touched the Chart.js config. FR is right that I should be designing those graphs.
- Detroit Pistons brand history: I apply the palette but don't know the history behind it. That context makes brand decisions stronger.
- WCAG contrast verification: I don't know if #C8102E on white passes 4.5:1. I should check and document it.

## Session Feb 22 Update
FD Sprint Done (Feb 22): FD Coaching Sprint Complete: T1 T6 T7 T8 T9 T10 T11 T12 T13 T14 T15 T16 T17 T18 T19 T20 T21 T22 T23 T24 T25 all done.
WCAG mistakes caught: fd-text-3 at 3.77:1 (step 2 gap), B/C chart labels at 10px (T1 audit).
Product ideas filed to GA: autosave, progress-indicator, focus-ring, score-scroll, hint-state, pointer-coarse, arena-cleanup.
The Bar additions: Kat Holmes (design from constraint not to it), Susan Kare (legibility audit pending).
---

## Session 2 Update - Feb 22, 2026 (Autonomous Sprint)

### FD Coaching Sprint - COMPLETE
All 25 tasks submitted to FD inbox:
- T1 SVG chart audit: 4 opacity gaps found, filed to GA
- T2 Score reveal animation spec: 3-phase spec with reduced-motion fallback
- T3 Progress bar color rules: personal doc, 6 rules
- T4 Streak visualization spec: flame icon, milestone thresholds, computation logic
- T5 Score/time overlay spec: submitted
- T6 Arena Mode WCAG audit: submitted (large task)
- T7 fd-text-3 fix: 3.77 to 4.81 via #7E8895 (prior session)
- T8 WCAG personal checklist: 8-step protocol, GF-runnable
- T9 Icon audit: 0 hard failures, std-bar aria-label gap found
- T10-T25: submitted

### QA Wins This Session
1. Reduced-motion missing on GA's score animation: GD caught it, fixed in f875e86
2. Pistons Red/Blue fail on dark backgrounds (WCAG audit): GD discovered, reported to FD
3. tier-mid .std-pct uses #1D42BA on dark = 2.09:1 FAIL: filed bug spec to GA with #4A90D9 fix
4. RP8/RP9 design QA: PASS (prior sub-session)

### WCAG Audit Findings Table (Pistons palette on dark)
| Color | On #161b22 | Status |
|-------|-----------|--------|
| #C8102E Pistons Red | 2.94:1 | FAIL text, FAIL non-text |
| #1D42BA Pistons Blue | 2.09:1 | FAIL text, FAIL non-text |
| #002D62 Pistons Navy | 1.28:1 | FAIL |
| #BEC0C2 Chrome | 9.48:1 | PASS |
| #3FB950 Success Green | 6.81:1 | PASS |
| #FF3A55 Incorrect Red | 4.93:1 | PASS |

Key rule: Pistons brand colors (#C8102E, #1D42BA, #002D62) are light-mode only as TEXT.
On dark backgrounds: use as accents/borders only, never as text.

### The Bar - Addition (Kat Holmes)
Added Kat Holmes (Inclusive Design / Mismatch) as 3rd practitioner.
Gap: I audit for WCAG after designs are done. Holmes designs FROM the constraint.
Goal: Integrate accessibility thinking at the first sketch stage, not the review stage.

### New Specs Filed to GA This Session
- Mid-test autosave (sessionStorage) - shipped by GA in 6b81a49
- Score reveal animation - shipped by GA in 6b81a49
- Chart label opacity fixes - shipped by GA in 6b81a49
- std-bar aria-label - shipped by GA in 6b81a49
- Chart+aria-label spec (20260222-1140) - queued
- 3rd-wrong-attempt auto-hint spec (20260222-1628) - queued
- tier-mid blue fix #4A90D9 (20260222-1620) - queued