# GP Sprint Reflection

What worked, what to improve, what to do differently.

## Sprint Stats (2026-02-23, Sessions 1-3)

| Metric | Value |
|--------|-------|
| Commits | 35 GP-prefixed |
| Tests created | 23 GP test files |
| Scripts created | 18 GP scripts |
| Docs created | 30+ GP docs |
| Bugs filed | 11 (5 to GA, 4 to GR, 2 advisory) |
| Sprint tasks completed | 453/500 (91%) |
| Exam verify baseline | 3337/3337 (RP11 now included) |
| Health gate | 11/11 |

## What Worked

### 1. GP: commit prefix
Every commit tagged with `GP:` makes attribution unambiguous. Git log shows exactly what GP shipped. FO review is now trivial.

### 2. Inbox-first protocol
Checking inbox before every sprint start caught GR's RP11 collision report and GF's T7 QA completion before they went stale.

### 3. Parallel doc creation
Creating 5-8 docs per commit turn instead of 1 at a time. Docs are not risky — batch them, commit once.

### 4. Advisory vs. hard-fail tests
Separating advisory failures (aria-labels, print CSS) from hard blockers (verify baseline) let GP keep moving without getting stuck on issues that belong to GA.

### 5. Health gate as single pre-publish check
`node scripts/gp-exam-health.js` → 11/11 gives Marcus a one-command confidence signal. No need to remember 8 separate commands.

## What to Improve

### 1. SQL task tracking drift
The `sprint` table's `status` field got out of sync with actual completion state. Need a single source of truth — either the SQL or the git log, not both.

**Fix:** At sprint start, cross-reference git log against SQL. Mark any committed work as done.

### 2. Pre-commit hook discovery time
Took 2 turns to figure out `gp-cdn-check.test.js` was blocked and why. The hook's exclusion logic wasn't documented.

**Fix:** Add a `docs/agents/gp-pre-commit-guide.md` explaining all hook checks and exclusion patterns.

### 3. Session dependency
Still the biggest bottleneck. GP can't verify GR's exams until Marcus opens a session.

**Fix:** Phase 1 morning ritual (already documented). Phase 2 GitHub Actions daily health check.

### 4. RP11 stub confusion
The stub (0 questions) was in HEAD but GR's real 15-question file was in working tree. This caused confusing test results.

**Fix:** Never commit a stub. If RP-N isn't ready, don't create the file. Only commit when GR's version passes verify.

## What Not to Change

- **One-file-at-a-time for exam data.** GP tried to push GR's RP11 before it was ready — the verify system caught it correctly. The gate works.
- **Marcus approval for p-impl tasks.** p-impl-2 is still pending. That's the right state — doc reorg affects all agents.
- **GR math ownership.** GP never touched answer values without explicit GR confirmation. This saved 2+ potential math errors from reaching Kai.

## Next Sprint Priorities

1. Wait for GR to fix RP11 em dashes + uniqueness → ship to Kai
2. Get Marcus p-impl-2 decision
3. Add Phase 1 morning ritual to Marcus session guide
4. File GD request for print CSS fix in exam.html

---

*Author: GP | Sprint: 2026-02-23 sessions 1-3*
