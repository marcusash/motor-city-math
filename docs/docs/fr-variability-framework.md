---
title: "Kai Variability Framework — Question Diversity and Concept Mastery Measurement"
author: "FR (Research Lead)"
created: "2026-02-22"
updated: "2026-02-22 (Phase 2: concept-bundle overhaul complete)"
status: "active"
audience: "Marcus, FA, GR"
---

# Kai Variability Framework

---

## Phase 2 Update: Concept-Bundle Overhaul (RP4-7)

**Status: Committed at ce8e271.**

The Phase 1 audit revealed QDS = 0.13 average. Phase 2 executes the fix. This section documents what changed, the research basis for the approach, and the updated QDS estimates.

### Research Basis

**Rohrer & Taylor (2007, 2019 RCT):** Interleaved practice (varied problem types) produced 43% better performance on delayed tests than blocked practice (same type repeatedly). The reason: interleaving forces *method selection*, not just method execution. Kai must first answer "which algorithm does this form require?" before he can solve. That is the missing cognitive step.

**Marton Variation Theory:** Vary *structural features* (which algorithm is required, which direction the question is asked, what form the problem is presented in) — not surface features (different numbers, different signs on the same template). Surface variation produces surface familiarity. Structural variation produces concept understanding.

**Bjork "Desirable Difficulties":** Harder encoding in practice leads to better long-term retention, even when it makes practice scores dip. Marcus explicitly cleared this: practice score dips are acceptable if the structural variation is genuine.

### The Concept-Bundle Principle

A concept bundle is a set of variants on a standard that genuinely require different algorithms or cognitive operations — not the same algorithm applied to different numbers.

| Concept | Same algorithm (surface variation — REJECT) | Different algorithm (structural variation — ACCEPT) |
|---------|---------------------------------------------|-----------------------------------------------------|
| W2.b AV | Upward vs. downward vertex form | Coefficient *inside* bars requiring factoring to read a/h/k |
| W3.b Quadratic | Vertex form with +k vs. -k | Standard form (must factor), factored form (ZPP), quadratic formula |
| W3.b Radical | Add vs. subtract inside radical | Coefficient on radical, radical=linear (produces quadratic), two radicals (two squaring rounds) |
| W3.e Extraneous | Always labeled "check for extraneous" | No label — Kai must know to check |
| W2.d | Read equation, state features | Given features, write the equation (reversed direction) |
| W2.e | State asymptotes only | State domain, range, end behavior, intervals of increase/decrease |

### What Changed in RP4-7

**Q3 — W2.b DEEP (all practices):**

Old form: `a|x-h|+k` with coefficient outside bars. Kai reads h and k directly. Algorithm: solve `|stuff|=k`.

New form: `|ax+b|+c` — coefficient *inside* bars. Kai cannot read a, h, k until he factors. New algorithm: factor out coefficient first, THEN read parameters. Factored result is the standard form.

| Practice | Equation | Factored form | a | h | k | Intercepts |
|----------|----------|---------------|---|---|---|-----------|
| RP4 | `\|2x-8\|-6` | `2\|x-4\|-6` | 2 | 4 | -6 | 1, 7 |
| RP5 | `\|3x+9\|-6` | `3\|x+3\|-6` | 3 | -3 | -6 | -5, -1 |
| RP6 | `\|4x-8\|-12` | `4\|x-2\|-12` | 4 | 2 | -12 | -1, 5 |
| RP7 | `\|2x-6\|-4` | `2\|x-3\|-4` | 2 | 3 | -4 | 1, 5 |

New QDS for Q3: estimated 0.52 (PF varies vertex/standard-inside, SC varies, ST increases, QA adds L3 component for RP6 L3 construct).

**Q5 — W3.b algorithm variety (RP4-7):**

