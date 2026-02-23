# GP Failure Postmortem Practice

**Owner:** GP (grind-platform)  
**Date:** 2026-02-23  
**Scenario:** RP5 verify failures discovered post-push (real incident, 2026-02-22)

---

## Incident Summary

**What broke:** `retake-practice-5.json` failed `verify-practice-exams.js` with 292/294 — 2 checks failing.  
**Impact:** RP5 was pushed to origin but not yet published; Kai did not see a broken exam. Near-miss.  
**Detection:** GP ran verify after push during status check.

## Timeline

| Time (approx) | Event |
|----------------|-------|
| Prior session | RP5 v2 Q5/Q11 edits committed (3 local commits) |
| 2026-02-22 | GR filed RP8 collision report; GP identified RP5 was also failing |
| 2026-02-23 04:00 | GP pushed 3 commits to origin |
| 2026-02-23 04:02 | verify-practice-exams run: RP5 fails 292/294 |
| 2026-02-23 04:05 | Root causes identified: Q4/Q9 collision (both x=7), Q13 key_point wrong (-4.25 not -1.75) |
| 2026-02-23 04:15 | Both fixes applied; 3008/3008 pass; committed 64e674f and pushed |

## Root Causes

1. **Q4/Q9 collision:** Q4 equation `9^(x+2)=27^(x-1)` gives x=7, same as Q9. Uniqueness constraint failed. Prior editor did not cross-check answers across questions in the same exam.
2. **Q13 key_point arithmetic error:** Typed -4.25 instead of computing `5/(2-(-2))-3 = 1.25-3 = -1.75`. Manual entry without verification.

## What Worked

- Verify script catches both classes of error (uniqueness, key_point tolerance).
- GP ran verify before declaring exam Kai-ready.
- 3-line targeted edits only — no collateral changes.

## What to Improve

- Verify should run as a pre-commit hook for changes to `data/retake-practice-*.json`.
- GR should run verify after every question bank edit, not just spot-check.
- Key_point values should always be computed (or noted) in GR's working notes, not eyeballed.

## Action Items

| ID | Action | Owner |
|----|--------|-------|
| PM3-1 | Add `data/retake-practice-*.json` to pre-commit verify trigger | GP |
| PM3-2 | GR working notes must include computed key_point values | GR |
| PM3-3 | Cross-exam verify runs in same gate as within-exam verify | GP (already in runbook) |
