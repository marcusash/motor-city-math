# GD Coaching Submissions -- Insight Summary

**Purpose:** Extract the most durable learnings from T1-T35 FD coaching submissions. Not a log -- a distillation.

---

## The Core Insight Across All 35 Tasks

FD taught one thing in 35 different ways: **constraints are design decisions.** Every principle, checklist, and framework GD has submitted is a form of constraint-making. The agent who makes better constraints makes better products.

---

## Insight Groups

### Group 1: WCAG and Accessibility (T1-T6, T16, T25)

**T1-T4 (Sprint 1-2):** First WCAG audits. Finding color failures by calculation. Insight: WCAG is a floor, not a target. The target is legibility for Kai at 60WPM reading speed.

**T5:** Score/time overlay -- cognitive hierarchy matters. Don't show two numbers at equal weight when one is more important. **Insight:** Information hierarchy is an accessibility issue, not just a visual one.

**T6:** Arena Mode WCAG audit. 7 failures, all caught before GA touched the file. **Insight:** Spec-first WCAG review is faster than post-build repair. This is now a protocol.

**T16:** ADHD timing research. Main finding: Kai processes multi-step problems more slowly than neurotypical baseline. Timer at 30s warning is already anxiety-producing for ADHD learners. **Insight:** Accessibility for ADHD is about reducing cognitive cost, not just compliance.

**T25:** Position tracker design with full decision record. **Insight:** Annotating decisions (not just specs) teaches future GD more than the spec itself.

---

### Group 2: Brand and Visual Direction (T17, T21-T24)

**T17:** Animation derivation. Went from 'add animation' to 'what cognitive event does this animation signal?' **Insight:** Animation is a message. If you can't name the message, remove the animation.

**T21:** 3 MCM color choices with reasoning. Identified Pistons Red as accent-only (correctly). **Insight:** The hardest color decision is knowing when NOT to use your signature color.

**T22:** MCM brand position statement. Motor City Math is a local product with a local identity -- not Khan Academy. **Insight:** Brand differentiation for MCM is about specificity, not polish.

**T23:** Forge/MCM color jurisdiction rule. FD-origin tokens (--fd-text-*, --fd-bg-*) never bleed into shared/styles.css. **Insight:** Token namespacing is a trust protocol between agents.

**T24:** Khan Academy 5-point critique. They design for first-principles ADHD reasoning. GD was applying checklists. **Insight:** Checklists catch known failure modes. First-principles thinking prevents unknown ones.

---

### Group 3: Spec Writing and Architecture (T7-T15)

**T7-T9:** First round of GA specs. Writing specs that GA could build without clarification questions. Early specs were unclear on boundary conditions. **Insight:** The spec is done when GA has no questions, not when GD has no more things to add.

**T10-T12:** Error state matrix, position tracker, hint reveal. Moved from describing behavior to specifying state machines. **Insight:** State machines catch missing states before GA discovers them at runtime.

**T13-T15:** Chart specs -- first attempt. Filed layout descriptions, not config values. **Insight:** Chart specs without Chart.js config values are suggestions, not specs.

---

### Group 4: Self-Directed Learning (T18-T20, T26-T30)

**T18:** Focus loss redesign -- the moment Kai gets an answer wrong is the highest-risk moment for disengagement. Designed a post-wrong micro-CTA. **Insight:** The most important UX moment is the one right after failure.

**T19:** 5 personal ADHD UX questions. First attempt at an ADHD framework from GD's perspective. **Insight:** Building a framework forces you to decide what you believe, not just what you've read.

**T20:** Hint temporal discounting. Kai's hint usage drops after 5 minutes. Hints feel like cheating by then. **Insight:** Hint design must account for the passage of time, not just the moment of struggle.

**T26-T30:** Deep research sprint. Kat Holmes Mismatch, Khan Academy, Desmond/Quizlet/IXL synthesis, Pistons brand. **Insight:** Research only counts if it changes what you spec. If you read it and nothing changes, you consumed it but didn't learn it.

---

### Group 5: Cross-Agent Protocol (T31-T35)

**T31:** ADHD UX framework -- from checklist to first-principles. Filed to FR for coaching. Still awaiting grade. **Insight:** Filing for grade forces clarity. You can't submit vague work to someone who will grade it.

**T32:** 4px grid applied to MCM -- found 3 micro-component breaks. Proposed sub-grid rule for elements under 20px. **Insight:** Grid compliance is about rhythm. Micro-components need their own rhythm, not an exception.

**T33:** Anti-slop audit of session restore toast spec. Passed 5/5 checks. Found the harder audit: what decisions am I leaving to GA? **Insight:** Anti-slop audit on the spec itself is not enough. Also audit the gaps.

**T34:** Design direction commitment -- 5 things MCM will NOT do. **Insight:** Saying no is a design skill. Closing doors permanently is not limitation -- it's clarity.

**T35:** Depth strategy -- ADHD-first design, WCAG for interactive math, spec quality. Three areas of depth commitment. **Insight:** Depth means something you won't trade. If you'd trade it for a shinier project, it's not depth -- it's interest.

---

## The Bar (Current)

| Practitioner | Standard | GD gap |
|---|---|---|
| Ethan Marcotte | Responsive from day one | GD retrofits |
| Aarron Walter | Functional first, pleasurable last | GD works at pleasurable while GA handles functional |
| Khan Academy design team | ADHD patterns from first principles | GD applies checklists |
| Muriel Cooper | Every addition improves system coherence | GD appends |

---

## What Changes Next

1. T36-T40: Apply first-principles ADHD thinking to 5 specific MCM interactions (not checklists)
2. da-01: Systematic WCAG color contrast table (sprint 9 anchor task)
3. Spec quality rubric: build a scoring tool to self-grade specs before filing
4. Peer review: package complete (peer-review-package.md). Need external reviewer assignment from Marcus.

---

*Last updated: Session 8, Sprint 8*