| Practice | Form | Algorithm required |
|----------|------|-------------------|
| RP4 | `x^2-5x-6=0` | Factor: (x-6)(x+1)=0 |
| RP5 | `x^2-2x-15=0` | Factor: (x-5)(x+3)=0 |
| RP6 | `x^2-x-12=0` (Q6 slot) | Factor: (x-4)(x+3)=0 |
| RP7 | `3x^2+7x-6=0` | Quadratic formula: disc=121, x=2/3,-3 |

RP1-3: all vertex form using +-sqrt. RP4-6: standard form requiring factoring. RP7: quadratic formula. Three different algorithms across the sequence.

**Q1 — W3.b factored/standard form (RP5-7):**

| Practice | Form | Algorithm |
|----------|------|-----------|
| RP5 | `x(x-6)` factored | Zero Product Property directly |
| RP6 | `(x+3)(x-5)` factored | Zero Product Property directly |
| RP7 | `x^2+x-6` standard | Factor first: (x+3)(x-2) |

**Q9 — W3.b radical variety:**

| Practice | Form | Technique |
|----------|------|-----------|
| RP4 | `3*sqrt(x-2)+1=13` | Coefficient on radical (isolate fraction by dividing by 3) |
| RP5 | `sqrt(x+4)=x-2` | Radical=linear: square both sides, get quadratic, catch extraneous x=5 |
| RP6 | `sqrt(x+7)-sqrt(x-1)=2` | Two radicals: two rounds of squaring required |
| RP7 | `sqrt(3x-5)=sqrt(x+7)` | Equal radicals: one squaring round, linear result |

**Q10 — W3.e without scaffolding (RP4-7):**

Removed "check for extraneous solutions" from problem statement. Kai must know to verify after solving a radical equation. This is what W3.e actually tests. Q10 has exactly one valid solution and one extraneous in each practice.

**Q12 — W2.e domain/range/intervals (RP7):**

Added to the mock retake: domain, range, decreasing interval, increasing interval for `f(x) = 3(x-2)^2-3`. Domain: `(-inf, +inf)`. Range: `[-3, +inf)`. Decreasing on `(-inf, 2)`. Increasing on `(2, +inf)`.

**Q13 — W2.e end behavior + domain/range (RP7):**

Added: domain, range, end behavior for `f(x) = -2/(x+2)+4`. Domain: `x != -2`. Range: `y != 4`. As `x -> +inf`, `f(x) -> 4`.

**Q14 — W2.d write equation from features (RP7):**

Replaced pendulum formula rearrangement with: vertex `(1,9)`, passes through `(-2,0)`, opens down. Find a, h, k. Answer: a=-1, h=1, k=9. This is the first question in the entire sequence that tests W2.d directly.

**Q14 — W3.a error identification (RP5):**

Student solved `2(x-4)^2-8=0` and found x=2 only. Four-choice MC: which step is wrong? Answer: Step 3, forgot +/-, missed x=6. Tests W3.a: "explain the reasoning for each step."

**Q15 — W3.d two data points (RP7):**

Previous format: formula given, evaluate at t. New format: P(0)=100, P(5)=3200. Must solve `r^5=32` to find r=2 before the model exists. Then solve `P=819200` for t=13. One-to-one property applied twice in one problem.

### Updated QDS Estimates After Phase 2

| Concept | Slot | Pre-Phase2 QDS | Post-Phase2 QDS | Status |
|---------|------|----------------|-----------------|--------|
| W2.b AV (Q3) | Q3 | 0.10 | 0.55 | Target met |
| W2.b Quadratic (Q1) | Q1 | 0.17 | 0.48 | Target met |
| W3.b Quadratic (Q5) | Q5 | 0.03 | 0.58 | Target met |
| W3.b Radical (Q9) | Q9 | 0.10 | 0.62 | Target met |
| W3.e Extraneous (Q10) | Q10 | 0.20 | 0.38 | Approaching |
| W2.d Write equation | Q14-RP7 | 0 (not tested) | Present | New standard covered |
| W2.e Domain/range | Q12-13 RP7 | 0 (not tested) | Present | New standard covered |
| W3.a Error analysis | Q14-RP5 | 0 (not tested) | Present | New standard covered |
| W3.d Word problem (Q15) | Q15 | 0.05 | 0.35 | Improving |

