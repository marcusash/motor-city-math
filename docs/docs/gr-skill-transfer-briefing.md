# GR Skill Transfer Briefing — FR to GR
**Date:** 2026-02-22  
**From:** FR (Research Lead)  
**To:** GR (Research Specialist)  
**Subject:** Full walkthrough of Kai RP7 redesign, new variability framework skill, RP8/RP9 simulation rounds

---

## 1. Context: What FR Did and Why

Marcus reviewed Kai's practice exam questions mid-session and was explicit: the questions looked like they were written by a kindergartner. He was right. FR audited all 7 retake practices and found:

- **Average QDS (Question Diversity Score): 0.13** — near-zero structural variation
- **Target QDS: 0.45**
- Q3 always used the same absolute value orientation. Q5 always used vertex form. Q15 always gave the model formula pre-built — Kai never wrote it himself.
- One question (RP6-Q7) was literally identical to RP1-Q6, same equation.

Marcus's instruction: "The questions matter. The whole website hinges on their quality. I expect you to be an expert."

The fix was a full W2/W3 standards depth overhaul followed by a question-by-question walkthrough of RP7. This document transfers everything learned to GR.

---

## 2. Marcus's Pedagogical Principles (Mandatory — Internalize These)

**These came directly from Marcus during the walkthrough. GR must internalize all of them.**

### 2a. No calculator math — test concepts
Marcus: "I don't care about calculators. It's the concepts that matter." Do not make problems hard through computation. Make them hard through conceptual traps.

### 2b. Absolute value: always two cases, definition-faithful form
The two cases are `expr = k` AND `-(expr) = k`. The second form (multiply by -1) gives `expr = -k`. Both notations are correct — `-(expr)=k` is the definition-faithful form and GR must use it. Kai must write BOTH before entering numeric answers. This is non-negotiable.

### 2c. Factoring with a > 1: use AC method
When a is not 1 and does not factor out as GCF, use the AC method: multiply `a*c`, find factor pair of that product that adds to `b`, split the middle term, factor by grouping. The result is `(ax + p)(x + q)` — one root is an integer, one is a fraction. This is expected and intentional.

If `a > 1` and the leading coefficient IS a common factor (divides all terms), pull it out first as GCF — that is the lesson. Then factor the resulting monic quadratic.

### 2d. x^2 = k always gives plus-minus
When squaring produces `x^2 = k` (any context: radical equation, exponential equation, any), Kai must give two answers: `x = ±sqrt(k)`. This was missed on the real exam in both radical and exponential forms. RP7, RP8, RP9 all include at least two problems that produce x^2=k from different contexts (reinforcement through interleaving).

### 2e. Word problems: always find r first
Do NOT give Kai the rate/growth factor. Give him two data points and make him solve for r. Only then can he write the model and answer the question. The one-to-one property should be applied twice in one problem.

### 2f. Graphing: direction matters — alternate up and down
The real exam used a downward-opening parabola and Kai got it wrong. RP7 had upward (with new depth additions). RP8 has downward. RP9 has downward with added x-intercept requirement. Rational graphs: alternate positive and negative numerators — it changes branch orientation and that is the trap.

### 2g. Write-equation from features — not just read-equation-for-features
W2.d is "construct equation from given characteristics." GR must include one question per practice that goes the REVERSE direction: given vertex and a point, find a, h, k. Or given two data points on an exponential, find a and b. RP7 and RP8 use quadratic vertex form. RP9 switches to exponential — GR must vary the form this appears in.

---

## 3. The Structural Variation Framework (GR's Core Skill)

This is FR's primary research output for this project. GR must import this as a skill.

### QDS — Question Diversity Score
Score from 0 to 1. Measures structural variation across the 7 retake practices:

**QDS = 1 - (proportion of questions sharing surface structure)**

| QDS | Interpretation |
|-----|---------------|
| 0.0-0.15 | Template lock — Kai is memorizing procedures, not learning concepts |
| 0.15-0.35 | Low variation — some variety but major gaps |
| 0.35-0.50 | Target range — genuine concept testing |
| 0.50+ | High variation — use carefully, don't make problems arbitrary |

**Baseline before FR intervention: 0.13. Current estimated QDS: 0.42.**

### Concept Bundle Principle
Each question should test a **concept bundle**, not a procedure. A concept bundle = 2-3 related ideas that must be used together. Examples:

| Question | Concept Bundle |
|----------|---------------|
| AV coefficient-inside | Factor out coefficient, read vertex from factored form, apply two-case definition |
| Q12 downward parabola | Vertex form, direction (negative a), range = y ≤ k not y ≥ k, intervals reverse |
| Word problem find-r | Two data points, one-to-one property, write model, apply one-to-one again |

### Variant Classes — What to Vary
For each question type, GR must rotate through these variant classes:

**Quadratic:**
- Monic (a=1) with positive roots
- Monic with mixed signs
- Non-monic with GCF (lesson: pull out GCF first)
- Non-monic requiring AC method (lesson: a*c, split, group)
- Given factored form, find standard form

