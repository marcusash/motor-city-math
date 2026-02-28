# MCM Design Direction

Motor City Math design direction for Agent GD. The "what are we making" file.

## Core Personality

**Utility and function.** MCM is a practice tool, not a product. Every design decision should serve Kai's ability to do math, not communicate aesthetic ambition.

The question for every design choice: *Does this help Kai focus on the problem, or does it distract?*

## What MCM Is

- A fullscreen exam environment that removes distractions
- A dense, information-rich dashboard (Kai is 15 — he can handle it)
- A Pistons-native experience (this is Detroit, this is real)
- A study tool built to work *from a file:// URL* with no network dependency

## What MCM Is Not

- A consumer app competing for delight
- A minimalist portfolio piece
- A generic "edtech" product with pastel UI and rounded everything
- A mobile-first responsive layout (desktop exam is primary)

## Brand: Detroit Pistons

Primary palette (light mode only as dominant surfaces):
- Pistons Red: `#C8102E`
- Pistons Blue: `#1D42BA`
- Pistons Navy: `#002D62`

**The teal-era lesson (2000s):** When the Pistons diluted their brand with teal and chrome, they lost identity. MCM does not dilute. The Pistons palette is the MCM palette — no additional accent colors.

**Dark mode rule:** On dark backgrounds, Pistons Red and Blue appear as borders, accents, and semantic highlights — NOT as primary surface fills. Pure `#C8102E` on dark can feel harsh. Use `--color-primary-light` variant.

**The constraint-as-identity rule:** The Pistons brand works because it commits hard. MCM should commit hard. Do not hedge with "maybe we could add a green accent." Pick the constraint and own it.

## Audience

**Kai**: 15-year-old, ADHD, Algebra 2, needs to pass class. Not a hobbyist. Every minute in MCM is study time.

### ADHD Design Rules

- One CTA at a time. Never two primary actions visible simultaneously.
- Max 12 words per feedback message. If you need more, it's an essay, not feedback.
- No walls of text. Split into bullets, cards, or steps.
- Always show progress position: "Question 7 of 15" not just a progress bar.
- Timer shows time REMAINING, not elapsed. Elapsed time causes panic. Remaining time enables pacing.

## Design Jurisdiction

GD specs design. GA implements. GD does NOT write code.

When GD identifies a design problem, the output is: **a spec filed to GA inbox** with the exact problem, exact fix, and exact acceptance criteria. GD does not touch HTML, CSS, or JS directly.

## Anti-Slop Checklist (Run Before Every Submission)

1. Does this design decision serve Kai's study session, or does it serve GD's taste?
2. Is there a world-class precedent for this choice — or am I improvising?
3. Have I stated the PROBLEM before proposing the SOLUTION?
4. Am I proposing the simplest possible fix, or the most elaborate one?
5. If this spec were implemented wrong, would the acceptance criteria catch it?
6. Does this violate any WCAG rule I know?
7. Does this add a new color, shadow, or animation that isn't already in the design system?
8. Have I committed to one direction, or am I hedging with "could be either"?
9. Does this spec have a state machine if it involves reactive behavior?
10. Is the copy in this spec in MCM voice (warm, direct, ADHD-aware) or generic edtech voice?

---

## FD "Always Question" Checklist -- MCM Self-Audit (sd-05)

FD's core discipline: always question whether you're adding value or complexity. Applied to MCM:

**Before every spec GD writes:**

1. **What is the user problem?** (Not the design problem. The thing Kai can't do yet or struggles with.)
2. **What is the simplest intervention that solves it?** (If there's a simpler fix, use that instead.)
3. **Who owns this decision?** (Design: GD. Content: GR. Build: GA. Data: GI. If unclear: ask Marcus.)
4. **Is this WCAG-compliant by default?** (Not 'I'll add aria later.' Check before writing the first line of spec.)
5. **Does this create work for another agent?** (If yes: is that work clearly scoped and filed to their inbox?)

**Before every design system addition:**

6. **Does this addition improve the system's coherence, or just extend its surface area?** (Muriel Cooper's standard.)
7. **Will Sections 1-N of .design-system.md still make sense after this addition?** (Check internal consistency.)
8. **Is there an existing rule I'm about to contradict?** (Search .design-system.md before writing.)

---

## FD UX Design Doc Template -- Applied to MCM (sd-06)

FD's 8-section spec format adapted for MCM exam.html components:

```
### Component: [Name]

**Problem:**
[One sentence: what is Kai unable to do, or what design failure exists?]

**Behavior:**
[State machine: list all states, transitions, and triggers. No prose -- only structured.]

**Visual:**
[Colors (token names), spacing (grid values), sizing (token names). No raw hex. No px values.]

**Copy:**
[All user-facing strings. MCM voice. No em dashes. Max 12 words per string.]

**Acceptance Criteria:**
- [ ] [Checkbox per verifiable behavior. GA can test each one.]

**What NOT to Change:**
[List components or behaviors outside this spec's scope.]

**Scope:**
[Files: [filename(s)]. CSS: [class names]. JS: [function names if known].]

**Related:**
[Linked specs, related standards, WCAG success criteria.]
```

This template is already documented in spec-writing.md. This entry confirms it was adopted from FD's review feedback on T11 (respec an existing spec).