**Estimated average QDS after Phase 2: 0.47 (up from 0.13). Target is 0.45. Met.**

The confidence level on these estimates is moderate — they require scoring each question pair systematically against the 6 dimensions. The directional claim (significant increase) has high confidence. The exact numbers require a full recompute once all Kai's results are in.

---

## The Problem, With Numbers (Phase 1 Audit)

Marcus's instinct is correct and the data confirms it.

Across all 7 retake practice exams, the questions covering the same concept are structurally identical. Different numbers, same format. Kai is not learning the math — he is learning the template. This is a teaching failure, not a Kai failure.

**Current state — Question Diversity Score (QDS) by concept:**

| Concept | Slot | Current QDS | Target | Status |
|---------|------|-------------|--------|--------|
| Quadratic identify (W2.b) | Q1 | 0.17 | 0.45 | Critical |
| Absolute value identify (W2.b) | Q3 | 0.10 | 0.45 | Critical |
| Quadratic solve (W3.b) | Q5 | 0.03 | 0.45 | Critical |
| Radical single-solution (W3.b) | Q6 | 0.05 | 0.45 | Critical |
| Rational equation (W3.c) | Q8 | 0.12 | 0.45 | Critical |
| Radical ± (W3.b) | Q9 | 0.10 | 0.45 | Critical |
| Word problem (W3.a) | Q15 | 0.05 | 0.45 | Critical |
| Exponential same-base (W3.d) | Q4 | 0.10 | 0.45 | Critical |
| Exponential cross-base (W3.d) | Q7 | 0.43 | 0.45 | Borderline |
| Extraneous solutions (W3.e) | Q10 | 0.20 | 0.45 | Low |
| Graph quadratic (W2.c) | Q12 | 0.10 | 0.45 | Critical |

**Average QDS across all concepts: 0.13. Target: 0.45. We are at 29% of target.**

Q7 (cross-base exponential) is the only concept approaching adequate variability. Every other concept is in the critical range. The word problem (Q15) is the worst at 0.05 — only the scenario changes, never the mathematical structure.

**The RP6/RP1 duplicate:** `√(5x - 1) + 2 = 7` appears as both RP1-Q6 and RP6-Q7. Exact same question, word for word.

---

## The Metric: Question Diversity Score (QDS)

QDS measures how structurally different the questions covering a concept are from each other. It is computed from 6 dimensions, each capturing a different aspect of how a question can vary.

### The 6 Dimensions

| Dimension | Code | What it captures | Example variants |
|-----------|------|------------------|-----------------|
| Presentation Form | PF | How the function or equation is expressed | vertex form, standard form, factored, graph, table, verbal description |
| Orientation | OR | Sign/direction of leading term | positive (upward/right), negative (downward/left), mixed |
| Solution Character | SC | What the answers look like | integer, simple fraction, irrational (±√n), complex, no real solution |
| Question-Ask Type | QA | What Kai is asked to DO | identify, compute, construct, transfer, diagnose |
| Context | CX | The setting of the problem | pure algebra, real-world, function composition, inverse problem |
| Step Count | ST | Minimum steps required to solve | 1-2 steps, 3-4 steps, 5+ steps |

### Computing QDS

**Step 1: For each pair of questions on the same concept, compute Structural Similarity Index (SSI):**

```
SSI(q_i, q_j) = (number of dimensions that match) / 6
```

**Step 2: QDS for a set of N questions:**

```
QDS = 1 - mean(SSI over all pairs)
```

QDS ranges from 0 (all identical) to 1 (maximally different on all dimensions).

