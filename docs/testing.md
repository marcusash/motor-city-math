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
| `schedule-rescue.test.js` | sw-16: scheduleRescue timing (800ms/1200ms), reduced-motion, aria-live | 12/12 |
| `progress-story.test.js` | sw-11: buildProgressStory card, narrative copy, delta colors, no-write | 18/18 |
| `parse-student-answer.test.js` | parseStudentAnswer: integers, decimals, fractions, sqrt, edge cases, injection guard | 30/30 |

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

Output format:
```
[H] HARD FAILURE: answer "5" (numeric) appears in 8/11 exams (threshold: 6)
[I] INFO: answer "quadratic" (dropdown) appears in 9/11 exams — common, expected
```
- **Hard failure** (H): Same answer appears above the threshold (varies by type). Must fix before shipping.
- **Info** (I): Same answer template used widely. Advisory only.
- Types checked: numeric, dropdown/mc (by value), graph (by coordinate set)
- Baseline: 0 hard failures.

### Practice Exam Verification

`tests/verify-practice-exams.js` — verifies all RP1-11 exams for:
- Required fields present (`id`, `number`, `section`, `standard`, `type`, `hint`, `feedback_correct`, `feedback_wrong`)
- answer/tolerance format (number inputs must have numeric answers, dropdowns must have string answers)
- solution_steps count (must have 2+ steps)
- feedback_correct/wrong length (max 80 / max 120 chars)
- Baseline: 3008/3008 checks.

### Schema Guard (localStorage)

`tests/f-validation/localstorage-schema-guard.test.js` — auto-discovers all HTML files and:
- Checks each for localStorage usage
- Confirms key is `mcm_scores` (not a legacy key)
- Verifies round-trip get/set shape for the mcm_scores structure
- Auto-discovers files via `glob('**/*.html')` — no hardcoded list
- Baseline: 62/62 checks.

### Save/Load Key Format

`tests/f-validation/save-load-audit.test.js` — verifies the mcm_scores key format:
```
mcm_scores: {
  "mcm-{exam_id}": {
    score: number,
    outOf: number,
    pct: number,
    grade: 1|2|3|4,
    timestamp: string (ISO),
    locked: boolean
  }
}
```
Each exam writes to its own sub-key `mcm-{exam_id}`. Index reads the entire blob and iterates sub-keys. Baseline: 4/4.

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
