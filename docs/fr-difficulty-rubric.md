# FR Difficulty Escalation Rubric — Motor City Math Retake Practice

**Owner:** Agent FR  
**Status:** Active (enforced RP5+)  
**Created:** 2026-02-22  
**Applies to:** All retake practice exams RP1–RP10

---

## The Problem This Rubric Solves

RP1–RP5 (pre-rubric) had surface variation only: same algorithm per question slot, different numbers.
Kai scored 53% on the real exam, then 87/87/100/93% on RP1–4. At 93% he is in mastery territory.
Surface variation at this level is not preparation — it is repetition. RP5 (v1) had 3 easier questions and 8 same-surface questions vs RP4. That is not acceptable.

---

## Three-Stage Model

Every question in every RP must be assigned a stage. The stage determines the difficulty floor.

### Stage 1: Rebuild (RP1–RP3)

**Goal:** Stop the bleeding. Rebuild fluency and confidence after a 53% exam score.  
**Difficulty floor:** At or slightly below real exam difficulty.  
**Variation requirement:** Algorithm must be correct. Surface variation is acceptable at this stage.  
**Kai's performance:** Went from 53% to 87/87/100% — Stage 1 complete.

### Stage 2: Match Exam (RP4–RP6)

**Goal:** Prepare for the exact difficulty of the real retake.  
**Difficulty floor:** Every question must be at or above its RP4 counterpart. No regression allowed.  
**Variation requirement:** At least 2 structural variations per exam (different algorithm, not different numbers).  
**Position rotation requirement:** At least 2 question types must appear in different slots than their RP4 position.  
**Kai's current stage:** RP4 done (93%). RP5 and RP6 must meet Stage 2 requirements.

### Stage 3: Exceed Exam (RP7–RP10)

**Goal:** Make the real exam feel easier by comparison.  
**Difficulty floor:** Every question must be noticeably harder than the real exam equivalent.  
**Variation requirement:** Minimum 4 structural variations per exam.  
**Position rotation requirement:** At least 4 question types in different slots.  
**Kai's readiness:** Qualifies for Stage 3 after 3 consecutive G4 scores (RP3, RP4, and one more).

---

## Structural Variation Definitions

Surface variation: different numbers, same algorithm, same setup form. DOES NOT COUNT.  
Structural variation: different algorithm required, or different algebraic form requiring different steps.

### Per Question Type — What Counts as Structural Variation

**W2.b Identify (Q1–Q3):**
- Surface: same parent type, different constants
- Structural: different parent type in the slot (e.g., exponential in Q1 instead of quadratic)
- Structural: vertex form vs standard form vs factored form (different isolation steps)
- Structural: negative leading coefficient requiring sign-flip during isolation

**W3.d Exponential Solve (Q4, Q7):**
- Surface: one side requires conversion, different base
- Structural: BOTH sides require conversion to a common base
- Structural: both sides to base 2 vs both sides to base 3 (different recognition)
- Structural: result is a fractional answer (x=9/4) vs integer

**W3.b Quadratic Solve (Q5):**
- Surface: monic standard form, different numbers
- Structural: non-monic (leading coefficient > 1, requires AC method)
- Structural: vertex form requiring ±√ vs standard form requiring factoring

**W3.b Radical Solve (Q6, Q9, Q10, Q11):**
- Surface: same inside form, coefficient 1, integer answer
- Structural: coefficient on x inside the radical (divide or factor after squaring)
- Structural: radical = linear binomial (quadratic appears after squaring, extraneous check)
- Structural: coefficient on both sides (Q10: sqrt(4x-3)=2x-3 gives 4x^2 after squaring)
- Structural Q11: different cube recognition target (7^3=343 vs 9^3=729 vs 8^3=512)

**W3.c Rational Solve (Q8):**
- Surface: cross-multiply single fraction, integer answer
- Structural: two fractions set to zero, requires common denominator method
- Structural: x in both numerators (binomial expansion after cross-multiply)

**W2.c/W2.e Graph (Q12, Q13):**
- Surface: vertex form with same-sign everything, read off directly
- Structural Q12: standard form — must find vertex with x=-b/2a, then compute y
- Structural Q13: reflected denominator (2-x) instead of (x-2) — graph direction flips