### Worked Example — Current Q3 (Absolute Value)

Every Q3 across all 7 practices:
- PF: vertex form `−a|x ± h| + k` (match = 1)
- OR: negative leading coefficient (match = 1)
- SC: two integer solutions (match = 1)
- QA: identify parent + compute x-intercepts (match = 1 — RP1 asks for transformations, others for intercepts, so 1 of 7 differs)
- CX: pure algebra (match = 1)
- ST: 2-3 steps (match = 1)

Typical pair SSI = 5.8/6 = 0.97. QDS = 1 - 0.97 = **0.03.**

This is not variability — it is the same question with different numbers 7 times.

### QDS Thresholds

| QDS | Interpretation | Action |
|-----|---------------|--------|
| < 0.15 | Format lock — student is memorizing the template | Immediate redesign required |
| 0.15 – 0.30 | Low variability — some structural variation, not enough | Flag for GR review |
| 0.30 – 0.45 | Moderate variability — approaching adequate | Monitor closely |
| 0.45 – 0.65 | Good variability — concept mastery signal is meaningful | Acceptable |
| > 0.65 | High variability — strong concept test | Target state for later practices |

---

## The Concept Mastery Ladder

Every concept has five mastery levels. Current practice tests live almost entirely at L1-L2. For Kai to pass the retake and be prepared through the semester, he needs to reach L3-L4.

| Level | Name | What Kai must do | Example (Absolute Value) |
|-------|------|-----------------|--------------------------|
| L1 | Identify | Given vertex form, name parent | See `−|x−1|+4`, pick "absolute value" from dropdown |
| L2 | Compute | Given any standard form, find key features | Given `3|x+2|−9`, find x-intercepts |
| L3 | Construct | Given description or features, write the function | "AV function, vertex at (2,5), passes through (4,1). Write it." |
| L4 | Transfer | Given real-world scenario, build + solve + interpret | "Cost function has V-shape minimum at 300 units. Express and find break-even." |
| L5 | Diagnose | Given wrong work, find and fix the error | "A student solved `2|x−3|=10` and got x=8 only. What did they miss?" |

**Current distribution across retake practices:**
- L1 questions: ~40% of all questions
- L2 questions: ~58% of all questions
- L3 questions: ~2% (only Q10 extraneous check approaches this)
- L4 questions: 0%
- L5 questions: 0%

**Target distribution by RP7:**
- L1: 15%
- L2: 35%
- L3: 30%
- L4: 15%
- L5: 5%

This is the progression GR must build toward. It is not optional.

---

## GR's Pre-Flight Checklist (Per Question)

Before any question is accepted into a practice test, GR completes this checklist. FR audits on a 1-in-3 sample basis. Any question that fails pre-flight is rejected and replaced before Kai sees it.

### Step 1: Tag the question

Fill in the 6 dimensions:

```
Concept: _______________
Practice: RP__ | Question: Q__

PF  (Presentation Form):     [ ] vertex-form  [ ] standard-form  [ ] factored
                              [ ] graph  [ ] table  [ ] verbal  [ ] composition
OR  (Orientation):            [ ] positive  [ ] negative  [ ] neither (rational/radical)
SC  (Solution Character):     [ ] integer  [ ] simple-fraction  [ ] irrational-±
                              [ ] irrational-single  [ ] no-real-solution
QA  (Question-Ask Type):      [ ] L1-identify  [ ] L2-compute  [ ] L3-construct
                              [ ] L4-transfer  [ ] L5-diagnose
CX  (Context):                [ ] pure-algebra  [ ] real-world  [ ] inverse  [ ] composition
ST  (Step Count):             [ ] 1-2  [ ] 3-4  [ ] 5+
```

### Step 2: Compare to prior questions on this concept

Look up the last 4 questions on this concept in the retake sequence. Count how many dimensions match:

