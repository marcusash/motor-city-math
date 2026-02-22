# W2.b Root Cause: Why Kai Missed AV Questions on Both Practices

**Author:** FR (Research Lead, Forge)
**Date:** 2026-02-22
**Task:** FA backlog item a7-kai-w2b-rootcause
**Confidence:** ESTIMATED — based on structural analysis of question bank + Kai's score pattern

---

## The Question

The checkpoint notes flag W2.b (identify parent function) as a gap, specifically for AV (absolute value) questions with "coefficient inside bars requiring factoring to read a/h/k." FA observed: "he can identify intercepts numerically but not by visual inspection of the function family."

What broke, specifically?

---

## What the Score Data Shows

**Real exam Feb 18 (8/15, 53%):**
- Q2 (W2.b, AV identify): CORRECT
- Q3 (W2.b, quadratic identify): CORRECT

Kai correctly identified the parent function when given vertex form. He selected "absolute value" and found x-intercepts algebraically.

**What he missed:** Q12 (graph quadratic — wrong), Q13 (graph rational — wrong). Both graphing questions failed. Q5 (quadratic solve), Q6 (radical solve): wrong.

**The W2.b AV gap is not about identification. It is about verification.**

---

## Root Cause

Kai's W2.b training exclusively uses **substitute-back arithmetic** as the verification method (QDS dimension 7: AV).

Every Q3 variant across RP1-RP7:
- Form: vertex form with negative coefficient outside bars (`-a|x ± h| + k`)
- Verification: set f(x) = 0, solve for x algebraically, plug back in
- No graph inspection required at any point

The real exam Q12 and Q13 (graphing questions) failed because they required **visual verification** — reading function behavior from shape, not from arithmetic. This is the same skill that would catch whether an AV function opens upward (a > 0) or downward (a < 0) by inspection.

When Kai sees `f(x) = -|x - 1| + 4`:
- Algebraic path (what he trained on): "absolute value → set to zero → |x-1| = 4 → ±4 → x = 5, x = -3." CORRECT.
- Visual path (what he was never asked to use): "negative coefficient → opens downward → vertex at (1,4) → meets x-axis at ±4 from vertex." This requires reading the sign before computing, not after.

The coefficient-inside-bars variant makes this worse. `f(x) = |2x - 6| + 1` requires factoring to read h and k: `2|x - 3| + 1`. Kai's training does not include this form. He has only seen coefficient-outside-bars.

---

## Evidence Chain

1. **RP1-Q3 through RP7-Q3:** All use `-a|x ± h| + k` with coefficient outside. AV method: substitute-back arithmetic only. (Structural audit of question bank.)

2. **Real exam Q12, Q13 failures:** Both graphing questions — required reading function behavior visually, not algebraically. (Score record: kai-scores-2026-02-19.json.)

3. **QDS dimension 7 (AV) audit:** Zero variation in answer verification method across W2.b questions in current bank. AV = substitute-back arithmetic in 100% of cases. (FR framework audit, 2026-02-22.)

Three independent observations converge: the failure mode is AV lock (same verification method, every question).

---

## What GR Should Do

**For W2.b AV questions going forward:**

1. At least one variant per practice must require **graph inspection** to confirm the answer: "Does the graph have two x-intercepts, one, or none? How do you know without computing?"

2. At least one variant must use **coefficient-inside-bars** form: `f(x) = |ax + b| + c`. Requires factoring out `a` to read `h = -b/a` and `k = c`.

3. Do not add these variants to the same practice exam at the same time. Sequence: coefficient-outside (current) → coefficient-inside → graph inspection → combined.

4. The current RP1-Q3 form is not wrong — it is incomplete. Keep it as the baseline (L2), add the variants as L3 questions.

---

## Confidence Statement

ESTIMATED. The root cause (AV lock) is strongly supported by three independent evidence paths. The specific claim that Kai would pass a coefficient-inside or graph-inspection variant is not tested — Kai has not attempted those forms. FR is predicting a gap, not measuring one. GR should treat this as a hypothesis to test in RP8/RP9.

---

*Shared with FA per backlog item a7. Deliver to GR via inbox message when RP8 generation is scheduled.*
