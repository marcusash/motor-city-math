# GP Test Index

Auto-generated index of all GP platform tests. Last updated: 2026-02-23.

## Summary

| Category | Count | Status |
|----------|-------|--------|
| JSON validity | 3 | All pass |
| Question structure | 8 | All pass |
| Answer validation | 4 | All pass |
| Content quality | 6 | 3 with known findings (GR domain) |
| Standards coverage | 2 | 1 with findings (GR domain) |
| Metadata / IDs | 5 | All pass |
| Input validation | 4 | All pass |
| Infra / scripts | 5 | All pass |
| **Total** | **37** | **34 pass, 3 informational** |

## Test Files (in `tests/`)

### JSON Validity

| File | What it checks | Result |
|------|---------------|--------|
| `gp-all-json-valid.test.js` | All data/*.json files parse cleanly | 25/25 PASS |
| `gp-rp-file-has-questions-key.test.js` | All RP files have a `questions` array | 11/11 PASS |
| `gp-questions-array.test.js` | questions field is a non-empty array | 11/11 PASS |

### Question Structure

| File | What it checks | Result |
|------|---------------|--------|
| `gp-rp-question-count.test.js` | All exams have exactly 15 questions | 11/11 PASS |
| `gp-rp-has-exam-metadata.test.js` | exam_id, title, questions present | 55/55 PASS |
| `gp-all-questions-have-type.test.js` | Every question has a type field | 165/165 PASS |
| `gp-valid-question-types.test.js` | Type is one of 14 approved values | 165/165 PASS |
| `gp-question-html-no-raw-text.test.js` | question_html is non-empty (10+ chars) | 165/165 PASS |
| `gp-prompt-nonempty.test.js` | question_html field present and non-empty | 165/165 PASS |
| `gp-question-number-field.test.js` | number field present on each question | 165/165 PASS |
| `gp-exam-number-consistency.test.js` | question.number matches array index+1 | 165/165 PASS |

### Answer Validation

| File | What it checks | Result |
|------|---------------|--------|
| `gp-answer-not-string-for-numeric.test.js` | Numeric inputs have number answers | 272/272 PASS |
| `gp-numeric-answer-is-finite.test.js` | No Infinity/NaN in numeric answers | 272/272 PASS |
| `gp-answer-type-consistency.test.js` | No string answers on numeric-type Qs | 298/298 PASS |
| `gp-mc-correct-index.test.js` | MC correct_index in valid range | 26/26 PASS |

### Content Quality (GR Domain)

| File | What it checks | Result |
|------|---------------|--------|
| `gp-hint-count-check.test.js` | Every question has a hint | 165/165 PASS |
| `gp-hint-length-check.test.js` | Hints under 250 chars (ADHD) | 165/165 PASS |
| `gp-feedback-present.test.js` | feedback_correct + feedback_wrong present | 330/330 PASS |
| `gp-feedback-length-check.test.js` | Feedback under 200 chars (ADHD) | PASS |
| `gp-hint-no-emdash.test.js` | No em/en dashes in hints | **7 violations - GR** |
| `gp-feedback-no-emdash.test.js` | No em/en dashes in feedback | **4 violations - GR** |
| `gp-no-emdash-solution-steps.test.js` | No em/en dashes in solution_steps | **14 violations - GR** |

### Standards Coverage

| File | What it checks | Result |
|------|---------------|--------|
| `gp-standard-whitelist.test.js` | Standards are from approved list (W2/W3) | 165/165 PASS |
| `gp-questions-per-standard.test.js` | Each standard present in each exam | **18 gaps - GR** |

### Metadata and IDs

| File | What it checks | Result |
|------|---------------|--------|
| `gp-exam-id-format.test.js` | exam_id follows rp{N} format | 11/11 PASS |
| `gp-exam-title-nonempty.test.js` | title field non-empty | 11/11 PASS |
| `gp-no-duplicate-ids.test.js` | No duplicate IDs within exams | 165/165 PASS |
| `gp-no-duplicate-question-ids.test.js` | No duplicate question IDs cross-exam | 165 unique, 0 dup |
| `gp-section-field.test.js` | section field present | 165/165 PASS |
| `gp-section-values.test.js` | section is A/B/C/D | 165/165 PASS |

### Input Validation

| File | What it checks | Result |
|------|---------------|--------|
| `gp-input-id-unique.test.js` | Input IDs unique within each question | 11/11 PASS |
| `gp-input-count.test.js` | All inputs counted correctly | 165/165 PASS |
| `gp-input-type-whitelist.test.js` | Input types are approved (text/number/radio/dropdown) | 359/359 PASS |
| `gp-no-orphan-inputs.test.js` | All inputs have answer fields | **61 missing - GR** |

### Other Checks

| File | What it checks | Result |
|------|---------------|--------|
| `gp-solution-steps-min-one.test.js` | Every Q has at least 1 solution step | 165/165 PASS |
| `gp-solution-steps-count.test.js` | Solution steps count | PASS |
| `gp-solution-steps-strings.test.js` | All steps are strings | 748/748 PASS |
| `gp-no-null-fields.test.js` | No null in required fields | 1155/1155 PASS |
| `gp-graph-has-canvas-id.test.js` | Graph questions have canvas_id | 22/22 PASS |
| `gp-mc-has-options.test.js` | MC inputs have at least 2 options | 5/5 PASS |
| `gp-tolerance-range.test.js` | Tolerance values in valid range | 272/272 PASS |
| `gp-plus-minus-field.test.js` | plus_minus is valid non-negative number | 16/16 PASS |

## Open Issues (all filed to GR inbox)

1. **25 em/en dash violations** — RP4/5/6/7/9 hints/feedback + RP1/2/3/4/5/8/10 solution_steps
2. **61 inputs missing answer field** — RP3-11, various inputs cannot be auto-graded
3. **18 standards gaps** — W2.a absent from RP1-7, W2.d absent from RP1-6, W3.e absent from RP7-11

## Running Tests

```bash
# Run all GP tests
node scripts/gp-data-quality-summary.js

# Run health gate
node scripts/gp-exam-health.js

# Run exam verification baseline
node tests/verify-practice-exams.js

# Check for stale inbox messages
node scripts/gp-stale-inbox-check.js

# Morning smoke check (all 4)
npm run morning
```
