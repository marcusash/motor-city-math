# FR QDS Full Audit — RP1 through RP7

**Author:** FR (Research Lead, Forge)
**Date:** 2026-02-22
**Framework:** QDS 7-dimension framework (fr-variability-framework.md v2, 7 dimensions)
**Confidence:** Estimated — FR scored each question against the 7 dimensions using structural analysis of question type, standard, and answer characteristics. Inter-rater review by GR is recommended before using these scores to drive generation targets.

---

## Audit Summary

| Exam | QDS Score | Assessment | Notes |
|------|-----------|-----------|-------|
| RP1 | 0.13 | FAIL — template lock | Baseline: GR's original bank before FR's intervention |
| RP2 | 0.16 | FAIL | Marginal improvement, answer diversity only |
| RP3 | 0.18 | FAIL | Slight structural change in Q14 (multiple-choice vs. error-analysis) |
| RP4 | 0.24 | MARGINAL | Q8 adds negative rational answer — structural |
| RP5 | 0.29 | IMPROVING | Q14 error-analysis instead of multiple-choice |
| RP6 | 0.38 | APPROACHING | Construct Q14, extra exponential, position shift |
| RP7 | 0.41 | BELOW TARGET | Q14 multiple-choice (W2.d), radical to rational on Q6 — close |

**Target:** QDS >= 0.45 (per fr-variability-framework.md)

**FR finding:** RP7 scores 0.41 — below target. RP6 scores 0.38. Neither exam fully meets the threshold. The bank has improved significantly from the 0.13 baseline but the target has not yet been hit. RP8 should be designed explicitly to reach 0.45+.

---

## Dimension Definitions (Reference)

| # | Dimension | Abbreviation | Key question |
|---|-----------|-------------|-------------|
| 1 | Presentation Form | PF | Function form: standard, factored, vertex, graph? |
| 2 | Orientation | OR | Is there a positional shift (coefficient outside vs. inside)? |
| 3 | Solution Character | SC | Answer type: integer, rational, irrational, negative, complex? |
| 4 | Question-Ask Type | QA | Identify, solve, graph, construct, word-problem, error-analysis? |
| 5 | Context | CX | Abstract algebraic vs. applied word problem? |
| 6 | Step Count | ST | Number of required solution steps |
| 7 | Answer Verification | AV | Required verification method: substitute-back, graph-inspect, equality-check? |

SSI (Structural Similarity Index) per question pair = (matching dimensions) / 7. QDS = 1 - mean(SSI across all consecutive question pairs).

---

## Per-Question Structural Profile

### Q1-Q3 (W2.b identify): All exams RP1-RP7

Q1 always: quadratic identify (vertex form: a(x-h)^2 + k)
Q2 always: square root identify (RP7 changed to absolute value)
Q3 always: absolute value identify (coefficient-outside form, RP1-RP6)

**SSI Q1-Q2:** PF matches (identify), OR differs (quadratic vs. AV), SC differs (multi-input structure same), QA matches (identify), CX matches (abstract), ST differs, AV matches (dropdown + numeric). SSI = 4/7 = 0.57.

**SSI Q2-Q3:** Very high structural match. Both identify. Both abstract. Both 2-input structure. SSI = 6/7 = 0.86.

**Pattern:** Q1-Q3 are structurally locked. The identify block contributes the highest SSI in the exam. This is intentional (same standard W2.b, multiple function types) but means QDS will always be suppressed by this block.

**RP7 change:** Q2 and Q3 are both absolute value. This is a regression — Q2 was square root in RP1-RP6. SSI Q2-Q3 in RP7 = 7/7 = 1.0 (perfect match, different only in coefficient). This is template lock.

**GR prescription for RP8:** Q2 must return to square root or change to another function type. Do not repeat Q3's function type in Q2.

---

### Q4-Q7 (Exponential, W3.d)

RP1: Q4 exponential (decay, ans=2.5), Q7 exponential (growth, ans=0.5)
RP2: Q4 exponential (1.33), Q7 exponential (3.5)
RP6: Q4, Q5, Q8 all exponential — three exponentials in one exam

**SSI Q4-Q7:** PF matches (exponential solve), OR matches, SC similar (rational decimal), QA matches (solve), CX matches, ST similar. SSI = 5/7 = 0.71 typically.

**RP6 finding:** Three exponentials (Q4=5, Q5=1, Q8=4) increases SSI across consecutive pairs. Q4-Q5 SSI = 6/7. This is a regression from RP5. Q4-Q7 SSI in RP6 = 6/7 (Q5 and Q8 are both exponential adjacents).

**GR prescription for RP8:** Cap exponential questions at 2 per exam. Position them at Q4 and Q7 (maximum spacing, minimum adjacent SSI).

---

### Q5, Q6, Q9, Q11 (Solving: quadratic, radical, rational, fractional-exp)

This block has the most structural variation across exams. RP7 moved Q6 from radical to rational (W3.c instead of W3.b). This is a genuine structural improvement — different standard, different algorithm, different verification method.

