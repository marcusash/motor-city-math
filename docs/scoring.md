# Scoring — How Motor City Math Grades Answers

## Numeric Questions

```
|student_answer - correct_answer| ≤ tolerance → CORRECT
```

Default tolerance: specified per-question in JSON. Recommended: ≥ 0.5 for answers > 10.

Handles:
- Dollar signs and commas stripped before parseFloat (known grading edge case)
- Leading/trailing whitespace trimmed

## Multiple-Choice Questions

Exact match on `correct_choice` index. No tolerance.

## Short-Answer Questions

Case-insensitive, trims whitespace. Some questions use 4-char prefix match (known false-positive risk flagged in `tests/f-validation/grading-audit.test.js`).

## Score Display

- `score`: integer, questions answered correctly
- `total`: integer, total questions in exam
- Display: `X / Y` format

## Per-Standard Breakdown

After exam complete, questions grouped by `standard` field. Shows:
- Which standards Kai mastered (all correct)
- Which standards need work (any wrong)

Used by Marcus to select next practice exam.

## Dad Dashboard

`index.html?dad=1` or `exam.html?dad=1` reads localStorage:
- Shows all saved scores across all exams
- Sorted by date, most recent first
- Password-protected answer key overlay: `121274`

## Known Issues

- Dollar signs in student input break `parseFloat` (GA backlog)
- 4-char prefix match on keyword answers causes false positives (GA backlog)

---

*Owner: GA (implementation) | GP (verification tests) | Last updated: 2026-02-23*
