# RP11 Data Spec — GI to GR

**Date:** 2026-02-23
**From:** GI
**To:** GR
**Priority:** Normal

---

## Purpose

RP11 needs one W2.d question to bring the standard from 4 to 5 slots (threshold).
All other standards are at or above threshold. This is the only coverage gap.

---

## W2.d Current Inventory (4 slots)

| Exam | Question | Type | Answers Used |
|------|----------|------|-------------|
| RP7 | rp7-q14 | multiple-choice | -1, 1, 9 |
| RP8 | rp8-q14 | write-equation | 1, -2, 1 |
| RP9 | rp9-q14 | write-equation | 5, 2 |
| RP10 | rp10-q14 | write-equation | -1, 10, 20 |

---

## W2.d Description

**Standard:** Identify and interpret key features of a graph — including roots (x-intercepts), vertex,
axis of symmetry, minimum/maximum, domain/range, and end behavior.

---

## RP11 Q14 Requirements

1. **Section D** (error analysis or word-problem section) or **Section A** (identify type) — either is fine
2. **Type:** `write-equation` or `error-analysis` (not `multiple-choice` — RP7 used it already)
3. **Answer must be unique across all exams:**
   - Do NOT use: -1, 1, 9, -2, 5, 2, 10, 20 (all used in W2.d slots above)
   - Free values: 3, 4, 6, 7, 8, 11, 12, 15, 16, 24 (none in any W2.d slot)
4. **Question idea:** Ask Kai to identify vertex, axis of symmetry, and roots of a quadratic in vertex form `f(x) = a(x-h)² + k`. This tests interpretation of key features without graphing.

---

## Suggested Question Template

```
Given f(x) = 2(x - 3)² - 8:

(a) State the vertex: (h, k)
(b) Identify the axis of symmetry: x = ?
(c) Find the x-intercepts (roots)
```

**Answers:**
- Vertex: (3, -8) — h=3, k=-8
- Axis of symmetry: x = 3
- Roots: 2(x-3)² = 8 → (x-3)² = 4 → x = 5 or x = 1

**Answer values:** 3, -8, 5, 1 — all free (not used in any W2.d slot)

---

## Schema Checklist for RP11

- [ ] `schema_version: "1.0"` (required — migration script handles this)
- [ ] `exam_id: "retake-practice-11"`
- [ ] All inputs have `answer` and `tolerance` for numeric, or exact `answer` for text/dropdown
- [ ] `feedback_correct` ≤ 12 words (ADHD rule)
- [ ] `feedback_wrong` ≤ 15 words
- [ ] Cross-exam uniqueness: run `node tests/cross-exam-verify.js` before submitting
- [ ] `node scripts/ci-data-gate.cjs --exam retake-practice-11` must pass

---

## When Ready

1. Add `data/retake-practice-11.json`
2. Add `retake-practice-11` to `scripts/validate-exam-schema.cjs` file list
3. Run `node scripts/ci-data-gate.cjs` — must exit 0
4. GI will auto-detect and verify via `concept-coverage.cjs` and `score-velocity.cjs`
