# Retake Exam Canonical Spec

**Owner:** GP (enforces) + GR (authors)  
**Last updated:** 2026-02-23

What every `data/retake-practice-N.json` must contain before GP will approve it for commit.

## Required Top-Level Fields

```json
{
  "title": "Retake Practice N",
  "schema_version": "2.0",
  "version": "1.0",
  "questions": [...]
}
```

## Question Count

- **Minimum:** 10 questions
- **Target:** 15 questions
- **Maximum:** 20 questions (browser scroll concern)

## Standard Distribution

Per exam, across all 15 questions:

| Standard Group | Min Questions | Max Questions |
|---------------|--------------|--------------|
| W1 (linear systems) | 2 | 4 |
| W2 (quadratic) | 5 | 8 |
| W3 (radical/rational/AV/exp) | 4 | 7 |

Consult `docs/agents/gp-standards-coverage-report.md` for current distribution gaps.

## Uniqueness Rules

1. No two questions in the same exam may have the same numeric answer.
2. No answer may appear more than 3× across all exams (cross-exam dedup).
3. Multiple-choice questions exempt from cross-exam dedup (wrong answers vary).

Verified by: `node tests/verify-practice-exams.js` and `node tests/cross-exam-verify.js`

## Required Question Fields

Every question must have:
- `id`, `type`, `standard`, `prompt`, `answer`
- `hint`, `feedback_correct`, `feedback_incorrect`
- For numeric: `tolerance`
- For multiple-choice: `choices`, `correct_choice`

See `docs/agents/gp-field-glossary.md` for full definitions.

## ADHD Rules (enforced by test)

- `feedback_correct`: ≤ 12 words
- `feedback_incorrect`: ≤ 12 words
- `hint`: ≤ 20 words
- No em dashes in any string field

## Verification Sequence

Before committing a new RP file, run in order:

```
node tests/verify-practice-exams.js retake-practice-N.json
node tests/cross-exam-verify.js
node scripts/gp-exam-health.js
```

All must pass before GA can integrate.

---

*Reference: gp-field-glossary.md, gp-exam-lifecycle.md*
