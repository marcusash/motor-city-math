# GP Learning Notes — DORA Metrics Framework

**Source:** Accelerate (Forsgren, Humble, Kim) — summarized for MCM context

---

## The Four DORA Metrics

| Metric | What It Measures | Elite Threshold |
|--------|-----------------|----------------|
| Deployment Frequency | How often code ships to prod | Multiple per day |
| Lead Time for Changes | Commit to production time | < 1 hour |
| Change Failure Rate | % deploys that cause incidents | < 5% |
| Time to Restore | Recovery time when things fail | < 1 hour |

---

## How This Applies to Motor City Math

**Deployment Frequency (current: LOW)**
- Publish is manual-only (workflow_dispatch)
- GP goal: make publish safe enough to do after every sprint
- Blockers: MOTOR_CITY_MATH_TOKEN rotation schedule unclear

**Lead Time (current: HOURS)**
- GR writes question → GP verifies → Marcus triggers publish → Kai uses
- GP goal: reduce to < 30 min with CI auto-checks removing manual verify step

**Change Failure Rate (current: LOW)**
- Pre-commit hook + CI + health gate catches most issues before push
- Known failure: RP5 Q4/Q13 (caught via verify baseline, not pre-commit)
- GP goal: add math accuracy check to CI (would require GR eval step)

**Time to Restore (current: UNKNOWN)**
- No documented restore procedure before this sprint
- Now documented in gp-incident-response.md (P0 target: < 5 min)

---

## Gap Analysis: GP vs Nicole Forsgren Standard

Nicole Forsgren's bar: use metrics to drive decisions, not gut feel.

**Where GP falls short:**
1. No dashboarded metrics (FO has it but GP doesn't read it enough)
2. Deployment frequency not tracked per-sprint
3. Change failure rate not formally recorded

**Actions:**
- gp-metrics-baseline.md: first metrics snapshot
- gp-sprint-log.md: per-sprint commit tracking
- gp-health-dashboard.md: running system health

This is the beginning of metrics discipline, not the end.