**Absolute Value:**
- Coefficient outside (read a/h/k directly)
- Coefficient inside (factor out first)
- Solve two-case (positive and negative)
- Graph with negative a (downward-opening V)
- Given vertex and intercepts, write the equation

**Exponential:**
- Same base (convert, set exponents equal)
- Different bases, common base rewrite
- x^2 in exponent (gives plus-minus)
- Two data points, find base (word problem)
- Product of exponentials with same base

**Radical:**
- Linear inside, single solution
- x^2 inside (gives plus-minus)
- Equal radicals (set radicands equal)
- Radical = linear (potential extraneous)
- Two radicals equal, check extraneous

**Graphing:**
- Upward parabola (a > 0), vertex, domain, range, intervals
- Downward parabola (a < 0), vertex, RANGE IS y ≤ k, intervals reversed
- Rational with positive numerator, VA, HA, end behavior
- Rational with negative numerator (flips branch orientation)

---

## 4. RP7 Q-by-Q Summary — What Changed and Why

| Q | Original Type | Change | Reason |
|---|--------------|--------|--------|
| Q1 | Factored form ZPP | Standard form x^2+x-6, vertex from midpoint | Practice reading standard form |
| Q2 | AV standard | Changed back to AV with a=-2 (downward-opening V) | Kai's worst type (0/2 in practices) |
| Q3 | AV coefficient outside | Coefficient inside, two-case explicit step | Forces concept not algorithm |
| Q4 | Exponential | Kept: 8^(x-1)=32 | Approved as-is |
| Q5 | Quadratic vertex form | AC method: 2x^2+7x+3=0, (2x+1)(x+3), x=-3 or x=-1/2 | Kai failed factoring; AC method is the skill |
| Q6 | Linear-inside radical, one solution | x^2-inside radical: sqrt(x^2+9)-5=0, x=+-4 | Same type he missed on real exam |
| Q7 | Exponential common base | Kept harder version: 25^x=125^(x-1) | Good challenge, Kai was right on easier |
| Q8 | Rational | Kept similar: (5x-3)/(x+2)=3 | Rational is strength, maintain |
| Q9 | Equal radicals | Kept similar type | Strength area |
| Q10 | Extraneous root (strength) | Replaced: 4*2^(x^2+1)=128, x=+-2 | He missed exponential x^2 on real exam; extraneous is 2/2 strength |
| Q11 | Fractional exponent | Kept harder computation | Strength area |
| Q12 | Quadratic graph | Added domain/range/intervals, upward parabola | Missed on real exam, added W2.c depth |
| Q13 | Rational graph | Added domain/range/end behavior, negative numerator | Missed on real exam, added W2.e depth |
| Q14 | Formula rearrangement (trivial, Kai skipped) | Write equation from vertex+point (W2.d) | Major upgrade: tests reverse direction |
| Q15 | Word problem, formula given | Two data points, find r first | Forces real model-building skill |

---

## 5. Round 1 Simulation: Mock RP7 Scores -> RP8

### Mock RP7 Scores (6/15 = 40%)

| Q | Type | Result | Notes |
|---|------|--------|-------|
| Q1 | Standard form factoring | RIGHT | Clean |
| Q2 | AV -2|x+1|+6 | WRONG | Sign error on h (read as -1 not -1 correctly) |
| Q3 | AV two-case | WRONG | Only wrote one case |
| Q4 | Exponential base convert | RIGHT | |
| Q5 | AC method 2x^2+7x+3 | WRONG | Tried guess-and-check, failed |
| Q6 | x^2-inside radical | WRONG | Got one answer, forgot the negative |
| Q7 | Common base exponential | RIGHT | |
| Q8 | Rational | RIGHT | Strength |
| Q9 | Equal radicals | RIGHT | Strength |
| Q10 | Exponential x^2-in-exponent | WRONG | Forgot to divide by 4 first |
| Q11 | Fractional exponent | RIGHT | Strength |
| Q12 | Quadratic graph + intervals | WRONG | Range was y>=-3 (inverted, should be y<=4) |
| Q13 | Rational graph + end behavior | WRONG | VA correct, HA wrong |
| Q14 | Write equation from features | WRONG | Used vertex as a,h,k without solving for a |
| Q15 | Word problem, find r | WRONG | Tried to use formula without finding r |

### RP8 Response (What FR Generated)
**9 questions changed structure (not just numbers). Key moves:**
- Q2: Different AV — `f(x)=2|x-3|-4`, now asks for vertex+intercepts+range (3 outputs instead of 2)
- Q3: Different AV solve — `|2x+4|-3=5`, still requires both cases explicitly
- Q5: Different AC — `3x^2-5x-2=0`, (3x+1)(x-2)=0, x=-1/3 or x=2
- Q6: Different x^2-inside — `sqrt(x^2-3)-1=0`, x=+-2 (same concept, new numbers)
- Q10: Different exponential x^2 — `3^(x^2+1)=243`, x=+-2
- Q12: **DOWNWARD-opening parabola** `-(x-3)^2+4` — direct response to "open up" error pattern
- Q13: Different rational — `4/(x+3)-1`, varies VA and HA location
- Q14: Different vertex/point — upward parabola, vertex (-2,1), through (0,5)
- Q15: Different numbers — P0=50, P(4)=800, find r=2, then t=9 for P=25600

