# Motor City Math — Architecture Guide

## Overview

Motor City Math is a **pure static HTML/CSS/JS** Algebra II study tool. No build tools, no server, no frameworks. Kai opens a folder in his browser and studies. Everything runs from `file://` URLs.

```
kai-algebra2-tests/
├── index.html              ← Dashboard (entry point)
├── parent.html             ← Parent view (scores, progress)
├── practice.html           ← SRS-powered practice mode
├── test-builder.html       ← Custom test generator
├── test.html               ← Dynamic test renderer
├── nonlinear_exam_mvp.html ← 15-question MVP with canvas graphing
├── linear_functions_test.html ← 7-question test with Chart.js graphs
├── [12 more test HTML files]
├── shared/                 ← Reusable CSS, JS, assets
│   ├── styles.css          ← Design system (Pistons palette, Arena Mode)
│   ├── scripts.js          ← Grading engine, timer, SRS, save/load
│   ├── chart-theme.js      ← Chart.js Pistons theme
│   ├── chart.min.js        ← Chart.js v4 (offline bundle)
│   ├── print.css           ← @media print rules
│   ├── favicon.svg         ← Pistons favicon
│   └── katex/              ← KaTeX 0.16.9 (CSS, JS, fonts)
├── data/
│   └── questions.json      ← 313 questions with metadata
├── tests/                  ← Jest test suites
└── docs/                   ← Documentation
```

---

## Shared Engine (`shared/scripts.js` — 683 lines)

The shared engine provides every reusable behavior. All functions are globals on `window`.

| Function | Purpose |
|----------|---------|
| `gradeTest(config)` | Central auto-grading engine. Accepts question definitions, shows per-question feedback, computes per-standard scores, renders scorecard. Used by 14 of 19 files. |
| `checkAnswer(student, correct)` | Compares answers with numeric tolerance (±0.01) or normalized string matching. Handles fractions, exponents, multi-part answers. |
| `norm(str)` | Normalizes answer strings — lowercase, strip whitespace, convert Unicode superscripts to caret notation. |
| `initTimer(opts)` | Countdown timer. Opt-in via `data-time-minutes="N"` on any element. Color states, toast notifications at 10/5/1 min, auto-submit at 0:00. |
| `saveResults(key)` / `loadResults(key)` | Persist form inputs to localStorage for session resume. |
| `showAnswerKey()` / `closeAnswerKey()` | Password-protected answer key modal (password: see voice guide). |
| `printTest()` | Triggers `window.print()`. |
| `initTextareaResize()` | Adds mouse-drag resize handles to all textareas. |
| `MCM_SRS` | Spaced repetition system (Leitner 5-box method). Tracks mastery per question, builds smart practice queues. Exposes `recordAnswer`, `recordSession`, `buildQueue`, `getStats`. |

### Auto-grading Flow

```
HTML file defines:  questions[], feedbacks{}, storageKey
         │
         ▼
    gradeTest(config)
         │
         ├─ For each question: checkAnswer(student, correct)
         │   └─ norm() both sides, compare
         │   └─ Numeric? parseFloat + tolerance
         │   └─ Multi-part? Split on comma, check each
         │
         ├─ Render per-question ✅/❌ feedback
         ├─ Compute per-standard breakdown
         ├─ Render 6-tier scorecard with voice copy
         └─ Save score to localStorage → mcm_scores[storageKey]
```

### Timer Flow

```
DOMContentLoaded
    └─ Find [data-time-minutes]
        └─ initTimer({ minutes, onComplete: autoSubmit })
            ├─ Inject timer UI into header
            ├─ Countdown every second
            ├─ Color states: normal → warning (5min) → urgent (1min) → timer-warning (30s) → timer-critical (10s, pulses) → timer-expired (0:00)
            ├─ aria-live polite at 30s, assertive at 10s
            ├─ Toast notifications at 10, 5, 1 minute marks
            └─ Auto-submit after 1500ms at 0:00 (opts.onTimeUp)
```

### Autosave Flow

```
restoreAutosave()
    ├─ Check sessionStorage['exam-autosave-{examId}']
    ├─ If data: restore all input values + show session restore toast
    └─ If no data: fresh start, no toast

autosave() [debounced 800ms]
    ├─ Triggered on every input change
    └─ Serializes all input values to sessionStorage['exam-autosave-{examId}']
```

### Canvas Graph (WCAG 2.1.1)

All graph canvas elements support keyboard navigation:
- `Tab` to focus canvas
- Arrow keys move cursor (1-unit steps, 0.25 with Shift)
- `Enter` places a point at cursor position
- `Backspace` removes the last placed point
- Visual: cursor ring drawn at current keyboard position
- aria-live region announces cursor position and point placements

---

## Design System (`shared/styles.css`)

CSS custom properties define the entire visual language. Arena Mode (dark theme) overrides all 17 tokens.

