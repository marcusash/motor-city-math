# GF Queue Auto-Refill Rule

**Owner:** GF (Quality Lead, Grind org)  
**Audience:** FO (Forge Operations / queue manager)  
**Version:** 1.0 — 2026-02-23

---

## Purpose

FO checks GF's inbox queue every 2 hours in autonomous mode. This document defines:
1. **When** to refill
2. **What** tasks to add
3. **Priority and lane rules**
4. **How to write the JSON** to match GF's inbox schema

---

## Trigger Threshold

| Condition | Action |
|-----------|--------|
| Fewer than 10 tasks in `inbox-GF/` with `status: "unread"` | Refill to 12 tasks |
| Fewer than 5 unread tasks | Immediate refill: add 8 tasks |
| 0 unread tasks | URGENT refill: add 12 tasks, flag as priority |

Check via:
```powershell
(Get-ChildItem ".agent-comms\grind\inbox-GF\" -Filter "*.json" |
  ForEach-Object { (Get-Content $_ | ConvertFrom-Json).status } |
  Where-Object { $_ -eq "unread" }).Count
```

---

## Three Lanes

GF works in **3 lanes simultaneously**. Each refill batch must include tasks from all 3 lanes.

### Lane 1: Delivery (must ship)
Core QA work that directly protects Kai's learning experience.

Priority backlog (in order):
1. Dad View data isolation test (`_dadScores` vs `_kaiScores` scope guard)
2. Hint display contract (120-char limit in 300px container)
3. SRS scheduling correctness (`mcm_srs` ease factors, interval math)
4. Import version field validation (currently only checks `mcm_scores`, not `version`)
5. Streak counter edge cases (midnight rollover, timezone)
6. Print layout contract (no truncation, no overflow at 8.5x11)
7. Arena mode toggle guard (explicit list of pages that must have toggle)
8. Error state matrix: update for post-FA-takeover page set
9. Offline audit: fix to handle redirects gracefully
10. responsive-audit: update viewport list to match GD's current breakpoints

### Lane 2: Improvement (makes GF better)
Process, tooling, and infrastructure work.

Priority backlog:
1. Update `regression-baseline.json` after any test fix (re-capture)
2. Pre-commit hook installation (`cp tests/f-validation/pre-commit-hook.sh .git/hooks/pre-commit`)
3. Add inline-script-syntax-check to `pre-commit-check.js`
4. Console error filter in design-qa.spec.js (add Chart.js deprecation to allowlist)
5. SIZE_TOLERANCE tighten: 1.5px → 0.5px once GD locks type scale
6. Arena mode: add explicit "must have toggle" list check
7. Weekly snapshot of runtime-profile.json (track drift over time)
8. Add `node tests/release-readiness-check.js` step to publish-runbook.md

### Lane 3: Skill (personal growth, FF Staff-readiness)
Tests that demonstrate proactive gap discovery.

Priority backlog:
1. Dad View isolation test (predicted gap #3 from coaching rubric)
2. Hint rendering test (predicted gap #4)
3. SRS interval test (predicted gap #5)
4. Export version sentinel (import won't detect v2 schema mismatch)
5. Multi-student localStorage collision guard
6. KaTeX rendering failsafe (fallback to plain text on render error)
7. Chart.js null data guard (empty dataset crashes chart init)
8. Seed entropy test (all 9 RP exam_ids produce unique seeds — extend to 50 hypotheticals)

---

## Refill JSON Template

Write task messages as JSON files to `.agent-comms/grind/inbox-GF/`.

Filename format: `YYYYMMDD-HHMM-from-FO-{slug}.json`

```json
{
  "id": "gf-{lane}-{N}",
  "from": "FO",
  "to": "GF",
  "project": "grind",
  "type": "task",
  "priority": "normal",
  "subject": "[GF-{LANE}-{N}] Short title",
  "body": "Build a Node.js static test suite in tests/f-validation/ that verifies...\n\nAcceptance: X/X checks pass. Commit with message qa(gf): ...",
  "files": [],
  "created": "2026-02-23T00:00:00Z",
  "status": "unread"
}
```

Lane prefixes for `id`:
- `gf-delivery-N` (Lane 1)
- `gf-improvement-N` (Lane 2)
- `gf-skill-N` (Lane 3)

---

## Balancing Rules

Each refill batch of 8-12 tasks should follow this lane split:

| Total Tasks | Delivery | Improvement | Skill |
|-------------|----------|-------------|-------|
| 8 tasks | 4 | 2 | 2 |
| 10 tasks | 5 | 3 | 2 |
| 12 tasks | 5 | 4 | 3 |

Adjust if Marcus has flagged a specific lane as urgent.

---

## What NOT to Refill

Do not add tasks that:
- Require Playwright/browser (win-arm64 canvas build is blocked — GP owns)
- Require write access to `.agent-comms/forge/` (GP owns)
- Duplicate existing `in_progress` or `done` SQL todos
- Are too vague to produce a committed test file

---

## Completion Signals

GF marks a task complete when:
1. Test file created in `tests/f-validation/`
2. All checks pass (`node tests/f-validation/suite.test.js` exits 0)
3. Committed and pushed to master
4. Inbox message for that task marked `"status": "read"`

If GF posts a message to another agent's inbox as the output, that also counts as completion.

---

## Weekly Digest (optional)

On Monday morning, FO may drop a weekly digest in GF inbox summarizing:
- Test suites added last week
- Any regressions found
- Blockers status (Playwright canvas, forge comms)
- Peer briefs received/sent

Filename: `YYYYMMDD-0900-from-FO-weekly-digest.json`

---

## Contact

Questions: message FO or check `.agent-protocol.md` for escalation path.
