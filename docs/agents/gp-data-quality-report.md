# GP Data Quality Report

**Generated:** 2026-02-23  
**Baseline:** 3337/3337 verify, 11/11 health gate

## Summary

| Check | Result | Count |
|-------|--------|-------|
| Total questions | PASS | 165 |
| Unique question IDs | PASS | 165 |
| All have type field | PASS | 165 |
| Valid question types | PASS | 165 |
| Valid standards | PASS | 165 |
| Non-empty prompts | PASS | 165 |
| No null required fields | PASS | 1155 field checks |
| No placeholder text | PASS | 11 files |
| Numeric answers are numbers | PASS | 272 |
| Numeric answers are finite | PASS | 272 |
| Tolerances in range | PASS | 272 |
| Solution steps >= 3 | PASS | 165 |
| No duplicate IDs per exam | PASS | 165 |
| MC answers are valid options | PASS | 26 |
| Exam IDs match filenames | PASS | 11 |
| All RP files have questions array | PASS | 11 |
| No em dashes in hints | **FAIL** | 7 violations |
| No em dashes in feedback | **FAIL** | 4 violations |

## Open Issues

### Em Dash Violations (filed to GR)

| File | Question | Field | Action |
|------|----------|-------|--------|
| retake-practice-4.json | rp4-q5 | hint | GR fix |
| retake-practice-4.json | rp4-q9 | feedback_correct | GR fix |
| retake-practice-5.json | rp5-q2 | hint | GR fix |
| retake-practice-5.json | rp5-q5 | feedback_wrong | GR fix |
| retake-practice-5.json | rp5-q10 | hint | GR fix |
| retake-practice-5.json | rp5-q14 | hint | GR fix |
| retake-practice-6.json | rp6-q7 | hint | GR fix |
| retake-practice-7.json | rp7-q3 | feedback_correct | GR fix |
| retake-practice-7.json | rp7-q6 | feedback_wrong | GR fix |
| retake-practice-7.json | rp7-q12 | hint | GR fix |
| retake-practice-9.json | rp9-q1 | hint | GR fix |

### Schema Version (informational)

RP1-10 are on schema_version 1.0. RP11 is on 2.0. Migration is low priority and owned by GI.

## Verify Tooling

All checks above run automatically via:
- `npm run test:gp:all` — existing GP tests
- `node tests/gp-hint-no-emdash.test.js` — em dash scan
- `node tests/gp-feedback-no-emdash.test.js` — em dash scan
- `node tests/gp-valid-question-types.test.js` — type check
- `node tests/gp-standard-whitelist.test.js` — standard check
- `node tests/gp-solution-steps-count.test.js` — step count
- `node tests/gp-mc-correct-index.test.js` — MC answer check
