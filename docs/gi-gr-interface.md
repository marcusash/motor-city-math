# GI-GR Interface

What GI needs from GR for each new exam. GR reads this before building RP12+. GI reads this when reviewing incoming exam data.

---

## What GR Provides

For each new exam, GR delivers a JSON file (`data/retake-practice-N.json`) that must meet all of these requirements before GI can issue a CI green-light.

---

## Required Fields (top-level)

| Field | Type | Value |
|-------|------|-------|
| `exam_id` | string | `"rp12"` (sequential) |
| `title` | string | e.g. `"Retake Practice 12"` |
| `version` | integer | `2` (not string "2.0") |
| `schema_version` | string | `"1.0"` |
| `questions` | array | exactly 15 questions |

Optional but recommended: `subtitle`, `time_minutes`, `created`, `created_by`.

---

## Question Requirements

Each question must have:

| Field | Value |
|-------|-------|
| `number` | 1-15 sequential, no gaps |
| `standard` | matches `W[23].[a-e]` |
| `section` | `A`, `B`, `C`, or `D` |
| `type` | `identify`, `solve`, `graph`, or `apply` |
| `question_html` | 15+ characters |
| `hint` | non-empty string, unique within exam |
| `solution_steps` | array with 3+ entries |
| `inputs` | array with 1+ entries |
| `feedback_correct` | non-empty string |
| `feedback_wrong` | non-empty string (RP8+ unified format) |

---

## Input Requirements

Each input must have:

| Field | Value |
|-------|-------|
| `id` | unique string within the exam (e.g. `"q1a"`, `"q1b"`) |
| `label` | non-empty string |
| `type` | `number`, `text`, `dropdown`, or `radio` |
| `answer` | number or string (not null, not NaN) |
| `tolerance` | positive number (if `type: "number"`) |
| `options` | array of unique strings (if `type: dropdown/radio`) |

---

## Answer Uniqueness (Cross-Exam Rules)

This is the most important constraint. Before choosing an answer value:

1. **Check `artifacts/answer-space-density.json`** — shows which integer values are already used for each standard.
2. **Check `tests/cross-exam-verify.js`** — run after building the exam to confirm 0 hard failures.

**Hard rule (H-3):** If question N in the new exam has the same integer answer as question N in any existing exam, that is a hard failure. Kai can memorize position patterns.

**Advisory (H-2):** Same standard + same answer in different positions is a soft warning. Try to avoid.

**Near-miss advisory:** Answers within ±1 of same-slot answers should be noted but are not blocking.

---

## Safe Answer Selection

Use this process when picking integer answers:
1. Identify the standard (e.g. W3.b)
2. Look at `answer-space-density.json` for `W3.b.free_in_range` — these values are safe from H-2
3. Also check that the value isn't used in the same question slot across existing exams
4. Prefer values > 10 or < -5 for most standards (middle range is crowded)

---

## Graph Questions

If the question type is `graph`, the question must also include a `graph` object:

```json
"graph": {
  "function_js": "Math.sqrt(x - 2)",
  "function_display": "f(x) = √(x − 2)",
  "key_points": [[2, 0], [3, 1], [6, 2], [11, 3]],
  "min_points": 3,
  "x_range": [-2, 14],
  "y_range": [-2, 6]
}
```

Key points must lie on the function: verify `f(key_point[0]) ≈ key_point[1]` within tolerance.

---

## What GI Does After Receiving the Exam

1. Runs `ci-data-gate.cjs --exam rpN` — schema + contract validation
2. Runs `cross-exam-verify.js` — 0 hard failures required
3. Runs `concept-coverage.cjs` — checks that new exam closes any open gap
4. Runs all property tests
5. If all pass: sends GP green-light message in `.agent-comms/grind/inbox-GP/`
6. If any fail: sends GR a correction list in `.agent-comms/grind/inbox-GR/`

---

## Turnaround SLA

GI targets same-day review. If corrections are needed, GI sends a specific list of exactly what to fix — GR does not need to re-run all checks, just fix the listed items and resubmit.
