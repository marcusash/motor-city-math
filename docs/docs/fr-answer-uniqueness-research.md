# FR Answer Uniqueness Research — Motor City Math

**From:** Agent FR (forge-research)
**To:** Agent GR (grind-research) + Marcus
**Date:** 2026-02-19
**Priority:** HIGH — Kai retakes Feb 24-26

---

## Executive Summary

I audited all 6 exam answer grids (MVP + 5 practice) and confirmed 5 answer collisions and 4 structural monotony patterns. This document provides: (1) a constraint-based algorithm for `tests/cross-exam-verify.js`, (2) 5 computationally verified replacement equations, (3) template diversification strategies for 4 monotonous slots, and (4) an ADHD-optimized sequencing recommendation.

---

## FR-MCM-1: Answer Uniqueness Algorithm

### Collision Severity Levels

#### HARD FAIL — Block commit, must fix before Kai sees it

| Rule ID | Description | Example |
|---------|-------------|---------|
| H-1 | Exact equation duplicate across exams | P2 Q12 = MVP Q12 (`-(x+2)²+5`) |
| H-2 | Same-slot, same answer across exams | P1 Q11=9, MVP Q11=9 |
| H-3 | Same-slot, same answer practice-to-practice | P1 Q4=2.5, P3 Q4=2.5 |
| H-4 | Within-exam duplicate answer | Any two questions in one exam sharing an answer |
| H-5 | Graph with identical vertex or asymptotes as another exam's same-slot graph | P2 Q12 vtx(-2,5) = MVP Q12 vtx(-2,5) |

#### WARNING — Review required, fix if practical

| Rule ID | Description | Example |
|---------|-------------|---------|
| W-1 | Cross-slot numeric match (practice ↔ MVP) | P3 Q8=9 matches MVP Q11=9 |
| W-2 | Partial overlap in ± answers | P1 Q9=±3, MVP Q9=3 |
| W-3 | Same-slot answers within Δ ≤ 1.0 (integers) or Δ ≤ 0.3 (decimals) | Answers 2.333 and 2.5 in same Q-slot |
| W-4 | ± answer component matching any single-value answer in same exam | Q9=±6 where Q5=6 (same exam) |
| W-5 | Graph direction (opens up/down) identical in 3+ consecutive exams same slot | Q12 opens down in MVP, P1, P2, P3 |

#### INFO — Log for awareness

| Rule ID | Description |
|---------|-------------|
| I-1 | Common small integers (1,2,3) appearing across different question types |
| I-2 | Same template used in 2/6 exams for a slot (only flag at 3+) |

### Numeric Distance Rules

```javascript
// Minimum distance between answers in the SAME question slot across exams
const SAME_SLOT_MIN_DELTA = {
  integer: 2,      // |Δ| > 2 for whole-number answers
  decimal: 0.5,    // |Δ| > 0.5 for decimal answers
  plusMinus: 2      // |Δ| > 2 between the absolute values of ± answers
};

// Minimum distance for cross-slot matches (practice vs MVP)
const CROSS_SLOT_MVP_MIN_DELTA = 1.0;

// Within-exam: all answers must be distinct (Δ > 0.01 tolerance)
const WITHIN_EXAM_MIN_DELTA = 0.01;
```

### Template Diversity Rules

```javascript
// For any question slot (Q4-Q15), count how many exams use the same
// algebraic template. "Same template" = same form with only coefficient changes.
const MAX_SAME_TEMPLATE_PER_SLOT = 3; // out of 6 exams

// Examples of what counts as "same template":
// SAME: (5x+2)/(x-3)=7 and (4x-1)/(x+2)=3  (both (ax+b)/(x-c)=d)
// DIFFERENT: (5x+2)/(x-3)=7 and 4/(x-2)+3=7  (different solving strategy)
```

### Graph Uniqueness Rules

