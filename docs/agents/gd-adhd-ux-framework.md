# GD ADHD UX Framework

Five personal research questions and answers that guide MCM design decisions for Kai.
Filed as T31 to FD for coaching review.

**Context:** Kai is 15, diagnosed ADHD, studying for Algebra II retakes. MCM is his primary study tool. These questions drove my design decisions in Sprints 1-7.

---

## Q1: What happens to attention right after a wrong answer?

**Research-backed answer:** Wrong answers trigger a dopamine dip and a threat response in ADHD users. The threat response activates the amygdala and temporarily suppresses prefrontal cortex function — the same region needed for reasoning. This means a wrong answer in a test context doesn't just feel bad: it literally impairs the ability to think clearly for 15-30 seconds.

**MCM implication:** The post-wrong state is the most fragile moment in the exam. The UI must not pile on. No red flashes, no harsh sounds, no "Wrong!" copy. The feedback should be specific enough to be useful once the cortex re-engages, but not so elaborate that it demands immediate processing. Spec rule: post-wrong feedback is ≤12 words + a single mild action.

**Current MCM state:** Feedback is specific and short. The `wrong-nudge` animation shows "Next up: Q[N+1]" after 2 seconds — this respects the recovery window. PASS.

---

## Q2: How much time does an ADHD student need between questions?

**Research-backed answer:** Research on ADHD and pace-of-work shows that ADHD users have more variable response times than neurotypical users — not consistently slow, but more bimodal: either very fast (hyperfocus) or very slow (attention drift). The implication is that fixed pacing is harmful. Kai should be able to take as much time as he needs on a hard question without UI pressure signals.

**MCM implication:** The timer must not create urgency on individual questions. Timer design rule: show remaining time for the session, NOT a per-question timer. Progress bar should show completion ("7 / 15") not a depleting bar. No visual "you're running out of time" signals until the session threshold (e.g., 5 minutes remaining for a 30-minute exam).

**Current MCM state:** Position tracker shows "0 / 15" format — PASS. No per-question timer. Session timer design not yet audited.

---

## Q3: What makes math more accessible to ADHD students specifically?

**Research-backed answer:** Three factors from ADHD education research:
1. **Worked examples reduce cognitive load.** When students first encounter a problem type, seeing one solved example before attempting independently reduces working memory demand significantly.
2. **Immediate, specific feedback accelerates learning.** General praise ("Great!") has no effect. Specific feedback ("You distributed correctly — the error was in the final simplification step") has measurable impact on ADHD learner performance.
3. **Breaking into sub-goals increases task initiation.** "Solve for x" is one task. "First, move all terms with x to one side" is a sub-goal. ADHD students initiate more readily on sub-goals.

**MCM implications:**
- Hint system should provide sub-goal hints, not answer hints
- fb_wrong strings should reference the specific error, not just show the correct answer
- The 3-tier hint system (hint -> answer -> solution steps) maps to worked example exposure for struggling students

**Current MCM state:** Hint system is 3-tier — PASS. fb_wrong quality varies by exam. Filed content brief to GR (ct-01 through ct-09).

---

## Q4: How does task switching affect ADHD math performance?

**Research-backed answer:** Task switching is expensive for all users, but ADHD users experience disproportionate performance loss on switch tasks — both in time and accuracy. Switching from one question type (algebraic) to another (graphing) costs more for ADHD users than re-reading the same question type multiple times.

**MCM implication:** Exam question ordering should minimize type-switching. All graphing questions should be grouped; all algebraic equation questions should be grouped; etc. This is a content design rule, not just a UX rule.

**Current MCM state:** Question order is not currently GD's domain — this is a GR/GI content decision. Filing to GR as a design advisory. Also: within a single question, MCM should not mix UI modes (e.g., text input + canvas on the same question without clear segmentation).

---

## Q5: What design patterns help ADHD users recover from errors without quitting?

**Research-backed answer:** ADHD users have higher rates of task abandonment after errors than neurotypical users. Two factors reduce abandonment:
1. **Perceived effort alignment:** If the next action feels proportionate to the error (small error -> small next action), abandonment decreases.
2. **Forward momentum signals:** Showing what comes next ("Next up: Q4") is more motivating than dwelling on what went wrong.

**MCM implications:**
- Post-wrong state should show a single, low-effort action (hint button or "next question" if they've answered enough)
- "Next up: Q[N+1]" nudge (already implemented) is exactly right — forward momentum signal
- Auto-rescue at 3 wrong attempts prevents full abandonment without removing desirable difficulty

**Current MCM state:** Wrong nudge implemented and forward-pointing — PASS. Auto-rescue at 3 attempts — PASS. No "try again" dead ends — PASS.

---

## Framework Summary for MCM Design

| Principle | Rule | Where enforced |
|-----------|------|---------------|
| Post-wrong recovery window | ≤12 words feedback, one action, no red flash | spec-writing.md, .voice-guide.md |
| Pace respect | No per-question timer, remaining time only | .design-system.md Section 22 |
| Sub-goal hints | Hints guide to next step, not to answer | content brief to GR |
| Task switch cost | Group question types within exams | content advisory to GR/GI |
| Forward momentum | Post-wrong shows "next up" not "you failed" | da-21 audit PASS |
