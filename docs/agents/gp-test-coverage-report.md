# GP Test Coverage Report

**Generated:** 2026-02-23  
**Total GP test files:** 29+

## Active Test Suite

### Core Exam Verification

| Test | Checks | Result |
|------|--------|--------|
| gp-field-completeness.test.js | 165 questions, all required fields | PASS |
| gp-answer-uniqueness.test.js | cross-exam answer dedup | PASS |
| gp-solution-steps.test.js | step format compliance | PASS |
| gp-feedback-length.test.js | feedback word count | PASS |
| gp-hint-length.test.js | hint word count | PASS |
| gp-manifest-integrity.test.js | manifest vs files match | PASS |
| gp-graph-keypoints.test.js | graph key point validity | PASS |
| gp-exam-id-consistency.test.js | exam_id matches filename | PASS |
| gp-answer-tolerance.test.js | tolerance format | PASS |
| gp-version-check.test.js | version field format | PASS |
| gp-input-label.test.js | input labels present | PASS |
| gp-json-parse.test.js | all JSON valid | PASS |
| gp-hint-presence.test.js | all questions have hints | PASS |
| gp-cdn-check.test.js | no banned CDN URLs | PASS |
| gp-commit-prefix.test.js | commit message format | PASS |
| gp-question-count.test.js | 15 questions per exam | PASS |
| gp-metadata-complete.test.js | exam metadata fields | PASS |
| gp-solution-steps-format.test.js | step format | 165/165 |

### Session 4 New Tests

| Test | Checks | Result |
|------|--------|--------|
| gp-hint-no-emdash.test.js | em dash in hints | 7 violations (filed to GR) |
| gp-feedback-no-emdash.test.js | em dash in feedback | 4 violations (filed to GR) |
| gp-prompt-nonempty.test.js | prompt/question_html present | 165/165 PASS |
| gp-no-placeholder-text.test.js | no TODO/FIXME | 0 violations |
| gp-no-duplicate-ids.test.js | unique IDs per exam | 165/165 PASS |
| gp-all-rp-schema-v2.test.js | schema version audit | informational |
| gp-questions-array.test.js | questions is array | 11/11 PASS |
| gp-no-null-fields.test.js | no null in required fields | 1155 PASS |
| gp-answer-not-string-for-numeric.test.js | number type answers | 272 PASS |
| gp-all-questions-have-type.test.js | type field present | 165/165 PASS |
| gp-numeric-answer-is-finite.test.js | no Inf/NaN answers | 272 PASS |
| gp-rp-file-has-questions-key.test.js | questions array exists | 11/11 PASS |
| gp-valid-question-types.test.js | type is known value | 165/165 PASS |
| gp-mc-correct-index.test.js | MC answer in options | 26/26 PASS |
| gp-scripts-exist.test.js | package.json script refs | 41/41 PASS |
| gp-standard-whitelist.test.js | standards are W2/W3 | 165/165 PASS |
| gp-tolerance-range.test.js | tolerance 0-0.5 | 272 PASS |
| gp-solution-steps-count.test.js | >= 3 steps per question | 165/165 PASS |
| gp-exam-id-format.test.js | exam_id matches pattern | 11/11 PASS |
| gp-hint-length-check.test.js | hints under 25 words | 165 PASS |
| gp-feedback-length-check.test.js | feedback under 15 words | 362 PASS |

## Coverage Gaps

Tests not yet implemented (in backlog):
- Duplicate answer values across exams (only cross-exam, not per-exam)
- Graph function evaluates without error
- Input IDs are unique within exam
- Section field is A/B/C/D
- Number field matches position in questions array

## Running All GP Tests

```powershell
npm run test:gp:all     # core 15 tests
node tests/gp-hint-no-emdash.test.js
node tests/gp-feedback-no-emdash.test.js
node tests/gp-prompt-nonempty.test.js
# ... (see docs/agents/gp-test-strategy.md for full list)
```