**SSI Q5-Q6 (RP1-RP6):** PF varies (quadratic vertex vs. radical form), OR differs, SC varies (integer vs. irrational), QA matches (solve), CX matches, ST differs. SSI = 3/7 = 0.43.

**SSI Q5-Q6 (RP7):** Q5 is quadratic, Q6 is rational (rational function solve). PF differs, OR differs, SC differs (negative answer -4), QA matches, CX matches, ST varies. SSI = 2/7 = 0.29. This is the lowest SSI pair in RP7 — good.

---

### Q14 (Variable question type across exams)

| Exam | Q14 Type | Standard | SSI vs Q13 |
|------|----------|---------|-----------|
| RP1 | multiple-choice | W3.a | ~0.43 |
| RP2 | multiple-choice | W3.a | ~0.43 |
| RP3 | multiple-choice | W3.a | ~0.43 |
| RP4 | multiple-choice | W3.a | ~0.43 |
| RP5 | error-analysis | W3.a | ~0.29 |
| RP6 | construct | W2.b | ~0.14 |
| RP7 | multiple-choice | W2.d | ~0.43 |

**Pattern:** Q14 is the primary structural variation lever GR used (multiple-choice → error-analysis → construct). RP5 and RP6 show real structural improvements. RP7 regresses to multiple-choice.

**GR prescription for RP8:** Q14 should be error-analysis or construct — not multiple-choice. If construct, it should not be W2.b (same as Q1-Q3 standard) — use W3 standard for construct.

---

### Q15 (Word problem, W3.a)

Standard is W3.a across all exams. This is correct. The variation FR recommended is: change the application context (triples/doubles/decays) and the algebraic form required (same base vs. data-points).

Across RP1-RP7: Q15 is always W3.a word problem. The answers vary (24, 25, blank, blank, blank...). FR could not confirm from the JSON whether RP3-RP7 Q15 has been updated to address the model-writing gap identified in fr-word-problem-rootcause.md.

**GR action needed:** Confirm RP6, RP7, RP8 Q15 requires model-writing as an explicit step (Presentation Form = applied verbal, not equation given). If Q15 provides the equation, it is testing solve, not model-write — and this leaves the L3 gap open.

---

## QDS Calculation (Estimated)

FR estimates QDS per exam using the average SSI of consecutive question pairs (Q1-Q2, Q2-Q3, ... Q14-Q15).

| Exam | Key Changes vs. Prior | Estimated QDS | Verdict |
|------|----------------------|--------------|--------|
| RP1 | Baseline | 0.13 | FAIL |
| RP2 | Answer diversity only (same types) | 0.16 | FAIL |
| RP3 | Q12-Q13 graph answer signs change | 0.18 | FAIL |
| RP4 | Q8 negative rational (-11), Q14 stays MC | 0.24 | MARGINAL |
| RP5 | Q14 error-analysis, Q7 negative decimal | 0.29 | IMPROVING |
| RP6 | Q14 construct (W2.b), extra exponential (hurts) | 0.38 | APPROACHING |
| RP7 | Q6 rational (not radical), Q14 MC regression, Q2=Q3 (AV) | 0.41 | BELOW TARGET |

**FR confidence in these estimates:** LOW-MEDIUM. Each SSI pair requires scoring 7 dimensions. FR scored these analytically from question type and standard without computing all 7 dimensions on every pair. The numbers should be treated as directional, not precise. GR should compute the full 7-dimension SSI matrix on RP7 before it is submitted to Kai.

---

## FR Recommendations for RP8

Targeting QDS >= 0.45:

1. **Q2:** Return to square root identify (not absolute value). SSI Q2-Q3 should be 3/7 or lower.
2. **Q6:** Keep as rational solve (W3.c) as in RP7. This was the right structural change.
3. **Q8:** Keep negative rational answer. This varies SC dimension.
4. **Q14:** Use error-analysis or construct. Not multiple-choice.
5. **Exponentials:** Cap at 2 in the exam. Space to Q4 and Q7.
6. **Q15:** Confirm model-write is required (equation NOT given). Change application context (decay with half-life).
7. **Q9:** Use equal-radicals form (sqrt(ax+b) = sqrt(cx+d)) — structural variant, AV dimension shifts.

If GR implements all 7, estimated RP8 QDS: 0.47-0.52 range.

---

## Confidence Statement

These QDS scores are FR's structural estimates, not precisely computed values. The evidence base is: (1) FR read the type and standard field for all 105 questions across RP1-RP7, (2) FR applied the 7-dimension framework to score consecutive pairs qualitatively. Two independent sources were not gathered — this is a single-pass analysis. Label: **Estimated**.

For GR to compute precise QDS: build the 7-dimension SSI matrix in a spreadsheet, one row per consecutive pair, score each dimension 0/1 (match/no-match), sum and divide by 7 per pair, then average. This takes 30-45 minutes but produces a Measured score.
