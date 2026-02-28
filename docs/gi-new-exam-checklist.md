# New Exam Checklist

Use this checklist every time a new RP exam arrives from GR. Follow these 5 steps in order. Do not send a green-light to GP until all 5 pass.

---

## Step 1: Validate Schema

```bash
node scripts/ci-data-gate.cjs --exam rp11
```

**What to look for:**
- `PASS` on all 5 gates
- Zero schema errors
- Zero contract errors

**Common issues on new exams:**
- `version` must be integer `2` (not string `"2.0"`)
- `schema_version` should be `"1.0"`
- Any new field must be in `data/schemas/practice-exam.schema.json` first
- Graph questions need `key_points`, `function_js`, `min_points`

---

## Step 2: Run Cross-Exam Uniqueness

```bash
node tests/cross-exam-verify.js
```

**What to look for:**
- Zero `[HARD]` failures
- Review any `[WARN]` near-miss lines (answers within ±1 of another exam same slot)

**If hard failures appear:**
- Use `node scripts/gi-answer-space-density.cjs` to find a safe replacement answer
- Coordinate with GR to change the answer, solution steps, and feedback
- Re-run until zero hard failures

---

## Step 3: Verify Concept Coverage

```bash
node scripts/concept-coverage.cjs
```

**What to look for:**
- Each standard at or above the threshold (5 questions)
- The new exam should close any open gaps

**Note:** W2.d will show BELOW THRESHOLD until RP11 ships. This is expected.

---

## Step 4: Run Property Tests

```bash
node tests/property/exam-question-count.test.js
node tests/property/exam-question-ids.test.js
node tests/property/exam-feedback-present.test.js
node tests/property/standard-field-valid.test.js
node tests/property/section-field-valid.test.js
node tests/property/exam-tolerance-positive.test.js
node tests/property/solution-steps-length.test.js
node tests/property/question-html-length.test.js
```

All must pass before proceeding.

Or run the full health check:
```bash
node scripts/gi-healthcheck.cjs
```

---

## Step 5: Send Green-Light to GP

Create a JSON message in `.agent-comms/grind/inbox-GP/`:

```json
{
  "id": "YYYYMMDD-HHMM-from-GI-rpNN-greenlight",
  "from": "GI",
  "to": "GP",
  "project": "Motor City Math",
  "type": "action",
  "priority": "normal",
  "subject": "RP11 data green-light: CI gate passing, ready to wire",
  "body": "RP11 has passed all 5 CI gate checks and all property tests. Cross-exam uniqueness: 0 hard failures. Concept coverage: W2.d now at 5/5. Ready to be added to exam manifest and dashboard. exam_id: rp11, filename: retake-practice-11.json",
  "created": "YYYY-MM-DDTHH:MM:SSZ",
  "status": "unread"
}
```

---

## Quick Reference

| Check | Command | Pass condition |
|-------|---------|----------------|
| Schema | `ci-data-gate.cjs --exam rpN` | 0 errors |
| Cross-exam | `cross-exam-verify.js` | 0 hard failures |
| Coverage | `concept-coverage.cjs` | all standards at threshold |
| Properties | `gi-healthcheck.cjs` | all PASS |
| Done | send GP green-light | GP wires to manifest |