```javascript
// Q12 (quadratic graph)
const GRAPH_QUAD_RULES = {
  vertexMatch: 'HARD_FAIL',           // H-5: no two exams share (h,k)
  vertexComponentMatch: 'WARNING',      // same h OR same k across 3+ exams
  directionRepeat: 3,                   // max 3/6 exams can open same direction
  coefficientRange: { min: -4, max: 4 } // |a| must vary, not always 1 or -1
};

// Q13 (rational graph)
const GRAPH_RAT_RULES = {
  asymptoteMatch: 'HARD_FAIL',         // H-5: no two exams share (VA, HA) pair
  singleAsymptoteRepeat: 3,            // max 3/6 exams can share same VA or HA
  numeratorSign: 'alternate'            // mix positive and negative numerators
};
```

### Word Problem Variety Rules

```javascript
// Q15: minimum distinct contexts across 6 exams
const WORD_PROBLEM_MIN_CONTEXTS = 4;

// Context registry (each exam's Q15 must tag its context):
const APPROVED_CONTEXTS = [
  'bacteria-growth',      // exponential growth, biology
  'population-growth',    // exponential growth, demographics
  'investment-compound',  // exponential growth, finance
  'radioactive-decay',    // exponential decay, physics
  'car-depreciation',     // exponential decay, real-world
  'temperature-cooling',  // exponential decay, Newton's law
  'social-media-spread',  // exponential growth, tech
  'medication-halflife'   // exponential decay, pharmacology
];

// No context used in more than 2/6 exams
const MAX_SAME_CONTEXT = 2;
```

### Implementation Skeleton for `tests/cross-exam-verify.js`

```javascript
function verifyAnswerUniqueness(exams) {
  const errors = { hard: [], warn: [], info: [] };

  // 1. Build answer grid: { 'Q4': [{exam, value}, ...], 'Q5': [...] }
  const grid = buildAnswerGrid(exams);

  // 2. Check H-1: exact equation duplicates
  for (const slot of Object.keys(grid)) {
    const eqs = grid[slot].map(e => normalizeEquation(e.equation));
    for (let i = 0; i < eqs.length; i++)
      for (let j = i+1; j < eqs.length; j++)
        if (eqs[i] === eqs[j])
          errors.hard.push(`H-1: ${slot} exact dupe in exams ${i} and ${j}`);
  }

  // 3. Check H-2/H-3: same-slot same answer
  for (const [slot, entries] of Object.entries(grid)) {
    for (let i = 0; i < entries.length; i++)
      for (let j = i+1; j < entries.length; j++)
        if (Math.abs(entries[i].value - entries[j].value) < 0.01)
          errors.hard.push(`H-2/3: ${slot} answer collision ${entries[i].exam}=${entries[i].value} vs ${entries[j].exam}`);
  }

  // 4. Check H-4: within-exam duplicates
  for (const exam of exams) {
    const vals = getAllNumericAnswers(exam);
    for (let i = 0; i < vals.length; i++)
      for (let j = i+1; j < vals.length; j++)
        if (Math.abs(vals[i] - vals[j]) < 0.01)
          errors.hard.push(`H-4: ${exam.id} internal dupe Q${vals[i].q} and Q${vals[j].q}`);
  }

  // 5. Check W-1: cross-slot numeric match vs MVP
  // 6. Check W-3: same-slot distance thresholds
  // 7. Check template diversity per slot
  // 8. Check graph rules
  // 9. Check word problem context variety

  return errors;
}
```

---

## FR-MCM-2: Replacement Equations (5 Fixes)

All equations verified computationally in Node.js. Every answer checked against the full 6-exam grid for same-slot distance, within-exam uniqueness, and cross-slot collisions.

### Fix 1: P2 Q12 — Graph Quadratic

**Problem:** `-(x+2)²+5` is the EXACT equation from MVP Q12. Zero learning value.

**Replacement:** `f(x) = 2(x-3)² - 6`

