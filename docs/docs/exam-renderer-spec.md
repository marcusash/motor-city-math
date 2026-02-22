# JSON-Driven Test Renderer Spec

**Author:** Agent R
**Date:** 2026-02-19
**For:** Agent A — build this as the universal test renderer
**Priority:** HIGH — Kai needs this for retake prep

---

## Problem

Each test is a handcrafted 1,500-line HTML file. That's unsustainable. We need:
1. A single renderer that reads a JSON question file and displays + grades the test
2. Support for ALL question types (including interactive canvas graphing)
3. Auto-grading that feeds into L/P/M tracking

## Architecture

```
data/retake-practice-1.json    ←  Agent R writes questions (pure data)
        ↓
exam.html?file=retake-practice-1   ←  Agent A builds (renderer + grader)
        ↓
localStorage (mcm_scores, mcm_lpm)  ←  Results stored
```

**One HTML file (`exam.html`) renders ANY test from a JSON file.** No more per-test HTML.

## URL Format

```
exam.html?file=retake-practice-1
exam.html?file=retake-practice-2
exam.html?file=nonlinear-exam-mvp
```

The `file` param points to `data/{file}.json`.

## JSON Schema

Already created: `data/retake-practice-1.json` — 15 questions, all math verified.

### Top-level

```json
{
  "exam_id": "retake-practice-1",
  "title": "Unit 2 Retake Practice",
  "subtitle": "Standards W2 & W3 · 15 Questions · ~60 min",
  "time_minutes": 60,
  "questions": [ ... ]
}
```

### Question Types (by `inputs[].type`)

| Type | What | Example |
|------|------|---------|
| `dropdown` | Select from options | Parent function picker |
| `number` | Numeric input with tolerance | "x = ___" |
| `radio` | Multiple choice (A/B/C/D) | Formula rearrangement |
| `text` | Free text (self-graded) | Domain/range |

### Plus/Minus Answers

When `question.plus_minus === true` and there are two number inputs, accept EITHER ordering. Use the same `checkPlusMinus()` logic from the MVP exam.

### Graph Questions

When `question.graph` is present, render an interactive canvas:

```json
"graph": {
  "canvas_id": "graphQ12",
  "function": "Math.pow(x - 1, 2) - 4",
  "function_display": "f(x) = (x-1)² - 4",
  "key_points": [[-1, 0], [0, -3], [1, -4], [2, -3], [3, 0]],
  "min_points": 5,
  "tolerance": 0.25,
  "asymptotes": null
}
```

For graph questions:
- Render a 500×500 canvas with the same grid as MVP exam (32×32, -16 to 16)
- Use the static `CANVAS` color constant (always white background)
- Click-to-plot with snap-to-0.25 and coordinate tooltip
- CHECK GRAPH button evaluates points against `function` with `tolerance`
- If `asymptotes` is non-null, require asymptote placement (VA/HA buttons)
- The `function` field is a JS expression with `x` as the variable — use `new Function('x', 'return ' + graph.function)` to evaluate

### Grading

Each question grades to `true`/`false`/`null` (null = skipped).

**Grading rules per input type:**
- `dropdown`: exact match on `.answer`
- `number`: `|input - answer| <= tolerance`
- `radio`: exact match on `.answer`
- `text`: self-graded (show answer, student marks correct/incorrect)
- `graph`: point-check algorithm (same as MVP exam)

**Multi-input questions** (e.g., parent dropdown + two x-intercepts): ALL inputs must be correct for the question to score as correct.

### After Grading

1. Show per-question feedback (`feedback_correct` / `feedback_wrong`)
2. Show scorecard: score/total, percentage, SAAS grade (≥92=4, ≥82=3, ≥70=2, <70=1)
3. Show per-standard breakdown (group questions by `standard`)
4. Update `mcm_scores` localStorage with attempt data
5. Call `MCM_LPM.recordResults()` if the module exists (per `docs/lpm-tracking-spec.md`)
6. Show hint button on wrong answers (3-layer: hint → answer → solution_steps)

### What to Reuse

- `shared/styles.css` — all existing card/input/button styles
- `shared/scripts.js` — `gradeTest()` pattern, `MCM_SRS.recordAnswer()`, scorecard
- Canvas code from `nonlinear_exam_mvp.html` — extract `drawGrid`, `redrawGraph`, `checkGraph`, click-to-plot, tooltip, asymptote mode into a reusable function that takes a `graph` config object

### What NOT to Do

- Don't hardcode any questions in HTML
- Don't create a new HTML file per test
- Don't break existing tests — `nonlinear_exam_mvp.html` stays as-is

## Files

| File | Owner | What |
|------|-------|------|
| `data/retake-practice-1.json` | Agent R | 15 questions, math verified ✅ |
| `exam.html` | Agent A | **BUILD THIS** — JSON-driven renderer |
| `docs/lpm-tracking-spec.md` | Agent R | L/P/M tracking spec (integrate after grading) |

## ADHD Constraints

- Timer shows remaining time (from `time_minutes`)
- One question visible at a time OR scrollable cards (match MVP layout)
- Feedback ≤12 words
- Score shows position: "7/15" not just "47%"
- "PRACTICE WEAK STANDARDS" button on scorecard

## Verification

After building, run: `node tests/r-t4-canvas-verify.js` (adapted for exam.html)
And verify: all 15 questions grade correctly with the answers from the JSON.
