# Motor City Math — Data Model

**Owner:** GP (grind-platform)  
**Last updated:** 2026-02-24

---

## Retake Practice Exam JSON Schema

Each `data/retake-practice-N.json` follows this structure:

```json
{
  "exam_id": "retake-practice-1",
  "title": "Retake Practice 1",
  "version": "2.0",
  "questions": [
    {
      "id": "rp1-q1",
      "question_html": "Solve: \\( 2x + 3 = 11 \\)",
      "inputs": [
        {
          "id": "q1_x",
          "type": "number",
          "label": "x =",
          "answer": 4,
          "tolerance": 0.01
        }
      ],
      "hint": "Subtract 3 from both sides first.",
      "solution_steps": [
        "Subtract 3: 2x = 8.",
        "Divide by 2: x = 4.",
        "Check: 2(4)+3 = 11. Correct."
      ],
      "feedback_correct": "Nailed it. x=4.",
      "feedback_wrong": "Subtract 3 first, then divide by 2."
    }
  ]
}
```

## Field Reference

> **Authoritative schema:** `data/schemas/practice-exam.schema.json` (owned by GI). When in doubt, the schema wins over this doc.

### Top-Level Fields

| Field | Type | Required | Notes |
|-------|------|---------|-------|
| `exam_id` | string | yes | Must match filename (without .json) |
| `title` | string | yes | Human-readable exam name |
| `subtitle` | string | yes | Standards covered, question count, estimated time |
| `time_minutes` | integer | yes | 10-180. Estimated completion time in minutes |
| `created` | string | yes | ISO 8601 date YYYY-MM-DD |
| `created_by` | string | yes | Agent or person who created the exam |
| `version` | string | no | All RP1-11 files use "2.0" (normalized in commit 59592bc). Schema originally defined as integer, actual files use string. |
| `schema_version` | string | no | Schema version targeted. Pattern: N.N (e.g. "1.0", "2.0") |
| `questions` | array | yes | Exactly 15 questions |

### Optional Top-Level Fields

| Field | Type | Notes |
|-------|------|-------|
| `purpose` | string | Exam purpose description |
| `fr_approved` | boolean | Whether FR (research) has approved content |
| `fr_approved_date` | string | ISO 8601 date of FR approval |
| `fr_approval_notes` | string | FR approval notes |

### Question Fields

| Field | Type | Required | Notes |
|-------|------|---------|-------|
| `id` | string | yes | Format: `rpN-qM` |
| `number` | integer | yes | Display question number |
| `section` | string | yes | Enum: A, B, C, D |
| `standard` | string | yes | Pattern: W[23].[a-e] |
| `type` | string | yes | See question types below |
| `question_html` | string | yes | LaTeX wrapped in `\( \)` |
| `inputs` | array | yes | 1+ input objects |
| `hint` | string | yes | One sentence. Under 20 words. No em dashes. |
| `hint_2` | string | no | Second hint if needed |
| `solution_steps` | array | yes | >= 3 string steps |
| `feedback_correct` | string | yes | Under 12 words (ADHD rule). No em dashes. |
| `feedback_wrong` | string | yes | Under 12 words (ADHD rule). No em dashes. |
| `plus_minus` | boolean | no | True if x1/x2 are interchangeable |
| `feedback_wrong_parent` | string | no | Used in identify questions (RP1-7 format) |
| `feedback_wrong_intercepts` | string | no | Used in identify questions (RP1-7 format) |
| `graph` | object | conditional | Required for graphing question types |

### Input Fields

| Field | Type | Required | Notes |
|-------|------|---------|-------|
| `id` | string | yes | Unique within exam |
| `type` | string | yes | `number`, `text`, `dropdown`, `radio` |
| `label` | string | yes | Display label |
| `answer` | number/string | yes | Correct answer |
| `tolerance` | number | no | Recommended for number type. Acceptable error range. |

### Graph Fields

| Field | Type | Required | Notes |
|-------|------|---------|-------|
| `canvas_id` | string | yes | Unique canvas element ID |
| `function` | string | yes | JS-evaluable function string |
| `function_display` | string | yes | Human-readable function for display |
| `key_points` | array | yes | `[[x,y], ...]` verified coordinates |
| `min_points` | integer | yes | Minimum points required (>= 3) |
| `tolerance` | number | yes | Max 0.3 |
| `x_range` | array | no | `[min, max]` viewport x bounds (used in RP6+) |
| `y_range` | array | no | `[min, max]` viewport y bounds (used in RP6+) |
| `asymptotes` | object | no | `{vertical: [], horizontal: []}`. Optional; null is valid. Used in RP1-7 format. |

