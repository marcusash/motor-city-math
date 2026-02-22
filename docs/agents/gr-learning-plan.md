# GR Learning Plan — Research Specialist, Grind Org

> Started: Feb 22, 2026. FR-directed. Marcus reads this.

---

## Context

I own mathematical accuracy for Motor City Math. My domain: equation design, answer verification, cross-exam uniqueness, QDS computation, curriculum alignment to Algebra II standards. Every question Kai sees has been through my verification gate. When the gate fails — like the RP9-Q15 model-given regression — Kai sees it. The stakes are one student's retake.

---

## Skills Sprint (FR Directive, Feb 21)

Priority skills mapped to my domain:

1. **Mathematical pedagogy** — desirable difficulty theory (Bjork), interleaving effects, spacing intervals. Required to advance QDS framework past Phase 2.
2. **Curriculum design** — backward design (Wiggins/McTighe). Design assessments first, then instruction. MCM currently designs questions forward.
3. **Error analysis methodology** — classifying student errors by category (procedural, conceptual, careless) to design questions that surface specific error types.
4. **LaTeX math notation** — current solution_steps use informal notation. Standardizing would enable future rendering upgrades.
5. **Statistics for education** — Rasch model, IRT basics. Measuring question difficulty from score data, not just perceived complexity.

---

## The Bar

*FR asked every agent: who are the world-class practitioners in your specific discipline? Honest self-assessment.*

### 1. Jo Boaler — Mathematical Mindset (Stanford, YouCubed)

Jo's bar: design for productive failure. Her research shows students learn more from problems they get wrong and analyze than problems they get right. Her Q15 word problem would include a step that most students get wrong (not recognizing r as r^(1/n)), and the feedback would say: "Most students miss this step. Here's why your approach was mathematically reasonable and where it breaks down." My current feedback is: "Find r first: 50·r⁴=800." That is correct but not Jo's bar. Her bar: the feedback teaches the concept, not just the procedure.

Where I am today: I can verify that equations have unique answers. Where Jo is: she designs questions to reveal the student's exact misconception from their wrong answer. The gap: I don't design for specific wrong answers.

### 2. Sal Khan — Mastery-Based Progression

Sal's bar: no student sees RP8 until RP7 mastery is confirmed at 80%+. MCM's current model is sequential by Marcus's design, but the decision to advance is manual. Sal would add prerequisite checking: "Before Q9 (equal-radical form), ensure Q6 (basic radical) was correct." My QDS work is the prerequisite map. But I'm not closing the loop to say "Kai cannot see RP8-Q9 until RP7-Q9 was correct."

Where I am today: I can classify mastery level (L1-L5) for each question. Where Sal is: he builds the system that enforces prerequisite mastery automatically. I design the ladder, not the gate.

### 3. Grant Sanderson (3Blue1Brown) — Visual-First Mathematical Intuition

Grant's bar: every algebraic fact should have a visual interpretation that makes it feel true before it's proven algebraically. My solution_steps for Q6 (x²-inside radical) say: "x=±2. Two solutions because x²=positive always gives ±." Grant's version: "Imagine x on a number line. Both x=2 and x=-2 are distance 2 from origin. That's what x²=4 means geometrically." I know the algebraic reason. I don't write the geometric insight.

Where I am: I verify the algebra. Where Grant is: he builds intuition that makes the algebra feel inevitable. My solution_steps are procedural, not intuitive.

---

## Current Self-Assessment

| Skill | Level | Evidence |
|-------|-------|---------|
| Equation accuracy | L4 | 27/27 math assertions across RP1-RP9, 0 hard failures |
| Cross-exam uniqueness | L3 | Built cross-exam-verify.js, identified all real collisions |
| QDS computation | L2 | Understand the framework, computed RP8 matrix by hand |
| Curriculum alignment | L2 | Know W2.a/W2.b/W3.b standards, use them for classification |
| L1-L5 escalation design | L2 | Can classify, cannot always design escalations independently |
| Error analysis | L1 | Know errors exist, don't design for specific wrong answers |
| Pedagogical theory | L1 | Can name Boaler/Bjork, haven't applied their frameworks directly |

---

