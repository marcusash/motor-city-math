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
| `sw18-chart-canvas-keyboard.test.js` | sw-18: Chart.js canvas role=img, tabindex, aria-label, keydown handler, focus ring | 15/15 |
| `build-chart-edge-cases.test.js` | buildChart: empty state, single-point, yPt clamping (0/40/100/150/NaN), SVG aria, grade lines | 18/18 |
| `evaluate-number-inputs.test.js` | evaluateNumberInputs: ordered/plus-minus grading, tolerance, NaN, empty | 16/16 |
| `find-missing-inputs.test.js` | findMissingInputLabels: dropdown/number/radio/text validation, null safety, multi-Q | 14/14 |
| `exam-answer-format-hint.test.js` | sw-17: format hint on wrong non-int answer, header guide, inline hints, sqrt/fraction parser | 13/13 |
| `exam-form-label-association.test.js` | WCAG 2.4.6: renderInput() label association for dropdown/number/radio/text + canvas role | 12/12 |
| `sw16-hint-reveal-timing.test.js` | sw-16: scheduleRescue 800ms/1200ms delays, reduced-motion 0ms path, transitional msg aria-live | 18/18 |
| `index-up-next-logic.test.js` | buildStudyNext() null guard, empty/all-passed fallback, pct thresholds, max-3 cap | 17/17 |
| `timer-nan-guard.test.js` | initTimer() NaN guard: missing time_minutes early exit, formatTime isFinite, exam.html truthy check | 10/10 |
| `buildsparkline-scoping.test.js` | buildSparkline() local var scoping fix: tkCorrect/tkRed/tkBlue declared inside fn, SVG output | 12/12 |
| `hint-message-copy.test.js` | scheduleRescue transitional message: no em dash, <=12 words (ADHD), aria-live=polite | 12/12 |
| `gradeexam-section-comments.test.js` | gradeExam() 5-section comment structure guard + pure helper delegation | 12/12 |
| `exam-autosave-sessionstorage.test.js` | Autosave uses sessionStorage key exam-autosave-{examId}, not localStorage, cleared on submit | 9/9 |
| `exam-landmark-main.test.js` | WCAG landmarks: exam.html role=main, index.html main, bypass blocks | 7/7 |
| `answer-key-guard.test.js` | Answer key password gate: prompt/compare/block, no bypass path | 10/10 |
| `css-token-hygiene.test.js` | No inline hex in style=, brand palette present, <=15 unique hex (advisory) | 6/6 |
| `dom-query-perf-audit.test.js` | renderQuestions() no getElementById in loops, RAF callback safety, setInterval safety | 5/5 |
| `evaluate-number-inputs-tolerance.test.js` | evaluateNumberInputs(): tolerance math, ordered/plus_minus/NaN paths | 9/9 |
| `aria-live-region-audit.test.js` | aria-live region count (8, within threshold), key regions present, no role=alert misuse | 7/7 |
| `exam-tab-order.test.js` | No positive tabindex, tabindex=0 on custom elements, examGraded double-submit guard | 5/5 |
| `css-token-count.test.js` | 35 CSS tokens in shared/styles.css, core tokens present, arena-mode defined | 8/8 |
| `manifest-sync.test.js` | manifest.json: 11 exams, all IDs match files, all entries have title/desc | 9/9 |
| `exam-json-version.test.js` | All RP1-11 version === "2.0" string (normalization regression guard) | 13/13 |
| `exam-print-css.test.js` | @media print hides hint-btn, graph-controls, submit-area, nav-bar, header-back | 8/8 |
| `wcag-contrast-token-regression.test.js` | Key WCAG AA token values locked: text-primary, text-secondary, bg-page, color-correct, color-incorrect, arena tokens | 8/8 |
| `gradeexam-feedback-voice.test.js` | gradeExam() coachMsg: 4 messages, no em dash, under 12 words ADHD limit, MCM voice, grade 4 specific | 9/9 |
| `rp11-answer-uniqueness.test.js` | RP11: no answer 3+ times, no consecutive dups, version 2.0 string, manifest entry exists | 7/7 |
| `exam-heading-hierarchy.test.js` | h1 present, no skipped heading levels, no empty static headings (exam.html + index.html) | 8/8 |
| `score-history-persistence.test.js` | mcm_scores key, attempts schema (score/total/pct/grade/sections/questions/timestamp), JSON round-trip | 14/14 |
| `shared-scripts-api.test.js` | 10 public functions, parseStudentAnswer contracts, password guard, initTimer null guard | 19/19 |
| `exam-error-state.test.js` | Color borders, answer-feedback show class, fb.textContent, double-submit guard | 11/11 |
| `rp11-question-type-coverage.test.js` | 9 types, all 5 core types (quadratic/exponential/radical/rational/abs-val), max 4 per type | 10/10 |
| `css-no-important-audit.test.js` | Only KaTeX exception outside @media print, no inline style !important | 5/5 |
| `exam-keyboard-submit.test.js` | `<button>` element, onclick gradeExam, skip link, no positive tabindex, not disabled by default | 8/8 |
| `gradeexam-section-ordering.test.js` | 5 sections in order 1-5, Section 5 = scorecard+save, helpers delegated | 7/7 |
| `answer-key-modal-a11y.test.js` | showAnswerKey display:block/none, password guard, role=dialog + aria-modal on modal elements | 12/12 |
| `exam-timer-display-contract.test.js` | M:SS format, countdown (remaining--), 0:00 terminal, onTimeUp callback, aria-live assertive | 12/12 |
| `hint-reveal-count.test.js` | All RP11 have 2-8 solution steps, non-empty, no em dash, exam.html renders solution_steps | 8/8 |
| `index-empty-state.test.js` | Empty state CSS, motivational copy, getScores {} fallback, buildSparkline length guard | 9/9 |
| `hint-message-diversity.test.js` | 4+ distinct openers, no em dash, no consecutive dups, non-empty | 5/5 |
| `rp11-question-standards.test.js` | All W2/W3 standard codes valid, W2.b present, 2+ W2 + W3 standards, no domination | 7/7 |
| `arena-mode-css-completeness.test.js` | .arena-mode overrides 5+ tokens, bg-page dark, text-primary light, JS applies class | 11/11 |

**F-Validation suite total: 127 test files.** Run all at once:
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