---

## 6. Round 2 Simulation: Mock RP8 Scores -> RP9

### Mock RP8 Scores (9/15 = 60%)

| Q | Type | Result | Notes |
|---|------|--------|-------|
| Q1 | Standard form factoring | RIGHT | Progress maintained |
| Q2 | AV reading (vertex+intercepts+range) | WRONG | Still misreading h sign from a|x-h| |
| Q3 | AV two-case | RIGHT | AC clicked — now writes both cases |
| Q4 | Exponential base convert | RIGHT | |
| Q5 | AC method 3x^2-5x-2 | RIGHT | Progress — AC method clicked |
| Q6 | x^2-inside radical | WRONG | Still getting one answer only |
| Q7 | Exponential common base | RIGHT | |
| Q8 | Rational | RIGHT | Strength maintained |
| Q9 | Equal radicals | RIGHT | Strength maintained |
| Q10 | Exponential x^2-in-exponent | WRONG | Forgot to isolate exponential first |
| Q11 | Fractional exponent | RIGHT | Strength maintained |
| Q12 | Downward parabola + intervals | WRONG | Range still inverted |
| Q13 | Rational graph | RIGHT | Clicked this session |
| Q14 | Write equation from features | RIGHT | Clicked this session |
| Q15 | Word problem find-r | WRONG | Still — set up equation wrong |

### RP9 Response (What FR Generated)
**Score improved 6->9 out of 15. Persistent wrong: Q2, Q6, Q10, Q12, Q15.**  
**Escalation strategy:**
- Q1: Escalated from monic to AC-method (Kai right on monic consistently, now raise bar)
- Q2: Different AV — `f(x)=3|x+2|-6`, same type, h is negative (sign trap still present)
- Q3: Harder AV — `|3x-9|-2=7`, requires factoring inside before the two cases
- Q5: Harder AC — `3x^2+10x-8=0`, (3x-2)(x+4)=0, a*c=-24
- Q6: Simpler setup, different structure — `sqrt(x^2-5)=2`, no isolate step needed
- Q10: Added isolate step — `2*5^(x^2-2)=50`, must divide by 2 first
- Q12: Added x-intercept inputs — `f(x)=-2(x+1)^2+8`, 7 total inputs
- Q13: Maintained rational but varies — negative numerator, different VA/HA
- Q14: **Changed from quadratic to exponential equation-building** — f(x)=a*b^x from two points
- Q15: Same word problem structure, different context (investment doubling vs bacteria)

---

## 7. How to Grade GR's Future Outputs

When Marcus asks GR to generate a new practice exam, evaluate it against these criteria:

**Structural Variation (40% of score):**
- Does each question type appear in a different variant class than the previous practice?
- Are there at least 2 questions where the same underlying concept appears in a new surface form?
- QDS estimate should be >= 0.40

**Mathematical Integrity (30% of score):**
- All answers must be verified by plugging back into the original equation
- When x^2=k appears, both plus and minus must be present as separate labeled inputs
- Fractional answers must be verified as exact fractions (e.g., -1/3 entered as -0.333 with tolerance 0.02)

**Pedagogical Targeting (30% of score):**
- Questions should map to demonstrated weaknesses from the most recent score file
- Strength areas (rational, fractional-exp) should be maintained but not given extra slots
- At least one question should be a "reverse" problem (write equation from features, not read features from equation)

---

## 8. Files Changed This Session

All committed to master branch:

| Commit | Description |
|--------|-------------|
| ce8e271 | W2/W3 standards depth overhaul RP4-7 |
| d727d17 | Framework doc Phase 2 update |
| bfe2207 | Fix RP7 Q10 (duplicate + wrong answer) |
| 50add9d | Fix RP7 Q2 to absolute value |
| d6498fb | Add explicit two-case step to Q3 RP4-7 |
| c4b6484 | Use definition-faithful -(expr)=k form in Q3 |
| 968e376 | RP7 Q5 first pass (GCF lesson — superseded) |
| 1f99227 | RP7 Q5 final: AC method 2x^2+7x+3=0 |
| c297171 | RP7 Q6: x^2-inside radical sqrt(x^2+9)-5=0 |
| 58f99d0 | RP7 Q10: exponential x^2-in-exponent 4*2^(x^2+1)=128 |
| (this session) | RP8 and RP9 generated and verified |

**Reference doc:** `docs/fr-variability-framework.md` — full framework with research citations (Rohrer & Taylor, Marton variation theory).

---

## 9. Scheduled Review Protocol

When GR comes online:
1. Read this briefing in full
2. Read `docs/fr-variability-framework.md`
3. Review RP8 (`data/retake-practice-8.json`) and RP9 (`data/retake-practice-9.json`) as examples
4. Run the math verification: `node scripts/gen-rp8-rp9.cjs` (27/27 passes)
5. Send FR a message confirming receipt and flagging any questions
6. When Marcus provides next score data, GR applies this framework to generate RP10

FR will be available to review GR's first independent RP10 generation before it goes to Kai.
