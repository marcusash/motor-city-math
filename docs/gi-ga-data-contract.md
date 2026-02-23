# GI-GA Data Contract — Practice Exam JSON to exam.html Renderer

**Version:** 1.0
**Date:** 2026-02-23
**Authored by:** GI (Data Engineer)
**Consumers:** GA (Application Engineer) via exam.html
**Producers:** GR (Research Specialist) via data/retake-practice-N.json

---

## Purpose

This document is a consumer-driven contract. It lists every JSON field that GA's `exam.html`
renderer reads from a practice exam JSON file. GR MUST NOT remove or rename any of these
fields without a version bump and GA alignment. GI will flag schema violations in CI.

---

## Contract Fields

### Top-Level Exam Object

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `exam_id` | string | YES | Must match filename without .json. Used for localStorage key. |
| `title` | string | YES | Displayed in page header. |
| `subtitle` | string | YES | Displayed below title. |
| `time_minutes` | integer | NO | Sets `data-time-minutes` HTML attribute. |
| `questions` | array | YES | Must have exactly 15 items. |

Fields NOT read by exam.html: `created`, `created_by`, `purpose`. These are metadata for GI/GR use only. Safe to add or remove without GA coordination.

---

### Question Object (`questions[n]`)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | YES | Used for card IDs, hint element IDs, feedback element IDs, scoring key. |
| `number` | integer | YES | Displayed in question card header. |
| `standard` | string | YES | Displayed in standards badge. Used for section scoring breakdown. |
| `question_html` | string | YES | Inner HTML of question container. May include LaTeX (\\(...\\)). |
| `inputs` | array | YES | Min 1 item. Drives all answer input rendering. |
| `hint` | string | YES | Shown after first wrong attempt. |
| `solution_steps` | array | YES | Array of strings. Each rendered as `<p>` tag. Shown after max attempts. |
| `feedback_correct` | string | NO | Shown on correct answer. Default used if missing. Max 12 words (ADHD). |
| `feedback_wrong` | string | NO | Shown on wrong answer (single-input questions). |
| `feedback_wrong_parent` | string | NO | Shown when parent-function input is wrong (identify questions). |
| `feedback_wrong_intercepts` | string | NO | Shown when intercept inputs are wrong (identify questions). |
| `plus_minus` | boolean | NO | If true, two number inputs are interchangeable. |
| `graph` | object | NO | Required when `type` is `graph` or `graph-rational`. |

Fields NOT read by exam.html: `type`, `section`. These are used only by validation scripts (GI) and curriculum design (GR). Safe for GR to change without GA coordination.

---

### Input Object (`questions[n].inputs[m]`)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | YES | Maps to HTML `<input id="...">`. Must be unique within the page. |
| `type` | string | YES | One of: `number`, `dropdown`, `text`, `radio`. Controls rendering. |
| `label` | string | NO | Text label rendered next to input. |
| `answer` | string or number | YES | Correct answer. String for dropdown/text, number for numeric. |
| `tolerance` | number | NO | Accepted error margin for number inputs. Default: 0.01. |
| `options` | array | Conditional | Required when `type` is `dropdown` or `radio`. |

#### Option Object (within `inputs[m].options`)

For `dropdown`: each option is a string.
For `radio`: each option is an object `{ value: string, text: string }`.

---

### Graph Object (`questions[n].graph`)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `canvas_id` | string | YES | HTML canvas element ID (e.g., `graphQ12`). |
| `function` | string | YES | JavaScript expression for f(x). Evaluated with `Math.*` in scope. |
| `function_display` | string | NO | Human-readable function for display. Not executed. |
| `key_points` | array | YES | Array of `[x, y]` pairs. Used to verify graph correctness. |
| `min_points` | integer | NO | Minimum key_points that must pass. Default: 5. |
| `tolerance` | number | NO | Acceptable y-error when checking key_points. Default: 0.25. |
| `asymptotes` | object or null | NO | `{ vertical: [x, ...], horizontal: [y, ...] }`. RP1-5 format. |
| `x_range` | array | NO | `[min, max]`. Graph x-axis display range. RP6+ format. |
| `y_range` | array | NO | `[min, max]`. Graph y-axis display range. RP6+ format. |

---

## Breaking Changes Policy

A **breaking change** is any modification to a required field that would cause exam.html to:
- Fail to render a question (undefined read error)
- Display incorrect feedback
- Accept wrong answers as correct
- Reject correct answers

### What constitutes a breaking change:

- Renaming a required field (e.g., `question_html` → `question_text`)
- Removing a required field
- Changing the type of `answer` from number to string (or vice versa) without updating tolerance
- Changing `inputs[m].id` (breaks localStorage score keys)
- Changing `exam_id` (breaks localStorage exam key, score history)

### What is NOT a breaking change:

- Adding a new optional field (`x_range`, `y_range`, new metadata)
- Changing `type`, `section`, `created`, `created_by`, `purpose`
- Changing `feedback_correct`, `feedback_wrong` text (cosmetic)
- Adding more `solution_steps` strings
- Changing `hint` text

---

## Contract Validation

GI's `scripts/validate-exam-schema.cjs` validates all required fields from this contract on
every CI run. If GR introduces a breaking change, the schema validator will fail before the
exam reaches Kai.

Current validation coverage:
- All required top-level fields: YES
- All required question fields: YES
- All required input fields: YES
- All required graph fields: YES
- Field type checks (string/number/array): YES
- Pattern checks (exam_id format, standard format): YES
- Enum checks (section, input type, question type): YES

Gaps in current validation:
- `inputs[m].id` uniqueness across questions: NOT CHECKED (runtime only)
- `canvas_id` uniqueness across questions: NOT CHECKED
- `answer` type consistency with `input.type`: NOT CHECKED

---

*GI (Data Engineer), 2026-02-23. Review with GA before any schema addition.*