```css
:root {
    --accent-red: #C8102E;      /* Pistons red */
    --accent-blue: #1D42BA;     /* Pistons blue */
    --accent-navy: #002D62;     /* Pistons navy */
    --bg-page: #F8F8F8;
    --bg-card: #FFFFFF;
    --text-primary: #1a1a2e;
    /* ... 17 tokens total */
}

body.arena-mode {
    --bg-page: #0a0a1a;
    --bg-card: #1a1a2e;
    --text-primary: #e0e0e0;
    /* all 17 tokens overridden */
}
```

Arena Mode toggle is injected automatically by `shared/scripts.js` on DOMContentLoaded. Persists in `localStorage['mcm-arena-mode']`. Respects OS `prefers-color-scheme: dark`.

---

## Data Layer

### localStorage Keys

| Key | Written By | Read By | Contents |
|-----|-----------|---------|----------|
| `mcm-{filename}-results` | `saveResults()` | `loadResults()` | Raw form input values for session resume |
| `mcm_scores` | `gradeTest()` | `index.html` dashboard | `{ storageKey: { pct, total, correct, standards, date } }` |
| `mcm_srs` | `MCM_SRS` | `practice.html` | Leitner box assignments per question ID |
| `mcm-arena-mode` | Arena toggle | Arena toggle | `"true"` or absent |

### Question Bank (`data/questions.json` — 313 questions)

```json
{
    "id": "exp-001",
    "unit": "exponents",
    "standard": "N.RN.1",
    "difficulty": "medium",
    "question": "Simplify: x^3 · x^8",
    "answer": "x^11",
    "hint": "When multiplying same base, add exponents",
    "solution": "x^3 · x^8 = x^(3+8) = x^11",
    "tags": ["product-rule"]
}
```

**Unit distribution:** exponents (63), exponential-functions (50), functions (50), linear-models (50), nonlinear-functions (50), expressions-equations (50).

---

## File Inventory (5 active HTML files + 11 retake practice JSONs)

Site was simplified from 19 HTML files to 5 in February 2026.

| File | Lines | Grading | Timer | Graphing | Purpose |
|------|-------|---------|-------|----------|---------|
| `index.html` | ~1100 | — | — | Chart.js | Dashboard: scores, sparklines, Up Next, score corruption recovery |
| `exam.html` | ~1550 | ✅ JSON | ✅ | ✅ Canvas | **Primary exam renderer** — JSON-driven, loads any retake-practice-*.json |
| `nonlinear_exam_mvp.html` | ~1486 | ✅ shared | ✅ 60min | ✅ Canvas | Original 15-question MVP exam (nonlinear functions) |
| `final_exam_251123.html` | ~1200 | ✅ shared | ✅ | ✅ Chart.js | 18-question final exam (locked after grading) |
| `final_exam_251123_mini.html` | ~433 | ✅ shared | ✅ | — | 8-question mini final |

### Retake Practice Exams (`data/`)

| File | Exam ID | Status |
|------|---------|--------|
| `retake-practice-1.json` | `mcm-retake-practice-1` | Verified (GR) |
| `retake-practice-2.json` | `mcm-retake-practice-2` | Verified (GR) |
| `retake-practice-3.json` | `mcm-retake-practice-3` | Verified (GR) |
| `retake-practice-4.json` | `mcm-retake-practice-4` | Verified (GR) |
| `retake-practice-5.json` | `mcm-retake-practice-5` | Verified (GR) |
| `retake-practice-6.json` | `mcm-retake-practice-6` | Verified (GR), W2.b drill |
| `retake-practice-7.json` | `mcm-retake-practice-7` | Verified (GR), mock retake |
| `retake-practice-8.json` | `mcm-retake-practice-8` | Verified (GR) |
| `retake-practice-9.json` | `mcm-retake-practice-9` | Verified (GR), rebuilt for uniqueness |
| `retake-practice-10.json` | `mcm-retake-practice-10` | Verified (GR) |
| `retake-practice-11.json` | `mcm-retake-practice-11` | Verified (GR) |

---

## Reusability Assessment

### ✅ Highly Reusable (ready now)

| Component | How to use |
|-----------|-----------|
| **Auto-grading** | Define a `questions[]` array and call `gradeTest(config)`. 14 files already do this. |
| **Timer** | Add `data-time-minutes="45"` to any element. Zero JS needed. |
| **Arena Mode** | Loads automatically from `shared/scripts.js`. Uses CSS variables — works with any HTML that uses the design tokens. |
| **Scorecard** | Built into `gradeTest()`. Automatic 6-tier voice copy based on score percentage. |
| **SRS Practice** | `MCM_SRS.buildQueue(questions)` returns prioritized practice queue from any question array. |
| **Design System** | Link `shared/styles.css` — all Pistons palette, responsive breakpoints, print rules included. |
| **Chart.js Theme** | Load `shared/chart-theme.js` after Chart.js. All charts auto-apply Pistons colors. |
| **KaTeX** | Link `shared/katex/katex.min.css` + `katex.min.js` + `auto-render.min.js`. Call `renderMathInElement(document.body)` after content loads. |
| **Save/Load** | Call `saveResults('my-key')` and `loadResults('my-key')`. Works with any form. |
| **Dashboard integration** | Set `storageKey` in `gradeTest()` config. Dashboard automatically picks up scores. |