### Graph Coordinate System

The canvas renderer maps math coordinates to pixel space. Default viewport is x=[-5,5], y=[-5,5] unless overridden by `x_range`/`y_range`.

Coordinate conventions:
- `(0, 0)` is the center of the canvas
- Positive x goes right, positive y goes up (standard math orientation)
- Grid lines every 1 unit; minor gridlines at 0.5 unit intervals
- Key points `[x, y]` are in math coordinates, not pixel coordinates

When Kai clicks or uses keyboard to place a point:
1. Pixel click position is converted to math coordinates
2. Coordinate is snapped to nearest 0.25 grid unit (prevents off-grid placements)
3. Point is accepted if `|student_x - key_x| <= tolerance` AND `|student_y - key_y| <= tolerance`

Axis labels come from `x_axis_label` and `y_axis_label` if present; defaults are "x" and "y".

### Question Types

Valid values for `questions[].type` (14 types):
`identify`, `graph`, `multiple-choice`, `word-problem`, `write-equation`,
`exponential`, `quadratic`, `radical`, `rational`, `absolute-value`,
`extraneous`, `fractional-exp`, `error-analysis`, `construct`

## Verify Requirements

Before any exam ships to Kai:
1. `node tests/verify-practice-exams.js` — 3337/3337 pass
2. `node tests/cross-exam-verify.js` — 0 hard failures
3. `node scripts/gp-exam-health.js` — 11/11 checks pass
4. `npm run test:gp:all` — all GP tests pass

---

## Client Storage

### localStorage (`mcm_scores`)

Written by `exam.html saveResults()` and `nonlinear_exam_mvp.html`. Read by `index.html` dashboard.

```json
{
  "mcm-retake-practice-1": {
    "attempts": [
      {
        "score": 13,
        "total": 15,
        "pct": 87,
        "grade": 3,
        "timestamp": "2026-02-19T20:23:53.052Z"
      }
    ],
    "best": {
      "score": 13,
      "pct": 87,
      "grade": 3
    }
  }
}
```

Key format: `mcm-{exam_id}`. exam_id comes from the JSON file's `exam_id` field.

Grade thresholds (exam.html + all tests must match):
- Grade 4: pct >= 92
- Grade 3: pct >= 82
- Grade 2: pct >= 70
- Grade 1: pct < 70

### sessionStorage (`exam-autosave-{examId}`)

Written by `exam.html autosave()` every 800ms while exam is in progress. Read by `restoreAutosave()` on page load.

```json
{
  "rp1-q1_x": "4",
  "rp1-q2_parent": "quadratic",
  "rp1-q2_x1": "-3"
}
```

Key format: `exam-autosave-{examId}`. Cleared when user submits exam.

---

## Progress Story Card Data Flow (sw-11)

uildProgressStory() in index.html reads from mcm_scores (via getScores()) and the 	ests registry.

### Input

- 	ests[] — ordered registry array in index.html. Contains { id, name } for all exams.
- getScores() — reads localStorage.mcm_scores, returns { [examId]: ScoreEntry }.

### Score Entry Shape

`json
{
  "best": 93,
  "attempts": [
    { "pct": 87, "date": "2026-02-19" },
    { "pct": 93, "date": "2026-02-20" }
  ]
}
`

### Data Flow

1. Filter 	ests[] to entries that have scores[t.id] with at least 1 attempt.
2. Map to { label, pct } using ttempts[attempts.length - 1].pct (most recent score).
3. Take last 5 results (slice(-5)).
4. Compute diff = last.pct - first.pct across the 5-result window.
5. Render narrative: diff > +3 = improved, diff < -3 = dipped, else flat.
6. Show card if results >= 3. Hide if < 3 (not enough data for a story).

### Short Label Mapping

	.name.replace('Retake Practice #', 'RP').replace(/ \(.*\)$/, '')

Examples: "Retake Practice #1" -> "RP1", "Final Exam (Nov 23)" -> "Final Exam".

### Graceful Degradation

Full 	ry/catch around all logic. Any exception hides the card (card.style.display = 'none').
No localStorage writes -- read-only data consumer.
