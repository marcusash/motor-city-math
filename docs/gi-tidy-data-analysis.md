# GI: Tidy Data Analysis — MCM Data Violations

**From:** GI (Data Engineer)
**Date:** 2026-02-23
**Reference:** Hadley Wickham, "Tidy Data" (2014), Journal of Statistical Software
**GI learning plan task 9**

---

## What Tidy Data Means

Wickham's rule: every dataset has one row per observation, one column per variable, and one table per observational unit. Violations cause analysis bugs that are silent — they produce wrong answers, not error messages.

---

## Violation 1: Multiple Exam Schemas Coexist in One Corpus

**Tidy rule broken:** Each observational unit (exam question) should have the same structure.

**What MCM does:** The schema-compat tool (T16) reveals two question schemas across 10 exams:

- RP1-7: `feedback_correct` + `feedback_wrong_parent` + `feedback_wrong_intercepts` + optional `plus_minus`
- RP8-10: `feedback_wrong` (unified) + `inputs[].tolerance` + no `plus_minus`

**Why this is a problem:** Any script that reads `q.feedback_correct` works on RP1-7 but produces `undefined` on RP8-10. Any analysis that counts how many questions have feedback will overcount for RP1-7 (3 feedback fields) and undercount for RP8-10 (1 field). This is silent — no crash, just wrong data.

**Fix:** Define one canonical question schema (done: `data/schemas/practice-exam.schema.json`) and migrate all exams to it. The `add-schema-version.cjs` migration script is the pattern to follow. A single migration to unify all feedback fields to `feedback_wrong` would resolve this.

---

## Violation 2: Score Data Conflates Observations Across Sessions

**Tidy rule broken:** One row per observation. Each score file is one snapshot of cumulative state, not one row per session.

**What MCM does:** `kai-scores-2026-02-22.json` contains ALL exams Kai has ever sat (RP1 through RP4), not just Feb 22's session. The `exported` timestamp says when the file was written, but there's no `session_date` per exam. GI cannot determine whether Kai's RP1 score (13/15) was achieved on Feb 19 or re-recorded on Feb 22.

**Why this is a problem:** If Kai sits RP1 again and scores 15/15, the new save overwrites the old `mcm-retake-practice-1` key. GI would see only the most recent score. The learning trajectory (47% → 13/15 → 15/15) collapses to (47% → 15/15) — masking the intermediate attempt. `score-velocity.cjs` would show a steeper improvement curve than reality.

**Fix:** Score files should store an array of attempts per exam, not just the latest. Or: capture the date each attempt was made. The attempt-log schema (`data/schemas/attempt-log.schema.json`) addresses this at the event level, but even the summary score format needs a `session_date` or `attempts: []` array.

---

## Violation 3: Graph Metadata Is Denormalized Differently Across Exams

**Tidy rule broken:** One column per variable — consistent encoding.

**What MCM does:** RP1-7 graph questions use `graph.asymptotes` (an object with `vertical` and `horizontal` keys, or null). RP8-10 use `graph.x_range` + `graph.y_range` arrays (viewport bounds, not asymptote values). These encode different concepts under the same `graph` key. A script trying to extract asymptotes from all exams would silently get null/undefined for RP8-10.

**Why this is a problem:** Any GI analytics script that processes graph metadata must branch on which schema version it's looking at, or it will produce wrong results for half the exams. There is no machine-readable signal for which format a file uses (until `schema_version` is populated).

**Fix:** Standardize on one graph schema. Either: (a) all exams use `graph.asymptotes` + `graph.viewport: {x_range, y_range}`, or (b) split into two separate fields and mark them clearly. Document which schema each exam uses — exactly what `schema_version` enables.

---

## Summary

| Violation | Impact | Fix |
|---|---|---|
| Multiple question schemas (feedback fields) | Silent wrong counts in analytics | Migrate all exams to unified feedback field |
| Score data overwrites (no attempt history) | Learning trajectory loss on retakes | Add `attempts: []` array to score format |
| Graph metadata encoding mismatch | Silent null/undefined in graph analytics | Standardize graph schema, use schema_version |

All three violations are fixable with the tooling GI already built (`add-schema-version.cjs`, `migrate-data-safe.cjs`, `attempt-log.schema.json`). The gap is coordination with GR (data producer) and GA (data consumer) to agree on one canonical format.
