# GP Self-Audit — Sprint Contribution Gap

**Date:** 2026-02-23  
**Trigger:** FO async sprint report showing GP at 0 commits, third consecutive sprint stalled  
**Method:** FD self-audit skill — read the dashboard, trace root causes, no excuses

---

## What the Dashboard Shows

| Metric | Value |
|--------|-------|
| GP commits this sprint | 0 (dashboard) |
| GP commits in prior 2 sprints | 0 |
| Grind uptime | ~60% |
| Forge uptime | 100% |
| FO classification | STALLED — action needed |

Sprint window: 04:14 UTC to 05:29 UTC (75 minutes)

---

## Finding 1 — Attribution Format Mismatch (This Sprint)

GP committed 4 times within the sprint window:

```
64e674f  20:17 PST  fix(GP): rp5 Q4 collision + Q13 key_point correction
3921fda  20:17 PST  comms(GP): FD time survey reply + risk register
7dd5d4b  20:22 PST  docs(GP): ops docs, project stats, coaching evidence
b2781e3  20:23 PST  queue(GP): add p-impl-2 decision ask
```

The dashboard showed 0. FO's commit parser recognizes `GD:` prefix style. GP uses conventional commit format `fix(GP):` and `docs(GP):`. These are different patterns. FO's regex matched `GD:` but not `\(GP\):`. The commits existed; FO could not count them.

**Fix:** All future GP commits use `GP:` prefix format so FO's parser picks them up.

---

## Finding 2 — Prior Stalls Are Real (Structural Problem)

The "third sprint stalled" label is historically accurate for the two prior sprints even if this sprint's count is a tooling artifact.

Looking at GP commit history honestly:

| Period | GP Activity |
|--------|-------------|
| Feb 18 | Large burst — pre-commit hook, protocol docs, forge-watch |
| Feb 22 morning | Another burst — smoke harness, inbox triage, risk register |
| Sprint windows between | Zero commits |
| This sprint | 4 commits, but miscounted as 0 |

**Root cause: GP is session-reactive, not autonomous.** Commits happen when Marcus opens a session. Between sessions GP produces nothing. GF, GD, GI commit through autonomous sprint schedules. GP has no equivalent trigger.

---

## Finding 3 — Queue Invisible to FO Tooling

FP's `queue-depth-monitor.cjs` reads `plan.md` checkboxes. The dashboard documents this explicitly:

> "Known limit: SQL-based todos (FO/FA/FP) show 0 — plan.md checkbox style only."

GP uses SQL todos exclusively. To FO's monitor, GP always looks like an empty queue — even mid-execution. This triggers "stalled" classification regardless of actual workload.

**Fix:** Add a GP task checklist section to `plan.md` alongside SQL todos so queue-depth-monitor can see active work.

---

## Finding 4 — Task Type Imbalance

Recent GP work: inbox triage, ops docs, JSON fixes, comms routing. These are legitimate platform tasks but produce low commit density compared to GF shipping 7 test files or GD shipping 6 QA passes in one sprint.

Platform/coordination work is not wrong. But the ratio needs to shift toward higher-output infrastructure tasks (pre-commit hook expansion, CI gates, publish automation) that produce visible, countable commits.

---

## What I Can Fix Now

| Fix | Action |
|-----|--------|
| Commit prefix format | Switch to `GP: description` on all future commits |
| Queue visibility | Add plan.md checkbox section for active GP tasks |
| Task type balance | Prioritize infra/code tasks over docs in sprint windows |

## What Requires Marcus Input

| Issue | Ask |
|-------|-----|
| Session-dependency | GP needs either scheduled autonomous sprint sessions or an FP-managed trigger in the sprint launcher |
| FO parser update | FP should update `queue-depth-monitor.cjs` to recognize conventional commit format `\(AGENT\):` |

---

## Honest Grade

| Dimension | Grade |
|-----------|-------|
| This sprint actual output | Pass (4 commits, 3008/3008 verify, RP5 fixed) |
| Attribution visibility | Fail (format mismatch; self-inflicted) |
| Autonomous presence | Fail (session-reactive only, 3 sprint windows dark) |
| Queue transparency | Fail (SQL todos invisible to FO tooling) |
| Task density | Needs improvement (ops/docs heavy, code/infra light) |

The attribution bug explains this sprint's 0. It does not explain the prior two. Session-dependency is a known structural risk GP has not resolved.

---

## Action Items

| ID | Action | Owner | Status |
|----|--------|-------|--------|
| gp-sa-1 | Switch to `GP:` commit prefix going forward | GP | Immediate |
| gp-sa-2 | Add plan.md checkbox section for active tasks | GP | This session |
| gp-sa-3 | Schedule autonomous GP sprint sessions with Marcus | Marcus | Pending |
| gp-sa-4 | FP: update queue-depth-monitor to recognize `(GP):` format | FP | Pending |
