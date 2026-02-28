# GI Analytics Guide

What each GI analytics script produces, how to interpret its output, and when to run it.

All scripts live in `scripts/`. Artifacts are saved to `artifacts/`.

---

## `gi-healthcheck.cjs` — Single-Command Health Check

**When to run:** Start of day. After any data change.

```bash
node scripts/gi-healthcheck.cjs
```

Runs all GI tools (CI gate, cross-exam verify, practice exam verify, concept coverage, score velocity, QA summary, answer space density, question type distribution, OCR confidence tests) and reports PASS/WARN/FAIL with timing per tool.

Exit 0 = all green (or only expected warnings). Exit 1 = hard failure.

**Expected WARNs:**
- Score velocity: no score data yet is expected
- Concept coverage: W2.d BELOW THRESHOLD until RP11 ships

---

## `ci-data-gate.cjs` — CI Data Gate

**When to run:** Before every commit to `data/`.

```bash
node scripts/ci-data-gate.cjs
# Or single exam:
node scripts/ci-data-gate.cjs --exam rp7
```

See `docs/gi-validation-guide.md` for full detail on each gate.

---

## `concept-coverage.cjs` — Standard Coverage

**When to run:** After each new exam is added.

```bash
node scripts/concept-coverage.cjs
```

**Output:** Bar chart per standard. ABOVE/AT/BELOW THRESHOLD per standard.

**Thresholds:** 5 questions per standard minimum.

**Interpreting:**
- `W2.d: ████░░ 4/5 BELOW THRESHOLD` → RP11 needs a W2.d question
- `W3.b: ████████ 34 questions` → heavily covered, GR can skip W3.b for a few exams

---

## `gi-answer-space-density.cjs` — Answer Space Density

**When to run:** Before GR designs a new exam. When a collision is detected.

```bash
node scripts/gi-answer-space-density.cjs
```

**Output:** Per-standard table showing:
- `Used`: count of distinct integer answers already in use
- `Coverage%`: fraction of the range [-20..50] already occupied
- `Free values`: first 10 safe integers GR can use

**Interpreting:**
- `W3.b: 29 used, 40.8%` → getting crowded. Prefer values outside the common range.
- `W2.a: 8 used, 11.3%` → plenty of room. Any standard 1-30 value is likely safe.

Artifacts saved to `artifacts/answer-space-density.json`.

---

## `gi-question-type-distribution.cjs` — Question Type Breakdown

**When to run:** After adding a new exam. Monthly check.

```bash
node scripts/gi-question-type-distribution.cjs
```

**Output:** Per-exam breakdown of `identify`, `solve`, `graph`, `apply` question types, plus per-section totals.

**Interpreting:**
- `solve: 0` across all exams → type label not yet used; all solving is done under other types
- `graph: 2` per exam is the target; RP11 at 1 graph question (gap)
- Section B should have the most questions (concept solving)

Artifacts saved to `artifacts/question-type-distribution.json`.

---

## `score-velocity.cjs` — Score Trend

**When to run:** After Kai completes any exam.

```bash
node scripts/score-velocity.cjs
```

**Output:** Per-standard velocity (improving/declining/flat), overall trajectory.

**Interpreting:**
- `W3.b: +12 pts (improving)` → Kai is mastering exponential functions
- `W2.d: -5 pts (declining)` → needs more practice, check if W2.d question is clear
- `Overall: improving (3 standards up)` → good sign

No score data yet = expected warning. Script exits 0 and prints placeholder message.

---

## `compute-item-difficulty.cjs` — Item Difficulty

**When to run:** After accumulating 3+ attempts per exam.

```bash
node scripts/compute-item-difficulty.cjs
```

**Output:** Per-question p-value (% correct), per-exam difficulty ranking.

**Interpreting:**
- `p=0.90` (90% correct) → easy question, good for confidence
- `p=0.30` (30% correct) → hard question, likely needs better hint or clearer wording
- `p=0.00` → never got it right, escalate to GR for review

---

## `build-qa-summary.cjs` — QA Summary

**When to run:** After adding or modifying any exam.

```bash
node scripts/build-qa-summary.cjs
```

**Output:** Per-exam health report. Missing fields, empty arrays, schema issues.

Current baseline: 10/10 exams clean (0 missing fields).

Artifacts saved to `artifacts/qa-summary.json` and `artifacts/qa-summary.md`.

---

## `check-set-freshness.cjs` — Set Freshness

**When to run:** Weekly.

```bash
node scripts/check-set-freshness.cjs [--stale-days 7]
```

**Output:** Flags exams with 0 attempts that are older than the threshold.

**Interpreting:**
- Stale with 0 attempts → Kai hasn't seen this exam. Suggest to Marcus.
- Active with recent attempts → normal, no action needed.

---

## Quick Reference

| Script | Command | Purpose |
|--------|---------|---------|
| Health check | `gi-healthcheck.cjs` | One-shot all-green check |
| CI gate | `ci-data-gate.cjs` | Required before merge |
| Coverage | `concept-coverage.cjs` | Gap tracking |
| Answer space | `gi-answer-space-density.cjs` | Safe answer picker |
| Type dist | `gi-question-type-distribution.cjs` | Exam structure |
| Difficulty | `compute-item-difficulty.cjs` | Kai struggle points |
| Score trend | `score-velocity.cjs` | Progress tracking |
| QA summary | `build-qa-summary.cjs` | Data health |
| Freshness | `check-set-freshness.cjs` | Stale exam detection |
