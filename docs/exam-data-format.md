# Motor City Math — Exam Data Format

**Owner:** GR (Research Specialist), GP (Platform Engineer)
**Schema version:** 1.0
**Last updated:** 2026-02-24

---

## Overview

Each exam is a JSON file in `data/`. The filename (without `.json`) is the `exam_id`, also the query parameter used to load it: `exam.html?file={exam_id}`.

---

## Top-Level Fields

```json
{
  "exam_id": "retake-practice-6",
  "schema_version": "1.0",
  "title": "Unit 2 Retake Practice — W2.b Intercept Drill",
  "subtitle": "Standards W2 & W3 · 15 Questions · ~60 min",
  "time_minutes": 60,
  "created": "2026-02-22",
  "created_by": "GR",
  "purpose": "Purpose statement for agents, not displayed to Kai.",
  "questions": [ ... ]
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `exam_id` | string | Yes | Must match filename (no `.json`) |
| `schema_version` | string | Yes | Currently `"1.0"` |
| `title` | string | Yes | Shown in exam header |
| `subtitle` | string | Yes | Shown below title |
| `time_minutes` | number | Yes | Timer length. Must be integer > 0 |
| `created` | string | Yes | ISO date `YYYY-MM-DD` |
| `created_by` | string | Yes | Agent ID (e.g., `"GR"`) |
| `purpose` | string | Yes | Internal note for agents |
| `questions` | array | Yes | 15 questions |

---

## Question Fields

Each question object has the following structure:

```json
{
  "id": "rp6-q1",
  "number": 1,
  "section": "A",
  "standard": "W2.b",
  "type": "identify",
  "question_html": "Find the x-intercepts: \\( f(x) = 2(x-3)^2 - 8 \\)",
  "inputs": [ ... ],
  "plus_minus": true,
  "hint": "Set f(x)=0 and solve.",
  "solution_steps": [ "Step 1...", "Step 2..." ],
  "feedback_correct": "🔥 Intercepts nailed.",
  "feedback_wrong": "Set f=0: 2(x-3)^2=8 → x=1 or 5.",
  "feedback_wrong_parent": "Check the exponent for parent type.",
  "feedback_wrong_intercepts": "Parent right. Set f(x)=0 and solve."
}
```

### Required Fields

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Format: `{exam_id_prefix}-q{number}` e.g. `rp6-q1` |
| `number` | integer | 1-based question number |
| `section` | string | `"A"`, `"B"`, or `"C"` |
| `standard` | string | e.g. `"W2.b"`, `"W3.a"` |
| `type` | string | See Question Types below |
| `question_html` | string | HTML + LaTeX (`\\(` ... `\\)`) |
| `inputs` | array | At least 1 input |
| `hint` | string | Layer 1 hint text (max 120 chars) |
| `solution_steps` | array | 3-6 strings, each ≤ 120 chars |
| `feedback_correct` | string | Max 80 chars, celebratory tone |
| `feedback_wrong` | string | Max 120 chars, shows correct answer |

### Optional Fields

| Field | Type | Notes |
|-------|------|-------|
| `plus_minus` | boolean | If `true`, grader accepts both ±answer for intercept pairs. Use when a quadratic has two symmetric roots. |
| `feedback_wrong_parent` | string | Only shown when parent function input is wrong (used with `type: "identify"`) |
| `feedback_wrong_intercepts` | string | Only shown when parent is correct but intercepts wrong |
| `explanation` | string | Extended explanation shown in game plan section (reserved for future use) |

---

## Question Types

| Type | Description | Input pattern |
|------|-------------|---------------|
| `identify` | Identify parent function + find intercepts | dropdown (parent) + number inputs (intercepts) |
| `multiple_choice` | MC with 4 options | mc input, `options` array |
| `numeric` | Single numeric answer | number input with tolerance |
| `graph` | Plot points on canvas | canvas input (see Canvas section) |
| `free_response` | Text answer | text input |

---

## Input Fields

Each input in the `inputs` array:

```json
{
  "id": "q1_parent",
  "type": "dropdown",
  "label": "Parent function",
  "options": ["quadratic", "cubic", "absolute value", "square root", "rational", "exponential"],
  "answer": "quadratic"
}
```

```json
{
  "id": "q1_x1",
  "type": "number",
  "label": "x₁ =",
  "answer": 1,
  "tolerance": 0.1
}
```

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Unique within exam. Format: `q{N}_{descriptor}` |
| `type` | string | `"number"`, `"text"`, `"dropdown"`, `"mc"`, `"canvas"` |
| `label` | string | Shown next to input |
| `answer` | number or string | Expected answer |
| `tolerance` | number | Optional. Numeric answers: absolute tolerance (default 0.05) |
| `options` | array | Required for `dropdown` and `mc` type |

### Number inputs
- `answer` must be a number (not a string)
- `tolerance` defaults to `0.05` if absent
- Leading/trailing whitespace, `$`, `,` are stripped before comparison

### Dropdown inputs
- `options` is a string array
- `answer` must exactly match one option (case-insensitive comparison)

### MC inputs
- `options` is a 4-element string array
- `answer` must be the correct option text (not an index)

---

## Canvas (Graph) Questions

Graph questions use a `canvas` input type. The question JSON specifies:

```json
{
  "id": "q12_graph",
  "type": "canvas",
  "canvas_id": "graphCanvas12",
  "label": "Plot the key points",
  "answer_points": [[0, 3], [1, 5], [-1, 5]],
  "tolerance": 0.5,
  "x_axis_label": "x",
  "y_axis_label": "f(x)",
  "x_range": [-5, 5],
  "y_range": [-2, 10]
}
```

The canvas renderer draws a grid and accepts click/keyboard input to place points. Points within `tolerance` of the answer coordinates are accepted.

---

## LaTeX Conventions

- Use `\\(` and `\\)` delimiters (double-escaped for JSON): `"\\( f(x) = x^2 \\)"`
- Avoid `\\[` block display — inline only
- Use `\\frac{}{}` for fractions, `\\sqrt{}` for radicals
- Arrows: `\\rightarrow`, subscripts: `x_1`, superscripts: `x^2`
- Em dashes are banned. Use colons or commas.

---

## manifest.json

`data/manifest.json` lists all practice exams available to the picker and dashboard:

```json
{
  "exams": [
    { "id": "retake-practice-1", "label": "Practice 1", "active": true },
    ...
  ]
}
```

`"active": false` hides an exam from the picker without deleting the file.

---

## File Naming

| File | Pattern | Example |
|------|---------|---------|
| Practice exams | `retake-practice-{N}.json` | `retake-practice-6.json` |
| Real exams | descriptive slug | `final_exam_251123.json` |
| Microdrill | descriptive slug | `w2b-microdrill.json` |

---

## Adding a New Exam

1. Create `data/retake-practice-{N}.json` following this format
2. Add to `data/manifest.json`
3. Run `node tests/verify-practice-exams.js` — must pass all checks
4. Run `node tests/cross-exam-verify.js` — 0 hard failures
5. Run `node tests/gp-no-duplicate-answers-per-exam.test.js` — no collisions within the exam
6. Wire into `index.html` dashboard `tests[]` array
7. GR signs off on math accuracy before marking active