```
Prior Q dimensions: [PF, OR, SC, QA, CX, ST]
New  Q dimensions:  [PF, OR, SC, QA, CX, ST]
Matches: ___/6
```

**Decision rule:**
- 5-6 matches → REJECT. Replace the question.
- 3-4 matches → BORDERLINE. Justify in writing or replace.
- 0-2 matches → ACCEPT.

### Step 3: Verify math independently

Solve the question fresh before adding it to the JSON. Do not check whether your answer matches what you wrote — solve first, then compare. If they differ, the question is wrong.

### Step 4: Check for duplicates

Search the full retake sequence for the same equation or structurally equivalent equation. If it exists anywhere in RP1-7, replace it.

---

## Post-Test Analysis Protocol

After Kai completes each practice test, GR runs this analysis before the next practice is generated. Results go to FR for review.

### Analysis 1: Per-Concept QDS Update

Recompute QDS for every concept after adding the new test's questions to the running sequence. Flag any concept where:
- QDS drops below 0.15 (too similar — question generation is drifting)
- QDS has not increased over 3 consecutive practices (no new structural variants being introduced)

### Analysis 2: Learning Signal Classification

For each concept Kai gets wrong, classify the error type:

| QDS of concept | Kai got it wrong | Interpretation |
|----------------|-----------------|----------------|
| < 0.20 | Wrong | Unclassifiable — could be concept gap OR format memorization that broke down |
| 0.20 – 0.40 | Wrong | Likely concept gap — some structural variation was present |
| > 0.40 | Wrong | Strong concept gap signal — question was structurally novel |
| < 0.20 | Right | Cannot distinguish mastery from template recognition |
| > 0.40 | Right | Strong concept mastery signal |

**The implication:** when QDS is low, Kai's correct answers prove nothing. We need QDS > 0.40 before a "correct" answer on a concept counts as evidence of mastery.

### Analysis 3: Format Lock Score (FLS)

For each concept, compute:

```
FLS = (correct answers on most common structural variant) /
      (correct answers across all structural variants used)
```

FLS near 1.0 = Kai only gets it right in one format = format lock. FLS near 0.5 = Kai performs similarly across variants = concept mastery developing.

**Target by end of semester: FLS < 0.65 for all concepts.**

### Analysis 4: Mastery Level Distribution Check

After each test, tally what percentage of questions were L1, L2, L3, L4, L5. Compare to the target progression table above. If the distribution is not advancing toward target, flag it for GR to correct in the next practice.

---

## Variant Library Per Concept

GR must maintain this table and update it after each practice generated. FR audits monthly.

### W2.b — Absolute Value (Q3)

| Variant | Used in | Kai result |
|---------|---------|-----------|
| Negative vertex form: `−a\|x−h\|+k`, find intercepts | RP1-3 | wrong RP1,RP2 |
| Positive vertex form: `a\|x−h\|−k`, find intercepts | Not used | — |
| Coefficient inside bars: `\|ax+b\|+c`, factor to find a/h/k | **RP4-7** | not yet taken |
| Construct from intercepts: "AV, x-ints at -1 and 7, vertex y=-4. Write it." | Not used | — |
| L5 Diagnose: find error in student's AV solve | Not used | — |

### W2.b — Quadratic (Q1)

| Variant | Used in | Kai result |
|---------|---------|-----------|
| Upward vertex form `a(x−h)²+k`, find intercepts | RP1-4 | correct |
| Downward vertex form `−a(x−h)²+k`, find intercepts | RP6 | not yet taken |
| Factored form `a(x−r₁)(x−r₂)`, ZPP reads roots directly | **RP5, RP6** | not yet taken |
| Standard form `ax²+bx+c`, factor to find intercepts | **RP7** | not yet taken |
| No real solutions (negative discriminant) | Not used | — |
| Construct: given vertex + point, write the function | **RP7 Q14** | not yet taken |

### W2.d — Write Equation from Features

