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

---

## Session 3 Update (Feb 22, 2026 - Afternoon)

### Autonomous Sprint Delivery

QA and WCAG audit work completed this session:

**Specs filed to GA (4 new):**
- Focus ring WCAG fix (20260222-1635): shared/styles.css :focus-visible #1D42BA -> must add --accent-blue-on-dark for dashboard
- Error state copy in MCM voice (20260222-1645): removed HTTP codes, rewrote in coach voice, added "Try again" label
- Placeholder contrast fix (20260222-1650): opacity:0.7 on --text-secondary = 3.02:1 FAIL; fix is removing opacity
- Input border WCAG fix (20260222-1655): --border-default 1.52:1 FAIL on inputs; add --border-input token

**QA findings this session:**
- saveResults timestamp: PASS (#1097 has new Date().toISOString() -- streak computation unblocked)
- Arena focus ring: #4A72E8 on #141B2D = 3.97:1 PASS (arena mode is correct)
- Error state copy: FAIL -- HTTP status codes shown to Kai, "corrupted" message too technical

### Pistons Brand History -- 3 Design Lessons

Research: Detroit Pistons brand evolution and what it means for MCM.

**1. The Bad Boys era (1988-1990) -- contrast as identity**
- Palette: White on Cobalt Blue (#0034A0-ish) and Red (#CC0000-ish). Hard edges. No gradients.
- The Bad Boys team used aggression and physicality as visual language: black accents, tight lettering.
- MCM lesson: High contrast is not just WCAG compliance -- it IS the Pistons brand. Low-contrast UI is off-brand. Every time I spec #4A90D9 over #1D42BA on dark, I am being more Pistons, not less.

**2. The Teal-and-Red era (1996-2001) -- brand dilution by trend-chasing**
- Pistons briefly adopted teal (see: Charlotte Hornets era palette) to look modern. It bombed.
- The team had no identity, went through multiple coaching changes, finished out of playoffs.
- MCM lesson: Do not add brand colors to MCM because they look nice. Every color must earn its place from the Pistons identity system. No pastels, no teals, no "charcoal grey + orange" modernization unless it ships with a real brand rationale.

**3. The 2001 navy-red-blue return -- constraint as discipline**
- Pistons reverted to navy-blue + red + chrome silver. Won the championship in 2004 with this palette.
- The return to constraint unlocked identity clarity. Ben Wallace, Chauncey Billups: the team knew who they were.
- MCM lesson: The design system's constraint (#C8102E, #1D42BA, #002D62, #BEC0C2) is a feature. When I am tempted to add a color token "just for this case," I should first ask: can I make the existing palette work? The answer is usually yes.

### WCAG Audit Running Totals (as of Session 3)

| Check | Result | Filed |
|---|---|---|
| Pistons Red (#C8102E) on dark | 2.94:1 FAIL | FD inbox |
| Pistons Blue (#1D42BA) on dark | 2.09:1 FAIL | FD inbox |
| Pistons Navy on dark | 1.28:1 FAIL | FD inbox |
| tier-mid std-pct text | 2.09:1 FAIL | GA inbox |
| Dashboard :focus-visible | 2.09:1 FAIL | GA inbox |
| Placeholder text (both modes) | 3.02-3.18:1 FAIL | GA inbox |
| Input borders (both modes) | 1.26-1.52:1 FAIL | GA inbox |
| exam.html :focus-visible | 14.02:1 PASS | no action |
| Arena :focus-visible | 3.97:1 PASS | no action |
| Arena focus border on input | 3.61:1 PASS | no action |
| score-number, correct/incorrect text | (not yet audited) | pending |

### Next Skills Focus: T16 (ADHD + timing research)
5 peer-reviewed findings on ADHD + UI timing. Real research, not just WCAG. Planned for next session.

---

## Session 4 Update (Feb 22, 2026 - Evening)

### Autonomous Sprint Delivery (Sprint 4)

Marcus re-activated autonomous mode. Directives: Forge TUI design language, postmortem, zero idle.

**Key lessons this session:**

#### 1. TUI -> Web Translation
Studied FD's Forge TUI design language (--fd-* tokens, dark-first design). Mapped 8 TUI principles to MCM web context:
- Dark by default: fd-bg (#0d1117) correct. This is the medium, not a mode.
- Sparse animation: correct-pulse (320ms) and score reveal are the ONLY animations. Both functional. No decoration.
- Feedback at point of action: correct-pulse glow on input (not below it) = correct TUI alignment.
- Hierarchy through weight: exam.html needs weight differentiation at text-lg vs text-sm levels.

#### 2. WCAG and Scale
Audited all FD token values on dark backgrounds. --fd-text-3 (#6E7681) fails on all dark surfaces (3.52-4.12:1). Fix: #7D8590. Filed to GA.

Found: canvas elements have no aria-label or tabindex. WCAG 2.1.1 failure. Filed full keyboard spec to GA (P2).

Found: ALL exam inputs have `<label>` without `for=""`. WCAG 4.1.2 failure. 3-line fix. Filed to GA (P2).

#### 3. Spec Quality
This session produced 8 GA specs vs 6 last session. Each spec now includes:
- Why (cognitive rationale or WCAG citation)
- Full implementation code (not pseudocode)
- Edge cases (5+ per spec)
- Exact accept criteria (checkbox format)
- Scope boundary (what file, what function)

This format is modeled on GA's existing code patterns to minimize interpretation gaps.

#### 4. Design System Documentation
Added Section 16 to .design-system.md: 5 accessibility patterns discovered this sprint.
Key rule added: aria-label specs must provide exact string templates (postmortem lesson from P1 outage).

### Specs Filed This Session (8 to GA, 1 to GR)
| Spec | Type | Priority |
|------|------|----------|
| --fd-text-3 WCAG fix (#7D8590) | Bug | P2 |
| Correct-answer pulse animation | Feature | Medium |
| Position tracker (Q3 of 15) | Feature | Medium |
| Post-wrong nudge ("Next up: Q4") | Feature | Medium |
| label for= on all inputs | Bug | P2 |
| Scorecard progressive disclosure | Feature | Medium |
| Typography token gap (17 raw rems) | Audit | Low |
| Canvas keyboard navigation | Feature | P2 |
| Exam title voice spec (to GR) | Copy | Low |

### Audit Results This Session
| Surface | Finding | Status |
|---------|---------|--------|
| dad.html | All colors pass (white 19:1, #aaa 8:1, link 9:1) | PASS |
| exam.html 375px | Layout, touch targets, canvas scale all correct | PASS |
| shared/styles.css tokens | 2 hardcoded #C8102E in answer-key section | Filed low |
| exam inputs `<label>` | Missing for= on all 3 input types | Filed P2 |
| exam canvas | No tabindex, no aria-label, click-only | Filed P2 |
| --fd-text-3 | 3.77:1 on fd-card FAIL (needs #7D8590) | Filed P2 |

### FD Coaching Status: 25/25 submitted. Awaiting grades.

---

## Session 5 Update -- Feb 22-23, 2026

### Audits Run

| Surface | Finding | Status |
|---------|---------|--------|
| scorecard copy: 15 questions P1 | Hints, feedback_correct, feedback_wrong all MCM voice | PASS |
| exam.html canvas copy | Counter, result strings direct and specific | PASS |
| exam.html save flow | Inline notes, no alert() dialogs | PASS |
| exam.html focus ring | White outline invisible in light mode | FAIL -- P2 filed |
| grade badge dark mode | G4 badge: white on #2ECC71 = 2.07:1 | FAIL -- P2 filed |
| grade flash threshold | Fires at 93%, Grade 4 threshold is 92% | FAIL -- P3 filed |
| manifest.json picker | P8/P9 titles generic (prior spec confirmed) | Already filed |

### Bugs Found and Filed

5 new GA specs (3 P2, 1 P3, 1 P2 confirm):
1. nav-btn CSS missing from shared/ (confirmed and committed)
2. G4 badge: white on #2ECC71 = 2.07:1 in arena mode -- fix: color-correct-bg as text
3. Focus ring: exam.html line 104 overrides shared with white -- invisible in light mode
4. Grade flash at 93% but Grade 4 threshold is 92% -- off-by-one
5. label[for=] on exam inputs (prior, confirmed exists in renderInput())

### Design System Updates

Added Sections 16g and 16h to .design-system.md:
- 16g: Focus ring rule -- never override :focus-visible globally with hard-coded color
- 16h: Grade badge dark mode rule -- use color-correct-bg for dark-mode light backgrounds

### Skills Growth This Session

**Cascade debugging:** The focus ring bug required understanding CSS load order -- shared/styles.css
loads at line 11, inline <style> at line 13. Same specificity, later wins. Inline overrides shared.
This is a class of bug I now actively audit: page-level global rules that could interfere with shared tokens.

**Contrast calculation:** Calculated #2ECC71 luminance manually (0.456), confirmed 2.07:1 against white.
Building muscle memory for mental contrast estimation (light greens always fail with white).

**Content-as-pedagogy (T27):** Analyzed rp3-q10's "Valid x =" label and inline parenthetical definition.
Formalized as a design principle: embed vocabulary in question body, not hint layer, to reduce context-switch
cognitive load. Submitted as T27 to FD.

**Notification pattern (T26):** Documented why alert() fails for ADHD users and why exam.html's inline
append pattern is the correct MCM approach. Submitted as T26 to FD.

### FD Activity
- T26: inline notification patterns
- T27: content as UI, embedded vocabulary
- fd-tokens shared proposal: awaiting FD approval

### Retro
- Added GD entry to .forge/retro.md: aria-label P1 postmortem -- spec strings must be safe for HTML attributes

