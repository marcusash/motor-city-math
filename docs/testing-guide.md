# Docs: Testing Guide

How to run all test suites for Motor City Math.

## Quick All-Clear (2 commands)

```bash
node tests/verify-practice-exams.js
node scripts/gp-exam-health.js
```

Both pass = Kai-ready.

## Full GP Test Suite

```bash
# Run all GP tests
npm run test:gp:all

# Individual tests
node tests/gp-field-completeness.test.js   # all fields present
node tests/gp-schema-version-v2.test.js   # schema_version: "2.0"
node tests/gp-metadata-complete.test.js   # title, version, questions
node tests/gp-json-parse.test.js          # valid JSON
node tests/gp-answer-uniqueness.test.js   # no duplicate answers
node tests/gp-hint-presence.test.js       # all hints present
node tests/gp-hint-length.test.js         # hints ≤ 20 words
node tests/gp-feedback-length.test.js     # feedback ≤ 12 words
node tests/gp-answer-tolerance.test.js    # tolerance ≥ 0
node tests/gp-question-count.test.js      # 15 questions per exam
node tests/gp-solution-steps-format.test.js  # steps are string arrays
node tests/gp-graph-keypoints.test.js     # key_points verified
node tests/gp-viewport-meta.test.js       # all HTML have viewport meta
node tests/gp-print-css.test.js           # @media print presence
node tests/gp-aria-labels.test.js         # canvas aria-labels
node tests/gp-cdn-check.test.js           # no polyfill.io references
node tests/gp-commit-prefix.test.js       # GP: prefix on recent commits
node tests/gp-version-check.test.js       # version field present
node tests/gp-exam-id-consistency.test.js # exam_id matches filename
```

## Cross-Exam Suite

```bash
node tests/verify-practice-exams.js       # 3008/3008 baseline
node tests/cross-exam-verify.js           # 0 cross-exam hard fails
```

## F-Validation Suite (GF-owned)

```bash
node tests/f-validation/exam-json-schema.test.js
node tests/f-validation/exam-cross-exam-dedup.test.js
node tests/f-validation/design-compliance.spec.js
node tests/f-validation/pre-commit-check.js --all
```

## Analytics Scripts (advisory, not pass/fail)

```bash
node scripts/gp-exam-health.js              # 11/11 health gate
node scripts/gp-feedback-tone-check.js      # feedback tone audit
node scripts/gp-latex-scan.js               # unclosed LaTeX
node scripts/gp-graph-question-audit.js     # graph key_points audit
node scripts/gp-exam-standards-map.js       # standard distribution
node scripts/gp-answer-distribution.js      # answer frequency
node scripts/gp-file-size-check.js          # HTML size check
```

## Before Merging Any Exam Data

```bash
node tests/verify-practice-exams.js        # must stay at baseline
node tests/cross-exam-verify.js            # 0 hard fails
node scripts/gp-exam-health.js             # 11/11
```

---

*Owner: GP | Reference: docs/agents/gp-verification-matrix.md*
