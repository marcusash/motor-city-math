# GP Docs: Verification Matrix

**Purpose:** Quick reference for which scripts/tests to run at each workflow stage.  
**Author:** GP  
**Updated:** 2026-02-23

---

## When to Run What

| Trigger | Command | Why |
|---------|---------|-----|
| Before any commit touching data/ | `npm run verify` | Confirm 3008/3008 |
| Before publish | `npm run health` | 11/11 gate |
| After adding new exam | `npm run verify && npm run health` | Full gate |
| New RP JSON authored by GR | `node scripts/gp-exam-health.js` | Auto-check all |
| Checking field completeness | `node tests/gp-field-completeness.test.js` | 900/900 |
| Checking ADHD compliance | `node tests/gp-feedback-length.test.js && node tests/gp-hint-length.test.js` | 300/300, 150/150 |
| Math verification | `node tests/gp-graph-keypoints.test.js` | 100/100 |
| Cross-exam uniqueness | `node tests/cross-exam-verify.js` | 0 hard fails |

---

## Scripts Reference

| Script | Input | Output | Notes |
|--------|-------|--------|-------|
| `scripts/gp-rp-field-audit.js` | data/*.json | Per-field completeness matrix | Idempotent |
| `scripts/gp-field-fixer.js` | data/*.json | Auto-fills missing fields | Safe defaults |
| `scripts/gp-feedback-trimmer.js` | data/*.json | Trims 12-word violations | ADHD rule |
| `scripts/gp-exam-health.js` | — | 11-check summary | Main gate |
| `scripts/gp-exam-coverage.js` | — | Per-exam stats | Analytics |
| `scripts/gp-exam-standards-map.js` | — | Standard distribution | RP authoring |
| `scripts/gp-exam-type-coverage.js` | — | Question type counts | RP authoring |
| `scripts/gp-answer-distribution.js` | — | Frequency map | Collision risk |
| `scripts/gp-file-size-check.js` | — | HTML file sizes | Advisory |
| `scripts/gp-tolerance-audit.js` | — | Tolerance sanity | Advisory |
| `scripts/gp-exam-diff.js` | 2 files | Diff summary | Debugging |
| `scripts/gp-placeholder-steps.js` | — | Thin solution steps | QA |
| `scripts/gp-word-count.js` | — | ADHD word count | ADHD audit |

---

## Test Suite Reference

| Test | Checks | Fails on |
|------|--------|----------|
| verify-practice-exams.js | 3008 | Missing fields, wrong section counts, bad key_points |
| cross-exam-verify.js | 1959 | Hard: same answer same slot across exams |
| gp-field-completeness.test.js | 900 | Missing required fields |
| gp-answer-uniqueness.test.js | 66 | Duplicate answers within exam (single-input Qs) |
| gp-solution-steps.test.js | 150 | < 3 solution steps |
| gp-feedback-length.test.js | 300 | > 12 words in feedback |
| gp-manifest-integrity.test.js | 10 | manifest.json out of sync |
| gp-graph-keypoints.test.js | 100 | Key points don't evaluate to graph function |
| gp-exam-id-consistency.test.js | 170 | exam_id doesn't match filename |
| gp-answer-tolerance.test.js | 261 | tolerance ≤ 0 or missing |
| gp-hint-length.test.js | 150 | > 20 words in hint |
| gp-version-check.test.js | 10 | version not '2.0' format |
| gp-input-label.test.js | 317 | Empty input labels |
| gp-json-parse.test.js | 10 | Invalid JSON |
| gp-hint-presence.test.js | 150 | Missing hint field |
| gp-cdn-check.test.js | 11 | polyfill.io in HTML |
| gp-commit-prefix.test.js | audit | GP commits without GP: prefix |
| gp-viewport-meta.test.js | 11 | Missing viewport meta |

---

## Pre-Commit Hook (8 checks)

Runs automatically on `git commit`:
1. polyfill.io ban
2. CDN URL alternatives check
3. HTML duplicate tag count
4. File size guard (>200KB blocked)
5. Hardcoded hex color warning
6. feedback_correct presence in JSON
7. Duplicate answer check
8. localStorage key collision

Install: `bash scripts/install-hooks.sh`
