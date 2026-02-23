# GP Spec: Retake Rules and RP11 Unlock

**Status:** PROPOSED  
**Author:** GP  
**Date:** 2026-02-23  
**Awaiting:** Marcus (go/no-go), GI (tracking implementation)

---

## Problem

As of RP10, there is no defined rule for when Kai unlocks a new practice exam. Marcus decides manually. This spec proposes explicit rules so GI can implement unlock tracking and the parent dashboard can display readiness.

---

## Retake Eligibility Rules

A student is eligible to take a retake exam if they:

1. Have completed the previous exam (submitted all auto-graded questions)
2. Scored below the mastery threshold on the previous exam

**Mastery Threshold:** 13/15 (87%) on a 15-question exam  
**Rationale:** Kai's A grade target is 90%+. 13/15 gives slight tolerance while maintaining pressure.

If Kai scores 13/15 or higher: exam is MASTERED. No retake needed.  
If Kai scores below 13/15: retake is UNLOCKED and RECOMMENDED.

---

## RP11 Unlock Triggers

RP11 unlocks when ANY of the following conditions are met:

| Trigger | Condition |
|---------|-----------|
| Score gate | RP10 score >= 13/15 |
| Attempt gate | RP10 attempted (any score) AND cumulative RP1-10 average >= 11/15 |
| Teacher override | Marcus manually sets unlock flag in localStorage |

**Implementation:** GI tracks unlock state in localStorage key `mcm-unlock-status` as:
```json
{
  "rp11_unlocked": false,
  "rp11_unlock_reason": null,
  "rp10_score": null,
  "cumulative_avg": null
}
```

---

## Score Thresholds Summary

| Score | Status | Next Action |
|-------|--------|-------------|
| 15/15 | Perfect | Celebrate. Show next exam. |
| 13-14/15 | Mastered | Show congratulations. Unlock next. |
| 10-12/15 | Good progress | Suggest retake. Show weak standards. |
| 7-9/15 | Needs review | Require retake. Show wrong-answer review. |
| < 7/15 | Struggling | Flag for Marcus. Show hint summary. |

---

## Copy Templates (ADHD-compliant, voice guide)

**Mastered (13-14/15):**  
"13/15. Strong work. Next exam unlocked."

**Perfect:**  
"15/15. Locked in. Kai's got this."

**Needs retake (10-12/15):**  
"10/15. Retake recommended. Three standards need work."

**Struggling (<7/15):**  
"5/15. Let's review. Check with Dad."

All copy: max 8 words per line. No "great effort" language. Results only.

---

## Out of Scope

- No server-side persistence (static HTML constraint)
- No automated email to Marcus (manual check of parent dashboard)
- Time-based unlocks (not applicable — Kai studies on his own schedule)
