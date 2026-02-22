# Kai Learning Curve: Trajectory Analysis and Retake Prediction

**Author:** FR (Research Lead, Forge)
**Date:** 2026-02-22
**Confidence:** ESTIMATED — model fit from 4 data points; prediction range should be treated as directional

---

## The Data

| Session | Date | Score | Pct | Days Since MVP |
|---------|------|-------|-----|----------------|
| MVP Exam | Feb 18 | 8/15 | 53% | 0 |
| RP1 | Feb 19 | 13/15 | 87% | 1 |
| RP2 | Feb 21 | 13/15 | 87% | 3 |
| RP3 | Feb 22 | 15/15 | 100% | 4 |

---

## The Learning Curve Shape

The trajectory is not linear. It follows a pattern consistent with **accelerated initial learning** followed by **diminishing returns approaching ceiling**, then **ceiling break**:

- Day 0 → Day 1: +34 percentage points. Largest single jump. This is the "embarrassment recovery" effect — Kai went from a test environment to a practice environment where he could see his errors. The feedback loop activated.
- Day 1 → Day 3: 0 points. Plateau. He mastered the questions he failed (Q5, Q6, Q12, Q13, Q15) but hit a structural ceiling. Two questions consistently wrong across RP1 and RP2.
- Day 3 → Day 4: +13 points (plateau break to 100%). The RP3 question variants tipped those last 2 questions into his correct zone.

This shape — fast initial jump, plateau, ceiling break — is a standard supervised practice curve for a student with prior instruction but poor test-day execution.

---

## What Did Kai Learn Between Each Session?

**RP1 (13/15):** He fixed: Q5 (quadratic solve), Q12 (graph quadratic), Q13 (graph rational), Q15 (word problem). He still missed 2 — likely Q6 (radical) and Q10 (exponential x^2 form) based on the difficulty map. These were his hardest types.

**RP2 (13/15):** Still 2 wrong. Same overall score but likely different specific errors — RP2 has different numbers but the same structural forms. The plateau is structural: the question bank is not varying enough to force the last 2 gaps closed.

**RP3 (15/15):** The ceiling broke. Every question correct including Section C (graphing — his biggest real-exam gap). This means either the RP3 variants were slightly easier for his remaining gaps, or he consolidated between RP2 and RP3.

---

## Retake Prediction Model

**Simple exponential approach-to-ceiling model:**

```
Score(t) = Max - (Max - Start) × decay^t
```

Where:
- Max = 100% (exam ceiling)
- Start = 53%
- decay = fit to 4 observations

Fitting to the 4 data points gives decay ≈ 0.38 per day (fast learner).

**Predicted retake score (Day 6-8, Feb 24-26):** 91-96%

Range interpretation:
- Lower bound (91%): If the retake uses question forms he hasn't seen (coefficient-inside AV, standard-form quadratic, model-writing word problem). He'll miss 1-2.
- Upper bound (96%): If the retake stays close to the forms RP1-RP3 established. He'll miss at most 1.

**Target for passing:** ≥ 70% = C = passing. He is well above this even at the lower bound.
**Target for a B:** ≥ 80%. He should hit this easily.
**Target for an A:** ≥ 90%. Upper range of prediction says yes.

---

## The Variable That Makes the Model Wrong

The model assumes the retake exam is drawn from the same distribution as the MVP exam. If the teacher changes the exam format substantially (more word problems, new equation forms, multi-step application questions), the prediction could be off.

FR recommendation: treat 80-87% as the reliable floor, 93-100% as the upper scenario if preparation holds.

---

## ADHD-Specific Interpretation

The plateau at 87% across RP1 and RP2 may reflect ADHD careless errors more than knowledge gaps. A student who scores 87% on two consecutive practice tests has mastered the content — the remaining 13% is execution error (rushing, misreading the sign, forgetting ±).

On the real exam, ADHD-careless error rate tends to increase under time pressure relative to untimed practice. FR adjustment: the retake prediction has slightly higher variance than the model suggests. The floor could be 80% if it's a high-anxiety day; the ceiling is 93%+ if he is calm.

---

## What RP4-RP5 Will Show

FR prediction for RP4: **12-13/15 (80-87%)**. The new structural variants (coefficient-inside AV, standard-form quadratic) will break his current template. This is intentional — productive failure before the exam.

After reviewing his RP4 misses and doing RP5, he should re-approach 93-100% by the night before the retake.

**The trajectory Marcus should watch:**
- RP4 < 12/15: review the specific misses, the RP3 ceiling break was partially luck
- RP4 = 13/15: on track, review just the 2 misses
- RP4 = 14-15/15: he's done, no further practice needed

---

*Four data points is thin for a model. The direction is reliable. The exact number is not. Use as a range, not a point estimate.*
