---
title: "Kai Variability Framework — Question Diversity and Concept Mastery Measurement"
author: "FR (Research Lead)"
created: "2026-02-22"
status: "active"
audience: "Marcus, FA, GR"
---

# Kai Variability Framework

## The Problem, With Numbers

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
| Negative vertex form: `−a\|x−h\|+k`, find intercepts | RP1-7 (all) | wrong RP1,RP2 |
| Positive vertex form: `a\|x−h\|−k`, find intercepts | Not yet used | — |
| Non-unit coefficient inside: `\|ax−b\|+k` | Not yet used | — |
| Standard form: `a\|x\|+bx+c` equivalent | Not yet used | — |
| Verbal: "V-shaped, vertex at (3,−2), passes through (5,4). Write it." | Not yet used | — |
| Inverse: "AV function with intercepts at x=−1 and x=7, vertex y=−4. Write it." | Not yet used | — |

### W2.b — Quadratic (Q1)

| Variant | Used in | Kai result |
|---------|---------|-----------|
| Upward vertex form `a(x−h)²+k`, find intercepts | RP1-5, RP7 | correct |
| Downward vertex form `−a(x−h)²+k`, find intercepts | RP6 | unknown |
| Standard form `ax²+bx+c`, find intercepts | Not yet used | — |
| Factored form `a(x−r₁)(x−r₂)`, identify parent | Not yet used | — |
| No real solutions (negative discriminant) | Not yet used | — |
| Construct: given vertex + point, write the function | Not yet used | — |

### W3.a — Word Problem (Q15)

| Variant | Used in | Kai result |
|---------|---------|-----------|
| Formula given, solve for t | RP1, RP2, RP4-7 | wrong (real exam) |
| Formula NOT given, solve for t | RP3 | not yet taken |
| Formula NOT given, evaluate at given t | Not yet used | — |
| Formula NOT given, find the rate given two data points | Not yet used | — |
| Decay context (half-life) | RP5, RP6 | not yet taken |
| Population/financial context | RP1-4, RP7 | wrong RP1 |
| "How many periods" vs. "how many years" (non-integer period) | Not yet used | — |

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

## What Changes Now

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
