# GI Validation Guide

GI owns all data validators for Motor City Math. This guide explains what each validator checks, what failures mean, and how to fix them.

Target audience: GR (building new exams), GP (debugging CI), GA (debugging exam loading).

---

## CI Data Gate (`scripts/ci-data-gate.cjs`)

**Run:** `node scripts/ci-data-gate.cjs`

The master orchestrator. Runs all 5 validators in sequence. Exit 0 = all green. Exit 1 = at least one failure. Run this before every commit that touches `data/`.

Flags:
- `--exam rp5` — run fast-path on a single exam only (useful during development)

**What it runs:**
1. JSON Parse Check
2. Schema Validation
3. Contract Validation
4. Cross-Exam Uniqueness
5. Practice Exam Verification

---

## 1. JSON Parse Check

**What it checks:** Every `.json` file in `data/` is valid JSON (no syntax errors).

**Failure looks like:**
```
FAIL retake-practice-7.json — SyntaxError: Unexpected token at position 1234
```

**Fix:** Open the file, find line 1234, look for: missing comma, extra comma, unclosed bracket, or unescaped quote.

---

## 2. Schema Validation (`scripts/validate-exam-schema.cjs`)

**What it checks:** Each exam file matches `data/schemas/practice-exam.schema.json`. Uses AJV for strict validation.

**Common failures:**

| Error | Cause | Fix |
|-------|-------|-----|
| `/version: must be integer` | version stored as string `"2.0"` | Change to integer `2` |
| `must NOT have additional properties` | New field added to exam but not to schema | Add field to `practice-exam.schema.json` first |
| `/questions/0/type: must be equal to one of the allowed values` | Typo in type field | Must be one of: `identify`, `solve`, `graph`, `apply` |
| `/questions/0/inputs/0/type: must be equal to one of...` | Unknown input type | Must be: `number`, `text`, `dropdown`, `radio` |

**Fix pattern:** Add any new exam fields to schema BEFORE adding them to exam data. `additionalProperties: false` blocks unknown fields.

---

## 3. Contract Validation (`scripts/validate-exam-contract.cjs`)

**What it checks:** Business rules beyond JSON Schema:
- All required IDs present and non-empty
- Numeric answers not NaN/Infinity
- `plus_minus: true` questions have exactly 2 numeric inputs
- Graph questions have `key_points` with min entries
- Feedback strings non-empty

**Failure looks like:**
```
FAIL rp3 Q7: plus_minus=true but only 1 numeric input (need 2)
FAIL rp8 Q12: answer is NaN
```

**Fix:** Correct the data field directly in the exam JSON file, then re-run gate.

---

## 4. Cross-Exam Uniqueness (`tests/cross-exam-verify.js`)

**What it checks:** Two rules across all exams:

- **H-2 (Same standard, same answer):** Two questions with the same `standard` and identical numeric answer. These are "soft" warnings unless the answers appear in the same question-slot position across exams.
- **H-3 (Same slot, same answer):** Two questions in position N across different exams share the exact same answer. Hard failure. Kai can memorize position patterns.

**Hard failure:**
```
[HARD] rp5 Q4 vs rp9 Q4: same slot, same answer (9) — standard W2.b
```

**Fix:** Change one of the conflicting answers. Use `answer-space-density.cjs` to find a safe value for the standard. Update answer, key_points (if graph), solution_steps, and feedback_correct. Re-run gate.

**Near-miss warning (from near-collision-detector.cjs):**
```
[WARN] rp2 Q6 vs rp4 Q6: answers within ±1 (8 vs 9) — consider spreading further
```

This is advisory only. No action required but GR should note it.

---

## 5. Practice Exam Verification (`tests/verify-practice-exams.js`)

**What it checks:** Structural integrity of all exam files end-to-end:
- All questions have required fields
- `inputs` arrays are non-empty
- `hints` and `solution_steps` are non-empty arrays
- `standard` matches pattern `W[23].[a-e]`

**Failure:**
```
FAIL rp6 Q3: hints is empty array
FAIL rp9 Q11: standard "W4.a" does not match pattern
```

**Fix:** Fill in the missing data or correct the typo directly in the JSON file.

---

## Analytics Tools (non-blocking, for GR reference)

These run as separate scripts and do not block the CI gate:

### `scripts/concept-coverage.cjs`
Reports how many questions cover each standard. Flags standards below threshold (5 questions).
Expected: W2.d shows BELOW THRESHOLD until RP11 ships.

### `scripts/gi-answer-space-density.cjs`
Shows which integer answer values are already used for each standard. Use this before picking a new answer to avoid collisions.

### `scripts/check-set-freshness.cjs`
Flags exams with no attempts in a while. Advisory only.

---

## Quick Reference

```bash
# Full gate (required before merge)
node scripts/ci-data-gate.cjs

# Single exam fast-path
node scripts/ci-data-gate.cjs --exam rp7

# Find safe answer values for a standard
node scripts/gi-answer-space-density.cjs

# Check concept coverage
node scripts/concept-coverage.cjs

# Full health check
node scripts/gi-healthcheck.cjs
```

---

## Who to Contact

- **Schema questions:** GI
- **New exam data issues:** GR
- **CI gate infrastructure:** GP
- **Grading/GA integration:** GA