**W3.a Error Analysis / Word Problem (Q14, Q15):**
- Surface: same error type (missing ±), same model type (decay), same recognition step
- Structural Q14: no-solution domain error (sqrt = negative impossible) vs missing ± error
- Structural Q15: tripling model vs halving model; 81=3^4 recognition vs 0.5^4=0.0625

---

## Difficulty Floor Per Question (RP4 Baseline)

For RP5+, each question must meet or exceed the following difficulty floor set by RP4.

| Q | RP4 Difficulty Element | Minimum in RP5+ |
|---|----------------------|-----------------|
| 1 | Vertex form with ±√ | Any form requiring actual steps (not factored ZPP) |
| 2 | √(x-7)-5=0, coefficient 1 | Coefficient on x inside, or negative outside |
| 3 | AV with a=3, h=-3, k=-6 | a≥3, both intercepts negative |
| 4 | One-side conversion (64=4^3) | Both sides require conversion |
| 5 | Monic standard form | Non-monic OR completing the square |
| 6 | Coefficient 4 inside (4x-3) | Coefficient ≥ 2 inside the radical |
| 7 | One-side conversion (27=3^3) | Both sides require conversion |
| 8 | Cross-multiply (integer answer) | Common denominator OR x in both numerators |
| 9 | Simple form (original Q9) | Radical = linear binomial, extraneous check |
| 10 | sqrt(x+12)=x-8 (basic) | Coefficient on x inside, non-trivial quadratic |
| 11 | x=49 requires 7^3=343 (missed) | Harder cube recognition (8^3=512 or 9^3=729 minimum) |
| 12 | Vertex form, read directly | Standard form requiring -b/2a computation |
| 13 | Simple a/(x-h)+k | Reflected denominator (2-x) OR HA from degree-equal form |
| 14 | Missing ± error | Different error class: domain violation, no-solution scenario |
| 15 | Half-life decay, 0.5^4=0.0625 | Different model (growth), less familiar power recognition |

---

## FR Quality Gate — Sign-Off Before Exam Assignment

FR must verify each RP exam BEFORE it is assigned to Kai using this checklist.

Step 1: Compare every question to its RP4 counterpart. Verdict: HARDER, SAME/SURFACE, or EASIER.  
Step 2: Count SAME/SURFACE verdicts. Maximum allowed: 2. Any EASIER verdict = automatic rewrite.  
Step 3: Count structural variations (see definitions above). Minimum required by stage.  
Step 4: Check Q1 type. Has the parent type rotated vs RP4? If not, rotate.  
Step 5: Check Q9 and Q10 are not the same algorithm. If same, diverge one.  
Step 6: Check Q11. Is the cube target harder than the previous exam's Q11? If not, escalate.  
Step 7: Math verification. Send every equation to GR with expected answer. GR must confirm before sign-off.

FR signs off by adding "fr_approved": true and "fr_approved_date" to the exam JSON.

---

## Application: RP5 v2 (2026-02-22)

Rebuilt by FR after Marcus review identified rubric failure in RP5 v1.

| Q | Change Made | Structural? |
|---|-------------|-------------|
| 1 | Type rotated: exponential parent (was factored quadratic) | YES |
| 2 | Vertex form with negative a (was factored form) | YES |
| 3 | a=4 instead of a=3 (minor escalation) | surface+ |
| 4 | Both sides converted (was one-side) | YES |
| 5 | Non-monic AC method (was monic factor) | YES |
| 6 | Coefficient 3 inside (restores RP4-level difficulty) | surface+ |
| 7 | Both sides converted (was one-side) | YES |
| 8 | Common denominator two-fraction form (was single cross-multiply) | YES |
| 9 | Kept from RP5 v1 Q9 (was HARDER/GOOD) | YES |
| 10 | Coefficient inside+outside, harder factoring | YES |
| 11 | 9^3=729, x=81 (harder than 7^3=343). Teaching hint added | YES |
| 12 | Standard form: must find vertex with -b/2a | YES |
| 13 | Reflected denominator (2-x) vs (x+2) — graph flips | YES |
| 14 | No-solution domain error (was missing ± error) | YES |
| 15 | Tripling growth model, 81=3^4 (was decay, 0.5^4) | YES |

RP5 v2: 12 structural changes, 2 surface+, 1 kept-GOOD. FR-approved.
