# GP Field Glossary — RP JSON Schema Fields

Every field in `data/retake-practice-*.json` defined.

## Top-Level Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Human-readable exam name. Example: "Retake Practice 8" |
| `schema_version` | string | ✅ | Always `"2.0"`. Validated by `gp-schema-version-v2.test.js` |
| `version` | string | ✅ | Exam-specific version string, e.g. `"1.0"` |
| `questions` | array | ✅ | Array of Question objects |

## Question Object Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Unique within exam. Format: `"Q1"`, `"Q2"` etc. |
| `type` | string | ✅ | One of: `"numeric"`, `"multiple-choice"`, `"short-answer"`, `"graphing"` |
| `standard` | string | ✅ | Winter Tri standard code, e.g. `"W2.a"`, `"W3.b"` |
| `prompt` | string | ✅ | Question text shown to Kai |
| `answer` | number/string | ✅ | Correct answer. Numeric for numeric type, string for others |
| `tolerance` | number | ✅ (numeric) | Acceptable delta for numeric answers. Recommend 0.5+ for large values |
| `choices` | array | ✅ (MC) | Array of strings for multiple-choice options |
| `correct_choice` | number | ✅ (MC) | 0-indexed index into `choices` |
| `hint` | string | ✅ | Short hint shown after wrong answer. Max 20 words (ADHD rule) |
| `hint_2` | string | ❌ | Optional second hint for harder questions |
| `feedback_correct` | string | ✅ | Shown on correct answer. Max 12 words (ADHD rule) |
| `feedback_incorrect` | string | ✅ | Shown on wrong answer. Max 12 words (ADHD rule) |
| `solution_steps` | array | ❌ | Step-by-step solution walkthrough |
| `points` | number | ❌ | Point value for scoring (default 1 if absent) |
| `graph_data` | object | ❌ | Chart.js config for graphing questions |
| `image` | string | ❌ | Relative path to question image |

## Standards Codes (Winter Tri)

| Code | Topic |
|------|-------|
| W1.a | Linear systems — solving by substitution |
| W1.b | Linear systems — solving by elimination |
| W2.a | Quadratic factoring (AC method) |
| W2.b | Quadratic factoring (GCF/trinomial) |
| W2.c | Quadratic formula |
| W2.d | Write quadratic from vertex + point |
| W2.e | Quadratic applications |
| W3.a | Absolute value equations |
| W3.b | Radical equations |
| W3.c | Rational equations |
| W3.d | Exponential equations |
| W3.e | *Non-standard — verify with GR* |

## ADHD Rules (non-negotiable)

- `hint`: ≤ 20 words
- `feedback_correct`: ≤ 12 words
- `feedback_incorrect`: ≤ 12 words
- No period at end of feedback unless it reads naturally
- No em dashes in any string

---

*Owner: GP | Schema enforced by: `tests/f-validation/exam-json-schema.test.js`*
