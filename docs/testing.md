# Motor City Math — Testing Guide

**Owner:** GF (QA engineer)
**Last updated:** 2026-02-24

---

## Overview

MCM uses pure Node.js tests (no Jest, no framework). All tests are `.js` files that use `process.exit(1)` on failure. Run from the repo root.

---

## Test Suites by Category

### F-Validation (Forge standards — run by GA/GF)

Located in `tests/f-validation/`.

| Test | Coverage | Pass Baseline |
|------|---------|--------------|
| `localstorage-schema-guard.test.js` | localStorage key format, mcm_scores schema, get/set round-trip | 62/62 |
| `save-load-audit.test.js` | exam.html saveResults shape, load compatibility | 4/4 |
| `gp-aria-labels.test.js` | Canvas aria-label presence (all graph canvases) | 7/7 |
| `gp-print-css.test.js` | Print CSS: timer/hints hidden, required elements visible | 3/3 |
| `inline-script-syntax-check.test.js` | JS syntax check on all 5 HTML files | 5/5 |
| `exam-grading-unit.test.js` | Numeric grading, tolerance, comma/dollar strip, MC, pct/grade | 33/33 |
| `exam-save-results.test.js` | saveResults shape, best tracking, lock, null examId | 24/24 |
| `exam-hint-scorecard.test.js` | Grade thresholds 92/82/70, coach copy, hint layer IDs | 125/125 |

Run all at once:
```powershell
Get-ChildItem tests/f-validation -Filter "*.test.js" | ForEach-Object { node $_.FullName }
```

### GP Data Tests (exam JSON quality — run by GP/GR before shipping)

Located in `tests/gp-*.test.js`. Over 80 individual checks covering JSON schema, field completeness, uniqueness, LaTeX format, feedback style.

Run via:
```powershell
node tests/gp-all-json-valid.test.js
node tests/verify-practice-exams.js
node tests/cross-exam-verify.js
```

### Cross-Exam Verification

`tests/cross-exam-verify.js` — checks for answer collisions ACROSS all exams. Prevents Kai from memorizing answer patterns.

Output:
- **Hard failure** (H): Same answer appears in too many exams. Must fix before shipping.
- **Info** (I): Same answer template used widely. Advisory only.
- Baseline: 0 hard failures.

### Practice Exam Verification

`tests/verify-practice-exams.js` — verifies all RP1-11 exams for:
- Required fields present
- answer/tolerance format
- solution_steps count
- feedback_correct/wrong length
- Baseline: 3008/3008 checks.

---

## Running a Single Test

```powershell
node tests/f-validation/exam-grading-unit.test.js
node tests/cross-exam-verify.js
node tests/verify-practice-exams.js
```

---

## Pre-Commit Hook

The `.git/hooks/pre-commit` script runs automatically on every commit. It checks:
- `polyfill.io` references (blocked)
- CDN URLs with local alternatives (warn)
- Duplicate HTML tags (warn)
- File size > 200KB (warn)
- Hardcoded hex colors in new code (warn)

The hook does NOT check `.md` or `.json` files.

---

## Adding a New Test

1. Create `tests/f-validation/your-test.test.js`
2. Use the standard pattern:

```js
var pass = 0, fail = 0;
// ... run checks ...
if (condition) { pass++; } else { fail++; console.error('FAIL: description'); }
// ... etc ...
console.log('your-test: ' + pass + '/' + (pass+fail) + ' pass');
if (fail > 0) process.exit(1);
```

3. Add to this doc and update baseline counts.

---

## Baseline Maintenance

After any code change that affects grading, localStorage, or WCAG:
1. Run all F-validation tests — confirm all baselines pass
2. Run `cross-exam-verify.js` — confirm 0 hard failures
3. If a test breaks legitimately (feature change), update the test and document the new baseline here.