## 25-Task Skill Queue (FR-assigned, coaching expected on completion)

1. Classify all 15 RP8 questions by mastery level (L1-L5). Report which levels are missing.
2. For RP8-Q3 (AV solve), write a feedback message that names the two most likely wrong answers and explains why students make them.
3. Read `docs/fr-desirable-difficulty.md`. Write a 3-bullet summary of what GR should change in question design as a result.
4. Compute QDS for RP9 by reading its JSON — full 7-dimension matrix.
5. For RP10-Q15 (P(0)=500, P(3)=13500, r=3), write solution_steps in Grant Sanderson style: procedural plus geometric intuition.
6. Design an L3 "construct" question for the absolute value concept (write the function from a description). Math-verify it.
7. Design an L4 "transfer" question for the exponential concept (real-world scenario requiring model construction and solving). Math-verify it.
8. Design an L5 "diagnose" question for the radical concept (show wrong student work, ask Kai to find and fix). Verify the embedded error is realistic.
9. Read `docs/fr-answer-uniqueness-research.md`. Identify 2 things GR is not currently checking that the research says matter.
10. Compute Hamming distance between RP7-Q10 and RP8-Q10 across all 7 QDS dimensions. Explain whether the change is sufficient.
11. Read `docs/fr-kai-learning-curve.md`. Write a 1-paragraph prediction of Kai's RP8 score based on the curve.
12. For the hint word-count violation in RP8-Q5 (hint was 20 words), verify the trimmed hint preserves all mathematical precision. Report what was lost, if anything.
13. Audit RP9 Q1-Q15 solution_steps for depth: flag all steps that are procedural-only and propose an intuitive alternative for each.
14. Design the RP10 full exam spec (15 questions, all math verified, all cross-exam unique, QDS target 0.45+ per slot).
15. Write a one-page memo to Marcus explaining why the same answer appearing in Q4 and Q7 in the same exam is pedagogically harmful — cite Bjork.
16. Propose a JSON schema extension that captures "expected_wrong_answers" for each question. Why would this improve the system?
17. For any 3 questions in RP8, write alternate versions that escalate by exactly one mastery level. Verify all math.
18. Read `docs/spaced-repetition-design.md`. Map GR's RP1-RP9 sequence onto the spaced-repetition design. Are concepts reappearing at the right intervals?
19. Compute the concept-coverage gap: which W2/W3 standards appear in fewer than 3 practice exams? Propose RP10 questions to fill gaps.
20. Verify RP9-Q15 replacement math end-to-end: P(0)=300, P(3)=2400, r=2, P(t)=300*2^t, when P=614400? Confirm t=11 and write the verification chain.
21. Read `docs/fr-w2b-rootcause.md`. Write a one-paragraph reflection on what GR would do differently in question design based on this analysis.
22. Design a pre-flight checklist GR runs before any new exam JSON is submitted. Include every check that has ever caught a real error.
23. Propose a QDS improvement plan for Q12 (graph quadratic): how to achieve QDS 0.45+ by RP12 without repeating any equation.
24. Write a reply to FR's RP8 generation brief explaining which variants were implemented, which weren't, and why (based on what GA actually built vs. what FR specified).
25. For RP10-Q10 (extraneous solution question), write the question text, inputs, solution_steps, and feedback that explicitly teaches "plug back in to check" as a required graded step — not just a verification.

---

## Lessons Learned (Feb 22, 2026)

1. **False positives need documentation immediately.** GP's 22 smoke failures were false positives from identify-type inputs. Triage took longer than it should have because the mechanism wasn't documented on first encounter.
2. **Read the generation brief before auditing.** FR writes detailed briefs specifying exact equations. RP8's brief specified 3x²-10x+8=0 and decay model. Found GA non-compliance by accident, not by design.
3. **Within-exam uniqueness is as important as cross-exam uniqueness.** Built cross-exam-verify.js but never systematically audited within-exam uniqueness for RP8/RP9. Value 2 in five RP8 questions found by manual reading, not automation.
4. **Write-lock means analysis only — the deliverable is a runnable patch.** When writes are blocked, every patch script must be specific enough for Marcus to apply with one copy-paste. Vague notes are not deliverables.
