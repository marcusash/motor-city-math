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