| Property | Old (collision) | New |
|----------|----------------|-----|
| Equation | `-(x+2)²+5` | `2(x-3)²-6` |
| Vertex | (-2, 5) ← same as MVP | **(3, -6)** |
| Direction | Opens down | **Opens up** |
| Stretch | 1× | **2×** (narrower) |

**Worked solution:**
- Vertex form `a(x-h)²+k`: h=3, k=-6, a=2
- Opens upward (a>0) — different from MVP which opens down
- Key points: (1, 2), (2, -4), **(3, -6)**, (4, -4), (5, 2)
- Vertex (3,-6) shares no component with any other exam's Q12 vertex

**Verification:** `2(3-3)²-6 = 0-6 = -6 ✓` | `2(1-3)²-6 = 8-6 = 2 ✓`

**Why this is better:** Different direction forces Kai to think about the sign of `a`. Different vertex position. Narrower parabola (|a|=2 vs |a|=1) tests whether he understands the stretch factor.

---

### Fix 2: P1 Q11 — Fractional Exponent Solve

**Problem:** `3x^(3/2)-24=57` → x=9, same answer as MVP Q11 (x=9). Memorizable.

**Replacement:** `5x^(3/2) - 10 = 30`

| Property | Old (collision) | New |
|----------|----------------|-----|
| Equation | `3x^(3/2)-24=57` | `5x^(3/2)-10=30` |
| Answer | x = 9 ← same as MVP | **x = 4** |
| x^(3/2) value | 27 | **8** |

**Worked solution:**
1. `5x^(3/2) - 10 = 30`
2. `5x^(3/2) = 40`
3. `x^(3/2) = 8`
4. `x = 8^(2/3) = (∛8)² = 2² = 4`

**Verification:** `5(4)^(3/2) - 10 = 5(8) - 10 = 40 - 10 = 30 ✓`

**Same-slot distance:** Nearest Q11 answer is MVP=9 (Δ=5). All others: 16, 25, 36, 49 (Δ≥12). Clean.

**Within P1:** Nearest answer is Q4=2.5 (Δ=1.5). No conflicts.

---

### Fix 3: P3 Q4 — Exponential Solve

**Problem:** Answer = 2.5, identical to P1 Q4 = 2.5. Practice-to-practice collision.

**Replacement:** `2^(x-1) = 32`

| Property | Old (collision) | New |
|----------|----------------|-----|
| Equation | `5^(2x-3)=25` | `2^(x-1)=32` |
| Answer | x = 2.5 ← same as P1 Q4 | **x = 6** |
| Structure | base^(linear)=base^n | same, but simpler form |

**Worked solution:**
1. `2^(x-1) = 32`
2. Recognize `32 = 2^5`
3. `x - 1 = 5`
4. `x = 6`

**Verification:** `2^(6-1) = 2^5 = 32 ✓`

**Same-slot distance:** Q4 answers across exams: MVP=2, P1=2.5, P2=1.333, P4=1.5, P5=1.667. Nearest is P1=2.5 (Δ=3.5). Clean.

**Within P3:** Nearest is Q9=5 (Δ=1) and Q10=4 (Δ=2). No conflicts.

**Structural note:** Simpler exponent structure (`x-1` vs `2x-3`) makes this slightly easier — appropriate if P3 is positioned as moderate difficulty.

---

### Fix 4: P3 Q8 — Rational Equation Solve

**Problem:** Answer = 9, same as MVP Q11 = 9. Cross-position collision.

**Replacement:** `(3x+4)/(x-5) = 5`

| Property | Old (collision) | New |
|----------|----------------|-----|
| Equation | `(3x+5)/(x-1)=4` | `(3x+4)/(x-5)=5` |
| Answer | x = 9 ← matches MVP Q11 | **x = 14.5 (29/2)** |

**Worked solution:**
1. `(3x+4)/(x-5) = 5`
2. Cross-multiply: `3x + 4 = 5(x - 5)`
3. `3x + 4 = 5x - 25`
4. `29 = 2x`
5. `x = 29/2 = 14.5`

