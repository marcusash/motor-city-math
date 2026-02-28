# GI RP12 Data Spec

Specification for `retake-practice-12.json`. Target audience: GR.

**Context:** RP11 closed the W2.d gap (vertex-form quadratic). All 10 standards are at threshold (5+). RP12 can focus on W3.e (extraneous solutions) which is currently at 6 slots across 6 exams — barely above threshold. More W3.e practice will deepen Kai's mastery of this harder concept.

---

## Target Coverage Gap

| Standard | Current count | Target after RP12 |
|----------|--------------|-------------------|
| W3.e | 6 | 7+ |
| W2.a | 8 | 9+ (currently weakest by volume) |
| W3.b | 34 | hold — well covered |
| W2.d | 5 | hold — threshold just met |

**Priority:** W3.e (extraneous solutions — harder concept, lower count). Secondary: W2.a.

---

## Q14 Suggestion (W3.e — Extraneous Solutions)

**Standard:** W3.e — Identify and reject extraneous solutions in radical/rational equations.

**Suggested question type:** Radical equation (square root).

**Question stem (example):**
> Solve for x: √(3x + 4) = x − 2. One solution is extraneous. Which value of x is the actual solution?

**Approach:**
1. Square both sides: 3x + 4 = (x−2)² = x² − 4x + 4
2. Rearrange: x² − 7x = 0 → x(x−7) = 0 → x = 0 or x = 7
3. Check x=0: √4 = −2 → 2 ≠ −2. Extraneous!
4. Check x=7: √25 = 5. ✓

**Answer:** x = 7. Extraneous: x = 0.

**Input spec:**
```json
{ "id": "q14a", "label": "x =", "type": "number", "answer": 7, "tolerance": 0.01 }
```

**Free answer values for W3.e slot:**
W3.e currently uses: -3, 1, 3, 4, 6, 11
Safe values: 7, 8, 2, 5, 10, 12, 15 are free for this standard in Q14.

---

## Standard Distribution Target

| Section | Questions | Standards |
|---------|-----------|-----------|
| A (Identify) | Q1-Q3 | W2.b, W2.b, W2.b |
| B (Solve) | Q4-Q11 | Mix of W3.a, W3.b, W3.c, W3.d, W3.e |
| C (Graph) | Q12-Q13 | W2.c or W3.a (graphing) |
| D (Apply) | Q14-Q15 | W3.e, W2.a |

---

## Answer Uniqueness Requirements

Before choosing final answer values, run:
```bash
node scripts/gi-answer-space-density.cjs
node scripts/gi-near-collision-detector.cjs
```

W3.e slot Q14 safe values: 7, 8, 12, 15 (none currently used in Q14 across RP1-11).

---

## Required Schema Fields

```json
{
  "exam_id": "rp12",
  "title": "Retake Practice 12",
  "version": 2,
  "schema_version": "1.0",
  "questions": [ /* 15 questions */ ]
}
```

Each question needs: `number`, `standard`, `section`, `type`, `question_html`, `hint`, `solution_steps` (3+), `inputs`, `feedback_correct`, `feedback_wrong`.

---

## CI Gate Requirements

Before sending green-light to GP:
1. `node scripts/ci-data-gate.cjs --exam rp12` → 0 errors
2. `node tests/cross-exam-verify.js` → 0 hard failures
3. `node scripts/concept-coverage.cjs` → W3.e at 7+
4. `node scripts/gi-healthcheck.cjs` → all PASS

---

*Spec authored by GI | 2026-02-23*