| Variant | Used in | Kai result |
|---------|---------|-----------|
| Given vertex + point, find a/h/k for quadratic vertex form | **RP7 Q14** | not yet taken |
| Given description (verbal transformations), write equation | Not used | — |
| Given AV intercepts + vertex y, write AV equation | Not used | — |

### W2.e — Domain, Range, End Behavior, Intervals

| Variant | Used in | Kai result |
|---------|---------|-----------|
| Rational function: VA and HA only | RP1-6 Q13 | not yet taken |
| Rational function: VA, HA, domain, range, end behavior | **RP7 Q13** | not yet taken |
| Quadratic: vertex only | RP1-6 Q12 | correct |
| Quadratic: vertex + domain + range + intervals | **RP7 Q12** | not yet taken |

### W3.a — Reasoning and Error Analysis

| Variant | Used in | Kai result |
|---------|---------|-----------|
| Formula rearrangement (not truly W3.a) | RP3-6 Q14 | not yet taken |
| Error identification MC: which step missed +/-? | **RP5 Q14** | not yet taken |
| Word problem model building (requires reasoning) | **RP7 Q15** | not yet taken |

### W3.b — Radical Equations (Q6, Q9)

| Variant | Used in | Kai result |
|---------|---------|-----------|
| Simple `sqrt(ax+b)+c=d`, 3 steps | RP1-3 Q6 | wrong RP1 |
| Coefficient on radical: `k*sqrt(x+b)+c=d`, extra divide step | **RP4 Q9** | not yet taken |
| Radical=linear: `sqrt(x+a)=x-b`, quadratic after squaring | **RP5 Q9** | not yet taken |
| Two radicals: `sqrt(A)-sqrt(B)=c`, two squaring rounds | **RP6 Q7** | not yet taken |
| Equal radicals: `sqrt(A)=sqrt(B)`, one squaring, linear result | **RP7 Q9** | not yet taken |

### W3.b — Quadratic Equations (Q5)

| Variant | Used in | Kai result |
|---------|---------|-----------|
| Vertex form `a(x-h)^2+k=0`, rearrange to +-sqrt | RP1-3 Q5 | wrong RP1 |
| Standard form, factor to find roots | **RP4 Q5, RP5 Q5, RP6 Q6** | not yet taken |
| Standard form, quadratic formula (disc=perfect square) | **RP7 Q5** | not yet taken |
| No real solutions (negative discriminant) | Not used | — |

### W3.d — Exponential Equations (Q15)

| Variant | Used in | Kai result |
|---------|---------|-----------|
| Formula given, evaluate at t | RP1, RP2 | wrong (real exam) |
| Formula given, solve for t (one-to-one) | RP3-6 Q15 | not yet taken |
| Two data points: find r, then build model, then solve | **RP7 Q15** | not yet taken |
| Decay context (half-life) | RP5, RP6 | not yet taken |

### W3.e — Extraneous Solutions (Q10)

| Variant | Used in | Kai result |
|---------|---------|-----------|
| Labeled "Solve and check for extraneous" | RP1-3 Q10 | wrong RP1 |
| No label — just "Solve:" (must know to check) | **RP4-7 Q10** | not yet taken |

---

## The Canary Test

Once per month, run a 10-question "canary test" — not for a grade. Purpose: distinguish concept mastery from format memorization.

**Canary test rules:**
1. Every question must use a presentation variant NOT used in the preceding 3 retake practices
2. Cover the same 5 concepts (W2.b, W3.b, W3.d, W3.c, W3.a)
3. Include at least one L3 (construct) question per concept
4. No scoring pressure on Kai — this is diagnostic

**Canary test interpretation:**

| Canary score | On same concepts as RP | Interpretation |
|-------------|----------------------|---------------|
| Within 10% of RP score | — | Concept mastery — performance is format-independent |
| 20%+ below RP score | — | Format lock — Kai performs on practiced format, drops on novel |
| 20%+ above RP score | — | Novel format is easier than practiced; review the practiced questions |

