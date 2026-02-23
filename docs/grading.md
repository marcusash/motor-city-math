# Motor City Math — Grading System

**Owner:** GA (app engineer)
**Last updated:** 2026-02-24

---

## Overview

Motor City Math uses two grading systems:

1. **exam.html grading** — JSON-driven, per-input, per-question, supports numeric, radio, dropdown
2. **shared/scripts.js grading** — Used by legacy HTML files (nonlinear_exam_mvp.html, final exams)

All new exams use `exam.html`.

---

## Grade Scale (SAAS — School-Aligned Academic Scale)

| Grade | Percentage | Meaning |
|-------|-----------|---------|
| 4 | >= 92% | Mastery — Kai is ready for the real retake |
| 3 | >= 82% | Proficient — close, one more run |
| 2 | >= 70% | Developing — review hints, retry |
| 1 | < 70% | Beginning — study more, try again |

**Critical:** Both `showScorecard()` and `saveResults()` in exam.html must use identical thresholds. Verified by `tests/f-validation/exam-hint-scorecard.test.js` (101-point exhaustive coverage).

---

## exam.html Grading Flow

```
gradeExam()
    ├─ Validate all required inputs (missing inputs block submit with error list)
    ├─ For each question:
    │   ├─ checkGraphAnswer(canvasId) → result if graph question
    │   ├─ For each input:
    │   │   ├─ type=number: parseStudentAnswer() → Math.abs(val - answer) <= tolerance
    │   │   ├─ type=radio: exact string match on selected value
    │   │   ├─ type=dropdown: exact string match on selected value
    │   │   └─ plus_minus: accept either ordering of two number inputs
    │   └─ question correct = ALL inputs correct
    ├─ Compute per-standard scores (stdScores)
    ├─ Call showScorecard(score, total, stdScores, results)
    └─ Call saveResults(score, total, results, stdScores)
```

---

## Numeric Grading

`parseStudentAnswer(raw)` accepts:
- **Integers:** `4`, `-3`
- **Decimals:** `3.14`, `-0.5`
- **Fractions:** `4/3`, `-5/2`
- **Sqrt expressions:** `sqrt(2)`, `1+sqrt(3)`, `(1+sqrt(5))/2`

Dollar signs (`$`) and commas (`,`) are stripped before parsing.

Tolerance is per-input. Common values:
- `0.01` — exact integer/decimal answers
- `0.5` — large computed values (scores, prices)
- `0.3` — graph plot points

---

## Graph Grading

`checkGraphAnswer(canvasId)` evaluates:
1. **Points:** Each student-plotted point must satisfy `|f(x) - y| <= tolerance`
2. **Asymptotes:** Vertical/horizontal asymptotes checked against expected values (first asymptote of each type)
3. **Minimum points:** Student must place at least `graph.min_points` correct points

Returns: `{ correct: number, total: number, asymptoteCorrect: boolean }`

---

## Hint System (3-Layer Progressive Disclosure)

| Layer | Trigger | Content |
|-------|---------|---------|
| L1 | User clicks HINT | `q.hint` (strategy hint) |
| L2 | User clicks SHOW ANSWER | Correct answer values |
| L3 | User clicks SOLUTION STEPS | `q.solution_steps` (worked example) |
| AUTO | 3rd wrong attempt | All layers revealed immediately |

Auto-rescue (3rd wrong attempt) uses `triggerRescue()`. Terminal state per question — cannot un-rescue.

---

## Post-Exam CTA Copy

Score determines reload CTA (practice exams only):

| Score | CTA |
|-------|-----|
| >= 92% | "Defend Your Score" |
| 80-91% | "One More Run" |
| < 80% | "Run It Back" |

Real exams: single "See the Board" CTA (score locked after first submission).

---

## Test Coverage

| Test File | Coverage |
|-----------|---------|
| `exam-grading-unit.test.js` | Numeric, tolerance, comma/dollar strip, MC, pct/grade — 33/33 |
| `exam-save-results.test.js` | saveResults shape, best tracking, lock behavior, null examId — 24/24 |
| `exam-hint-scorecard.test.js` | Grade thresholds 92/82/70, coach copy, hint layer IDs, exhaustive — 125/125 |