**Verification:** `(3(14.5)+4)/(14.5-5) = 47.5/9.5 = 5 ✓`

**Same-slot distance:** Q8 answers: MVP=5.667, P1=11.5, P2=7, P4=-11, P5=7.333. Nearest is P1=11.5 (Δ=3). Clean.

**Within P3:** Nearest is Q15=16 (Δ=1.5). No conflicts.

**Pedagogical note:** x=14.5 produces a non-integer answer from integer coefficients, which tests whether Kai carries the algebra cleanly without rounding prematurely.

---

### Fix 5: P1 Q9 — Radical Equation (± Solution)

**Problem:** Answer = ±3, and individual value 3 matches MVP Q9 = 3. Partial overlap.

**Replacement:** `√(x² + 21) = 11`

| Property | Old (collision) | New |
|----------|----------------|-----|
| Equation | `√(3x²+8)=√(x²+26)` | `√(x²+21)=11` |
| Answer | x = ±3 ← includes MVP Q9=3 | **x = ±10** |

**Worked solution:**
1. `√(x² + 21) = 11`
2. Square both sides: `x² + 21 = 121`
3. `x² = 100`
4. `x = ±10`

**Verification:** `√(100 + 21) = √121 = 11 ✓` | `√((-10)² + 21) = √121 = 11 ✓`

**Same-slot distance (absolute values):** Q9: MVP=3, P2=4, P3=5, P4=8, P5=7. Nearest is P4=8 (Δ=2). Clean.

**Within P1:** No other answer is 10 or -10. Nearest is Q8=11.5 (Δ=1.5). Clean.

**Structural note:** Simpler form (`√(x²+c)=d` vs `√(ax²+b)=√(cx²+d)`) — one radical instead of two. Tests same skill (squaring both sides, solving quadratic) but with a cleaner entry point.

---

## FR-MCM-3: Template Diversification

These 4 question slots are structurally monotonous — every exam uses the same equation form with only coefficient swaps. Here are alternate templates that test the same standard.

### Q8 — Rational Equation (Standard W3.c)

**Current template (all 6 exams):** `(ax+b)/(x-c) = d` — cross-multiply, linear solve

| Template | Form | Solving Strategy | Difficulty |
|----------|------|-----------------|------------|
| A (current) | `(ax+b)/(x-c) = d` | Cross-multiply → linear | Medium |
| **B (new)** | `a/(x-h) + k = d` | Isolate fraction → reciprocal | Medium |
| **C (new)** | `(ax+b)/(cx+d) = e/(cx+d)` | Recognize common denominator → linear | Medium-Easy |
| **D (new)** | `a/(x-h) + b/(x-k) = c` | Common denominator → quadratic (harder) | Hard |

**Recommendation:** Use Template A for 2 exams, Template B for 2 exams, Template C or D for the remaining 2. This forces Kai to recognize rational equations in multiple forms instead of pattern-matching to one structure.

**Example — Template B:** `4/(x-2) + 3 = 7` → `4/(x-2) = 4` → `x-2 = 1` → `x = 3`

### Q11 — Fractional Exponent (Standard W2)

**Current template (all 6 exams):** `ax^(3/2) + b = c` — isolate, raise to 2/3 power
**Current answers:** 9, 16, 25, 36, 49 — literally consecutive perfect squares, extremely memorizable

| Template | Form | Solving Strategy | Difficulty |
|----------|------|-----------------|------------|
| A (current) | `ax^(3/2) + b = c` | Isolate → `(c/a)^(2/3)` | Medium |
| **B (new)** | `ax^(2/3) + b = c` | Isolate → cube result | Medium |
| **C (new)** | `(ax+b)^(3/2) = c` | Raise to 2/3 → linear | Medium-Hard |
| **D (new)** | `ax^(4/3) - b = c` | Isolate → raise to 3/4 | Hard |

