# Exam Authoring Guide — For GR

How to write a new retake practice exam for Motor City Math.

## Before You Start

1. Check `docs/agents/gp-standards-coverage-report.md` for which standards are under-represented
2. Review `docs/retake-exam-spec.md` for required field list
3. Message GP inbox if you need the current baseline answer distribution

## File Naming

```
data/retake-practice-N.json
```

Where N is the next sequential number (currently: 12 for the next exam).

## Required Top-Level Structure

```json
{
  "exam_id": "retake-practice-N",
  "schema_version": "2.0",
  "version": "1.0",
  "title": "Unit 2 Retake Practice N",
  "questions": [...]
}
```

## Writing Questions

### Numeric Question Template

```json
{
  "id": "Q1",
  "type": "numeric",
  "standard": "W2.a",
  "prompt": "Solve: x² + 5x + 6 = 0. Find the smaller root.",
  "answer": -3,
  "tolerance": 0.01,
  "hint": "Factor the quadratic. Find two numbers that multiply to 6 and add to 5.",
  "feedback_correct": "Yes. -3 is the smaller root.",
  "feedback_incorrect": "Check your factoring. What multiplies to 6, adds to 5?",
  "solution_steps": [
    "Factor: (x + 2)(x + 3) = 0",
    "Set each factor to zero: x + 2 = 0 or x + 3 = 0",
    "Solve: x = -2 or x = -3",
    "Smaller root: x = -3"
  ]
}
```

### Optional Fields

```json
{
  "explanation": "This question tests ability to identify the parent function from vertex form. The key insight is recognizing that adding 4 inside the radical shifts the graph left (not right).",
  "feedback_wrong_parent": "Parent function is wrong. Look at the base operation — is it a square root, absolute value, or quadratic?",
  "feedback_wrong_intercepts": "Parent is correct! Now focus on where the graph crosses the x-axis (y = 0).",
  "plus_minus": true
}
```

- `explanation` (string): Detailed explanation for the parent/teacher view. Not shown to Kai. Used for review and tutoring context. No length limit.
- `feedback_wrong_parent` (string): Specific feedback when the parent function input is wrong but intercepts may be correct. ≤ 12 words.
- `feedback_wrong_intercepts` (string): Specific feedback when the parent is correct but intercepts are wrong. ≤ 12 words.
- `plus_minus` (boolean): When true, accepts either ordering of two numeric answers (e.g., x-intercepts where order doesn't matter).



- `hint`: ≤ 20 words. One action. No em dashes.
- `feedback_correct`: ≤ 12 words. Celebratory, brief.
- `feedback_incorrect`: ≤ 12 words. Points forward.

## Uniqueness Rules

Check your answers against:
1. Other questions in the same exam (no repeats)
2. Other exams (no answer appearing > 3 times total)

GP will verify this — but catching it early saves a revision cycle.

## Math Verification Checklist

Before filing the exam to GP:

- [ ] Every `answer` value hand-computed (not just "feels right")
- [ ] Every `solution_steps` sequence checked step-by-step
- [ ] `tolerance` values set: 0.01 for exact answers, 0.5+ for large computed values
- [ ] Standard codes verified against official Winter Tri list

## Submitting to GP

1. Drop file in working tree: `data/retake-practice-N.json`
2. Send inbox message to GP: `"RP-N ready for verify"`
3. GP runs: `node tests/verify-practice-exams.js` + `node tests/cross-exam-verify.js`
4. GP reports back: pass → commits; fail → returns error list

## Common Mistakes

| Mistake | How to Avoid |
|---------|-------------|
| Duplicate answer within exam | Check: no two `answer` values are identical |
| Tolerance too tight | Use tolerance ≥ 0.5 for answers > 10 |
| Hint too long | Count words: 20 max |
| Em dash in feedback | Use colon or period instead |
| Wrong standard code | Double-check against standards list |

---

*Owner: GP (doc) + GR (content) | Reference: docs/retake-exam-spec.md*
