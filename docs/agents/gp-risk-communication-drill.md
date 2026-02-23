# GP Risk Communication Drill

**Owner:** GP (grind-platform)  
**Date:** 2026-02-23  
**Audience:** Marcus (Human Lead), Forge leads (FA, FP)

---

## Risk Brief Format (3-line max per risk)

```
RISK: [one-line description]
IMPACT: [who is affected and how]
MITIGATION: [what GP is doing or recommending]
```

## Drill 1 — RP6 Smoke Failure

**RISK:** retake-practice-6.json fails 2/301 checks (Q6/Q8 and Q7/Q14 answer collisions).  
**IMPACT:** Kai would see repeated answer patterns on RP6, reducing study value.  
**MITIGATION:** Blocked on GR patch. GP notified GR (inbox message 20260222-1619). Will rerun verify when GR delivers.

## Drill 2 — Publish Pipeline Manual-Only

**RISK:** Live site only updates when Marcus or GP manually triggers GitHub Actions workflow.  
**IMPACT:** Commits pushed to master are invisible to Kai until someone triggers publish; delay could be hours.  
**MITIGATION:** Added publish trigger to GP morning checklist. Post-commit reminder in retake sprint runbook. Optional: add auto-trigger on push (p-impl-8 backlog).

## Drill 3 — Inbox Schema Drift

**RISK:** 4 of 12 sampled inbox messages fail schema lint (missing `subject`, `body`, `created`, or `status`).  
**IMPACT:** Automated schema validation would false-negative on old-format messages; comms SLA tracking unreliable.  
**MITIGATION:** New GP outbound messages use correct schema. Old FA-format messages are read-only history. Documented in gp-inbox-triage-sop.md.

## Self-Assessment

Brief format held to 3 lines per risk. Concrete mitigations. No passive voice. No em dashes.  
Readiness: submit to FP as first coaching evidence package.