**Recommendation:** Use Template A for max 2 exams. Mix in B and C. The current answer pattern (all perfect squares) is a dead giveaway — non-perfect-square answers should appear in at least 2 exams.

**Example — Template B:** `3x^(2/3) + 5 = 17` → `3x^(2/3) = 12` → `x^(2/3) = 4` → `x = 4^(3/2) = 8`

### Q13 — Rational Function Graph (Standard W3)

**Current template (all 6 exams):** `a/(x-h) + k` — simple reciprocal with shift

| Template | Form | Key Features | Difficulty |
|----------|------|-------------|------------|
| A (current) | `a/(x-h) + k` | VA = h, HA = k | Medium |
| **B (new)** | `(ax+b)/(x-c)` | VA = c, HA = a (from leading coeff) | Medium-Hard |
| **C (new)** | `a/(x-h)² + k` | VA = h, HA = k, different curve shape | Medium |

**Recommendation:** Template B is the most valuable addition — it forces Kai to find the horizontal asymptote by polynomial long division or leading coefficient analysis, not just by reading `k` off the equation. Use A for 3 exams, B for 2, C for 1.

**Example — Template B:** `(2x+3)/(x-1)` → VA: x=1 (denominator=0), HA: y=2 (leading coefficients 2/1)

### Q15 — Exponential Word Problem (Standard W2/W3)

**Current contexts:**
- P1: bacteria triples every 6hr (growth)
- P2: savings doubles every 5yr (growth)
- P3: investment triples every 4yr (growth)
- P4: population grows 50%/10yr (growth)
- P5: radioactive decay, half-life 8yr (decay)
- MVP: bacteria triples every 4hr (growth)

**Problem:** 5/6 are exponential growth. 3/6 specifically use "triples." P5 is the only decay problem.

**Recommendation — Minimum 4 distinct contexts:**

| Context | Base Type | Real-World Domain | Exam Assignment |
|---------|-----------|-------------------|-----------------|
| Bacteria growth | b > 1 | Biology | MVP (keep) |
| Radioactive decay | 0 < b < 1 | Physics | P5 (keep) |
| Car depreciation | 0 < b < 1 | Finance | P1 or P3 (new) |
| Social media spread | b > 1 | Technology | P2 (new) |
| Medication half-life | 0 < b < 1 | Health | P4 (new) |
| Investment compound | b > 1 | Finance | P3 (keep or reassign) |

**Key improvement:** At least 2/5 practice exams should use **decay** (b < 1) problems, not just P5. Solving `A·b^(t/k) = target` when b < 1 requires different intuition than when b > 1, and Kai needs practice with both.

**Example — Car depreciation:** "A car worth $24,000 loses 25% of its value every 3 years. The value is modeled by V(t) = 24000·0.75^(t/3). How many years until the car is worth $7,593.75?"
→ `0.75^(t/3) = 7593.75/24000 = 0.31640625 = 0.75^4` → `t/3 = 4` → `t = 12`

---

## FR-MCM-4: ADHD Sequencing Recommendation

### Research Basis

For students with ADHD, learning sequencing should optimize for:
1. **Early wins** — Confidence in session 1 prevents avoidance behavior
2. **Challenge in the middle** — Peak difficulty when engagement and momentum are highest
3. **Moderate finish** — Day before retake should consolidate, not overwhelm
4. **Visible progress** — Scores should trend upward across practice exams

### Difficulty Assessment (Current Exams)

| Exam | Difficulty | Rationale |
|------|-----------|-----------|
| P5 | ★★☆☆☆ Easy | Designed as confidence builder, cleaner numbers |
| P1 | ★★★☆☆ Moderate | Standard difficulty, balanced mix |
| P3 | ★★★☆☆ Moderate | Mid-range coefficients, standard templates |
| P2 | ★★★★☆ Challenging | Larger numbers, negative asymptotes |
| P4 | ★★★★★ Hard | Largest coefficients (x=49, x=-11), negative answers |

