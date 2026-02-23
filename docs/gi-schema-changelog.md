# GI Schema Changelog

History of all `data/schemas/practice-exam.schema.json` changes.
Owned by GI. Each entry includes: date, change, reason, and affected exams.

---

## v1.0.2 — 2026-02-23

**Change:** All exam `version` fields migrated from string `"2.0"`/`"1.0"` to integer `2`.

**Reason:** Schema defines `version` as `type: integer`. All exam files were storing it as a string, causing silent type mismatch (not caught by validator because `version` is optional). Fixed by migration script across all 11 exam files.

**Affected exams:** RP1 through RP11.

**Commit:** 67ae033

---

## v1.0.1 — 2026-02-23

**Change:** Added `schema_version` field (`"1.0"`) to all 10 exam files (RP1-10). RP11 included at creation.

**Reason:** Track which version of the JSON Schema a file targets. Allows future schema changes to declare compatibility. Filed as T21 in GI learning plan.

**Schema entry added:**
```json
"schema_version": { "type": "string", "pattern": "^\\d+\\.\\d+$" }
```

**Affected exams:** RP1 through RP10 (RP11 included `schema_version` at creation).

**Commit:** Added during GI sprint 2.

---

## v1.0.0 — 2026-02-17 (Initial)

**Initial schema definition.** Fields defined:

| Field | Type | Required |
|-------|------|----------|
| exam_id | string | Yes |
| title | string | Yes |
| subtitle | string | No |
| version | integer | No |
| schema_version | string | No |
| time_minutes | integer | No |
| created | string (date) | No |
| created_by | string | No |
| questions | array | Yes |

**Question fields:**
- `number` (integer, required)
- `standard` (string, pattern W[23].[a-e], required)
- `section` (enum: A/B/C/D, required)
- `type` (enum: identify/solve/graph/apply, required)
- `question_html` (string, required)
- `hints` (array of strings, required)
- `solution_steps` (array of strings, required)
- `inputs` (array, required)
- `feedback_correct` (string, required)
- `feedback_wrong` (string, optional — unified format for RP8+)
- `feedback_wrong_parent` / `feedback_wrong_intercepts` (strings, optional — split format for RP1-7)
- `plus_minus` (boolean, optional)
- `graph` (object, optional — for graph questions)

**Input fields:**
- `id` (string, required)
- `label` (string, required)
- `type` (enum: number/text/dropdown/radio, required)
- `answer` (number or string, required)
- `tolerance` (number, optional — for numeric inputs)
- `options` (array, optional — for dropdown/radio)

**Graph spec fields (optional object):**
- `function_js` (string, required if graph present)
- `function_display` (string, optional)
- `key_points` (array of [x,y] pairs, required if graph present)
- `min_points` (integer, optional, default assumed 3)
- `asymptotes` (object with `vertical`/`horizontal` arrays, optional)
- `x_range` / `y_range` (RP6+ format, optional)

**`additionalProperties: false`** at root — all fields must be explicitly listed in schema.

---

## FR Approval fields — 2026-02-22

**Change:** Added FR review fields to track faculty/mentor sign-off on answer keys.

**Schema entries added:**
```json
"fr_approved":       { "type": "boolean" }
"fr_approved_date":  { "type": "string" }
"fr_approval_notes": { "type": "string" }
```

**Current state:** Only RP5 has `fr_approved: true`. RP1-4 and RP6-11 omit the field (schema allows absence).

---

## Notes

- `additionalProperties: false` means every new field MUST be added to schema before adding to exam data.
- Schema version is tracked via `schema_version` field in each exam file.
- The schema file itself does not embed a version number — use this changelog.
- All changes must pass `node scripts/ci-data-gate.cjs` before commit.