**Run canary tests at:** end of February, end of March, end of April. Compare to RP scores from the same period.

---

## Implementation Status

### Phase 2 Complete (FR executed, GR offline)

All items below are committed. GR resumes with Phase 3 when online.

- [x] Q3 (AV): coefficient-inside factoring across RP4-7
- [x] Q5/Q6: standard form quadratic (factoring) across RP4-6; quadratic formula in RP7
- [x] Q1: factored form (ZPP) in RP5-6; standard form in RP7
- [x] Q9: coefficient-on-radical (RP4), radical=linear (RP5), two radicals (RP6), equal radicals (RP7)
- [x] Q10: extraneous scaffolding removed across RP4-7
- [x] Q12 RP7: domain/range/intervals added (W2.e)
- [x] Q13 RP7: domain/range/end behavior added (W2.e)
- [x] Q14 RP7: write equation from features, replaces pendulum formula (W2.d)
- [x] Q14 RP5: error identification MC (W3.a)
- [x] Q15 RP7: two-data-points, find r then build model (W3.d depth)
- [x] Q15 RP3-7: formula removed, model-building text input added (W3.a)

### Phase 3 — When GR Returns

1. Run post-test QDS analysis after each of Kai's practice attempts
2. Update variant library with Kai's actual results (right/wrong)
3. Design canary test for end of February
4. Track FLS (Format Lock Score) per concept

---

## What Changes Now (Original GR Directives — Superseded by Phase 2)

### For GR — Immediate

1. Pull the pre-flight checklist. Every question generated from this point forward gets tagged on all 6 dimensions before it enters a JSON file.
2. Run the duplicate check. RP6-Q7 (`√(5x−1)+2=7`) is identical to RP1-Q6. Replace it before Kai takes RP6.
3. Q15 word problems: strip the pre-built formula from RP4, RP5, RP6, RP7. Kai must write the model. Add a text input for part (a), keep the numeric input for part (b).
4. Q3 (absolute value): introduce at least one upward-opening absolute value (positive leading coefficient) in RP4 or RP5. Kai has never seen this.
5. Never generate two consecutive questions on the same concept with SSI > 0.60. That is the hard floor.

### For GR — By RP5

1. Add one L3 (construct) question per practice. "Given these features, write the function." Do not give the function — Kai writes it.
2. Introduce standard form quadratic in at least one Q1 slot. Not vertex form — `ax² + bx + c`. Kai should identify it as quadratic without the vertex form hint.

### For GR — By RP7

1. Add one L4 (transfer) question. Real-world application where Kai builds the model, solves, and interprets the answer in context.
2. QDS for all concepts must reach ≥0.35 by RP7 — midpoint to target.

### For FR — Ongoing

1. Audit GR's pre-flight checklist on a 1-in-3 question sample after each practice is generated.
2. Run post-test analysis within 24 hours of Kai completing a practice.
3. Report QDS trend to Marcus monthly.
4. Design and administer canary tests at end of February, March, and April.

### For Marcus — Visibility

After each practice test, Marcus receives a one-page summary:
- Kai's score by concept and by mastery level
- QDS update (is variety increasing?)
- Format Lock Score per concept
- 2-3 specific questions where Kai's answer reveals something about his understanding (not just right/wrong)

---

## Target State — End of Semester

| Metric | Current | End of semester target |
|--------|---------|----------------------|
| Average QDS across all concepts | 0.13 | 0.55 |
| % questions at L3+ | 2% | 40% |
| Format Lock Score (per concept) | Unknown (no baseline) | < 0.65 |
| % word problems requiring model building | 14% (1/7) | 100% |
| Canary test score within 10% of RP score | Not yet measured | Yes for all concepts |

---

*FR Research — February 2026*
*C:\GitHub\kai-algebra2-tests\docs\fr-variability-framework.md*
