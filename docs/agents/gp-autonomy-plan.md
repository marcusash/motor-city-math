# GP Autonomy Plan — Roadmap to Fully Autonomous Platform

How GP evolves from session-dependent to always-available.

## Current State (Level 1): Session-Dependent

GP runs only when Marcus opens a Copilot CLI session. All work is synchronous. No triggers. No scheduled execution.

**Problems:**
- Inbox messages wait 24-72h
- GR's exam verifications blocked until Marcus is available
- Health checks only happen when Marcus actively asks

## Phase 1: Morning Ritual (Implement Now)

Add `gp-morning-check.js` to Marcus's session-start routine.

**What it does:**
```bash
node scripts/gp-exam-health.js          # 30s: 11-check gate
node tests/verify-practice-exams.js     # 30s: baseline verify
```

**What Marcus does:** Run this command at the start of any session touching exam data.

**What it costs:** 60 seconds.

**What it prevents:** Shipping a broken baseline to Kai.

Status: Documented. Awaiting habit adoption.

## Phase 2: Scheduled Health Check (Next Sprint)

Add GitHub Actions workflow: `gp-daily-health.yml`

```yaml
on:
  schedule:
    - cron: '0 13 * * *'   # 06:00 Pacific
jobs:
  health:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: node scripts/gp-exam-health.js
      - run: node tests/verify-practice-exams.js
```

**Output:** GitHub Actions summary visible in repo.  
**No secrets needed.** Read-only operations on JSON files.  
**Risk:** None. Actions timeout and retry automatically.

Requires Marcus approval to merge the workflow file.

## Phase 3: GR-Triggered Verify (Future)

When GR pushes a new RP file to a branch, a workflow runs:
1. Verify new exam JSON
2. Cross-exam dedup check
3. Post results as PR comment

**Requires:** GitHub Actions with write permission (PR comments) — needs Marcus review.

## Phase 4: Full Autonomous Loop (Future)

GP session triggered by inbox message. GP reads message, executes specific task (e.g. verify an exam), posts result to GR inbox, stops.

**Requires:** Marcus-designed session launcher. Not in current scope.

## Decision Table for Marcus

| Phase | Benefit | Effort | Risk | Recommendation |
|-------|---------|--------|------|----------------|
| 1 (ritual) | Catch regressions daily | None | None | **Do now** |
| 2 (Actions) | Automated health signal | 30min to implement | Low | **Next sprint** |
| 3 (PR verify) | Faster GR→Kai pipeline | Medium | Low | **Q2** |
| 4 (Autonomous) | Remove session dependency | High | Medium | **Q3** |

---

*Author: GP | Reference: gp-session-dependency-postmortem.md, gp-autonomous-trigger-proposal.md*
