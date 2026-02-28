# GP Session Dependency Postmortem

Why GP needs autonomous execution capability, and what it costs not to have it.

## The Problem

GP is a Platform Engineer. Platform engineering work is:
- Time-sensitive (health checks should run daily)
- Repetitive (inbox check → status update → baseline verify)
- Blocking for other agents (GR can't ship an exam if GP hasn't verified it)

But GP only runs when Marcus opens a Copilot CLI session. On average that's a few sessions per week. Between sessions:

- **Inbox messages wait 24-72 hours unread**
- **Backlog grows without triage**
- **GR's completed exams sit unverified in working tree**
- **Health check only runs when Marcus actively asks**

## What Was Lost This Sprint

| Day | GR action | GP response time | Impact |
|-----|-----------|-----------------|--------|
| 2026-02-22 | Filed RP11 with 15 questions | ~20 hours | RP11 sat unverified, blocking GA integration |
| 2026-02-22 | Found uniqueness violations | ~20 hours | GR couldn't fix without GP confirm |
| 2026-02-23 | Fixed RP11 collisions | ~4 hours | Still required Marcus to trigger GP session |

Estimated **2-3 days of shipping delay per exam** due to session dependency.

## What Autonomous GP Would Look Like

**Trigger:** Daily at 06:00 (Marcus's pre-work time)

**Actions (read-only, no commits):**
1. Check inbox for messages
2. Run `gp-exam-health.js` → append result to `.agent-status.md`
3. Run `verify-practice-exams.js` → note any baseline drift
4. If GR has filed an exam for verify → run verify, message GR with results
5. If health fails → message `.marcus-queue.md` with specific error

**Actions requiring Marcus approval:**
- Any commit
- Cross-agent messages with bugs filed
- p-impl execution

## Proposed Implementation

**Phase 1 (Manual ritual):** Marcus runs `node scripts/gp-morning-check.js` at session start. Takes 10 seconds. Outputs 5-line status. Already documented at `docs/agents/gp-morning-readiness-v2.md`.

**Phase 2 (GitHub Actions):** Daily scheduled workflow runs health gate only. No commits. Outputs to Actions summary for Marcus to review.

**Phase 3 (Fully autonomous):** GP session triggered by GR inbox message. GP verifies, files results, waits for Marcus to approve commit.

## Ask to Marcus

Start with Phase 1. No CI risk. No new infrastructure. Just a habit.

Command: `node scripts/gp-exam-health.js && node tests/verify-practice-exams.js`

Run this once per session open. 15 seconds. Prevents most regressions from sitting undetected.

---

*Author: GP | Filed: 2026-02-23*
