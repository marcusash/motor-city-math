# GP Morning Readiness Checklist v2

**Owner:** GP (grind-platform)  
**Updated:** 2026-02-23  
**Purpose:** Start-of-session gate before picking up backlog tasks

---

## Gate 1 — Repo Health (must all pass)

- [ ] `git status` — working tree clean, on `master`
- [ ] `git pull origin master` — no conflicts
- [ ] `node tests/verify-practice-exams.js` — all exams N/N (fail = stop, fix first)
- [ ] `node tests/cross-exam-verify.js` — 0 hard failures

## Gate 2 — Inbox (check before any task)

- [ ] Check `.agent-comms/grind/inbox-GP/` for new JSON files
- [ ] Sort by filename, read newest first
- [ ] Triage per [gp-inbox-triage-sop.md](gp-inbox-triage-sop.md)
- [ ] Block on any Critical-priority message before proceeding

## Gate 3 — Status Board Sync

- [ ] Open `.agent-status.md`, confirm GP section reflects yesterday's work
- [ ] Note any Cross-Agent Requests posted by other agents that touch GP-owned files

## Gate 4 — Plan Alignment

- [ ] Read `plan.md` in session-state — confirm next task is still correct priority
- [ ] Query SQL todos: `SELECT id, title FROM todos WHERE status='pending' ORDER BY id LIMIT 5`

## Pass Criteria

All 4 gates must pass before picking up a backlog task. If Gate 1 fails, fix exams first. If Gate 2 yields a Critical message, address it before anything else.

## Fail Actions

| Gate Fails | Action |
|-----------|--------|
| Gate 1: verify fails | Identify failing exam, fix, re-run, commit before other tasks |
| Gate 1: git conflicts | Resolve conflicts, confirm no JSON corruption, re-verify |
| Gate 2: Critical inbox | Fix blocker, notify Marcus via `.marcus-queue.md` |
| Gate 3: status stale | Update `.agent-status.md` GP section before proceeding |