### ⚠️ Partially Reusable (needs extraction)

| Component | Current State | Work Needed |
|-----------|--------------|-------------|
| **Canvas graphing** | ~120 lines inline in `linear_functions_test.html` (drawGrid, drawPoints, drawLines, redraw). Used for one interactive graph question. | Extract to `shared/graph.js` with configurable grid bounds, snap-to-grid, point/line modes. |
| **Question rendering** | `test.html` renders from JSON but has no graphing support. Cannot handle graph-type questions. | Add graph question type to test.html renderer. |

### ❌ Not Reusable (fully inline)

| Component | Location | Notes |
|-----------|----------|-------|
| MVP custom grading | `nonlinear_exam_mvp.html` | `gradeExamMVP()` — handles checkbox groups, graph checking, multi-select. Could be generalized but tightly coupled to specific questions. |
| Per-question HTML | Each test file | Questions are hand-written HTML with inline KaTeX. The question bank (JSON) is the reusable path forward. |

---

## Creating a New Test (fastest path)

### Option A: JSON-Driven (recommended for new tests)

1. Add questions to `data/questions.json` with unit, standard, difficulty, hint, solution
2. Open `test-builder.html` → filter by unit/standard/difficulty → click "Open Interactive"
3. `test.html` renders the test dynamically with auto-grading, timer, save/load

**Time to create:** Add questions to JSON → done. No HTML authoring needed.

### Option B: Hand-Written HTML (for custom layouts or graphing)

1. Copy a template file (e.g., `exponents_exam.html` for simple, `quiz_251120.html` for charts)
2. Add `<link>` tags: `shared/styles.css`, `shared/print.css`, `shared/katex/katex.min.css`
3. Add `<script>` tags: `shared/scripts.js`, `shared/katex/katex.min.js`, `shared/katex/auto-render.min.js`
4. For charts: add `shared/chart.min.js` + `shared/chart-theme.js`
5. Define `questions[]` array mapping question IDs to correct answers
6. Call `gradeTest({ questions, storageKey: 'my-test' })` from Submit button
7. Add `data-time-minutes="45"` for timed tests

**Time to create:** ~30 minutes for a 10-question test with auto-grading and timer.

---

## Known Gaps & Technical Debt

| # | Gap | Impact | Fix |
|---|-----|--------|-----|
| 1 | Canvas graphing code is inline (not shared) | Cannot reuse graphing for new tests | Extract to `shared/graph.js` |
| 2 | `test.html` has no graphing support | Dynamic tests can't include graph questions | Add graph question type renderer |
| 3 | KaTeX has no CDN fallback | If local file missing, math won't render | Add fallback `<script>` like Chart.js pattern |
| 4 | 11 files have thin wrapper grading functions | Minor code duplication | Low priority — wrappers are clear and simple |
| 5 | `index.html` missing `shared/print.css` | Dashboard print layout not optimized | Add print.css link |

---

## Offline Architecture

All dependencies are bundled locally for `file://` operation:

| Dependency | Local Path | CDN Fallback |
|-----------|-----------|-------------|
| Chart.js v4 | `shared/chart.min.js` | ❌ CDN fallback removed (local bundle is reliable) |
| KaTeX 0.16.9 | `shared/katex/` (CSS + JS + 63 fonts) | ❌ None |
| MathJax 3 | None (migrated to KaTeX) | — |

No network requests required for any functionality.

---

## Test Coverage

- **182 automated tests** in `tests/f-validation/` — grading, save/load, WCAG, schema, design, scorecard, timer
- **Node.js unit tests**: exam-grading-unit (33/33), exam-save-results (24/24), exam-hint-scorecard (125/125)
- **GP test suite**: aria-labels (7/7), print-css (3/3), manifest-integrity, schema-v2, all-rp-schema
- **GF test suite**: cross-exam-dedup, grading-audit, localstorage-schema-guard (62/62)
- **Manual QA** — WCAG pass confirmed by GD QA batch Feb 24

---

## ADHD Design Principles (applied everywhere)

1. **One CTA at a time** — Submit button is the only action during a test
2. **Max 12 words per feedback** — Scorecard messages are concise coach-style
3. **Progress position** — "Question X of Y" in practice mode
4. **Timer shows remaining** — Not elapsed. Less anxiety, more actionable.
5. **No walls of text** — Questions use whitespace, clear numbering, visual hierarchy
6. **Celebrate results** — "That's an A" not "Good effort"
