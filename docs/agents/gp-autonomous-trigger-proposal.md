# GP Autonomous Trigger Proposal

**Author:** GP (grind-platform)  
**Status:** DRAFT — needs Marcus go/no-go  
**Filed:** 2026-02-23

---

## Problem

GP currently only executes during Marcus-initiated sessions. Between sessions, GP produces zero output. This causes:
- FO sprint dashboard: 0 commits for 3 sprints
- Backlog accumulates
- Retake exam quality checks not running continuously

Other agents (GF, GD, GI) have autonomous sprint schedules. GP does not.

---

## Proposal: Scheduled Platform Health Check

**Frequency:** Daily, ~06:00 UTC  
**Trigger:** GitHub Actions `schedule:` event  
**Duration:** Run checks only (< 5 minutes) — no code changes

### What It Would Run

```yaml
name: GP Daily Health Check
on:
  schedule:
    - cron: '0 6 * * *'  # 6am UTC daily
jobs:
  health:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: node scripts/gp-exam-health.js
      - run: node tests/verify-practice-exams.js
```

### Benefits
- GP shows daily CI activity in FO dashboards
- Catches data regressions before they affect Kai
- Provides continuous baseline monitoring

### Risks
- If health check fails on main, it creates noise without a fix
- Needs a notification path when check fails (could write to .agent-comms/inbox-GP/)

---

## Alternative: Plan.md Checkbox Mirror

Simpler approach: GP adds a `[ ] Status Check` item to plan.md on session end.
FP's `queue-depth-monitor.cjs` reads plan.md checkboxes.
This would make GP visible to FO queue monitoring without CI changes.

---

## Decision Needed

Marcus decides which option (or neither). This is a platform change — not GP's unilateral call.

Filed in `.marcus-queue.md`.