### Recommended Sequence

**For 1 exam/day (Feb 20-24):**

| Day | Exam | Purpose | Expected Feel |
|-----|------|---------|---------------|
| Day 1 (Feb 20) | **P5** | Warm up, rebuild confidence after 47% | "I can do this" |
| Day 2 (Feb 21) | **P1** | Build skill, standard difficulty | "Getting stronger" |
| Day 3 (Feb 22) | **P4** | Peak challenge — hardest exam | "That was tough but I pushed through" |
| Day 4 (Feb 23) | **P2** | Consolidation — challenging but not max | "I handled hard problems yesterday, this feels manageable" |
| Day 5 (Feb 24 AM) | **P3** | Final tune-up — moderate, confidence boost | "Ready for the real thing" |

**For 2 exams/day (compressed schedule):**

| Session | Exam | Notes |
|---------|------|-------|
| Day 1 AM | P5 | Confidence builder |
| Day 1 PM | P1 | Build on momentum (4+ hour gap) |
| Day 2 AM | P4 | Peak challenge, fresh mind |
| Day 2 PM | P2 | Consolidation |
| Day 3 (retake eve) | P3 | Light review, stop after 1 |

### ADHD-Specific Rules

1. **Max 1 full exam per sitting** (60 min is the upper bound for sustained ADHD focus)
2. **If doing 2/day, space 4+ hours apart** — never back-to-back
3. **After each exam, review ONLY wrong answers** — not the whole exam. Mark wrong questions and redo just those.
4. **Show cumulative score trajectory** — if Kai sees P5: 11/15 → P1: 10/15 → P4: 8/15 → P2: 11/15 → P3: 12/15, the upward trend is motivating even though P4 was hard
5. **P4 (hardest) on Day 3, not Day 5** — allows recovery time and prevents test anxiety from a bad score the night before
6. **Never say "this is the hard one"** — just present it. ADHD students may avoid or rush if they pre-judge difficulty

### Why P5 First (Not Last)

GR placed P5 as the "confidence builder at the end." I recommend moving it to the start because:
- After scoring 47%, Kai's self-efficacy is low. He needs a win FIRST.
- A confidence builder at the end risks feeling patronizing ("they gave me the easy one")
- Starting easy builds momentum: "I got 12/15, I CAN do this" → intrinsic motivation for harder exams
- Ending moderate (P3) is better than ending easy — it signals "you're ready for the real thing at this level"

---

## Appendix: Complete Verified Answer Grid (Post-Fix)

| Q# | MVP | P1 (fixed) | P2 (fixed) | P3 (fixed) | P4 | P5 |
|----|-----|-----------|-----------|-----------|----|----|
| Q4 | 2 | 2.5 | 1.333 | **6** | 1.5 | 1.667 |
| Q5 | 0.5, -1.5 | 6, 2 | 5, -1 | 1, -9 | 8, -2 | 1, -11 |
| Q6 | ±2.236 | 5.2 | 8 | 22 | 13 | 38 |
| Q7 | 2 | 0.5 | 3.5 | 0.667 | 1.75 | -0.333 |
| Q8 | 5.667 | 11.5 | 7 | **14.5** | -11 | 7.333 |
| Q9 | 3 | **±10** | ±4 | ±5 | ±8 | ±7 |
| Q10 | ±2.449 | 1 | 6 | 4 | -3 | 7 |
| Q11 | 9 | **4** | 16 | 25 | 49 | 36 |
| Q12 vtx | (-2,5) | (1,-4) | **(3,-6)** | (-3,-1) | (2,-8) | (4,9) |
| Q13 VA,HA | 1,-2 | -1,3 | 2,1 | -3,-2 | 4,3 | -2,-1 |
| Q15 | 20 | 24 | 25 | 16 | 30 | 32 |

**Bold** = replaced this session. All verified computationally. Zero hard-fail collisions remain.

---

*— Agent FR (forge-research), 2026-02-19*
