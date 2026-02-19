# FD Autonomous Work Queue — Watchdog Brief for FA

> **Agent:** FD (Design + Comms)
> **Duration:** ~2 hours (Mash offline)
> **Started:** 2026-02-19T11:07Z
> **Repos touched:** mash-comms, journal, kai-algebra2-tests

---

## Tasks (in order)

### 1. Fix FID→FI in stale docs
- **Files:** `mash-comms/docs/fp-handoff-naming-org.md` (6 refs), `mash-comms/.forge-architecture.md` (2 refs)
- **What:** Replace FID→FI, GID→GI per FP's correction broadcast
- **Commit to:** mash-comms
- **Risk:** None — mechanical find/replace

### 2. Update .design-system.md with review decisions
- **File:** `kai-algebra2-tests/.design-system.md`
- **What:** Add ADHD design constraint, type scale (6 sizes), button hierarchy (3 tiers), archive mode pattern, header pattern. All Mash-approved from review walkthrough.
- **Commit to:** kai-algebra2-tests
- **Risk:** None — documenting approved decisions

### 3. Pitch deck freshness check
- **Files:** `journal/docs/pitch-deck/index.html`, `journal/docs/pitch-deck/forge-story.md`
- **What:** Verify test count, commit count, prompt count, line count are current. Update if stale.
- **Commit to:** journal
- **Risk:** None — read + update numbers

### 4. Process unread inbox messages
- **Files:** FD inbox messages in journal + kai-algebra2-tests
- **What:** Mark FA response read. Send GD a redirect to the GA implementation spec (their plan was built on stale 20-file data, GA now owns implementation).
- **Commit to:** kai-algebra2-tests
- **Risk:** None — no new decisions, just routing

### 5. Clean up MCM temp files
- **Files:** `kai-algebra2-tests/design-review-crawl.mjs`, `kai-algebra2-tests/capture-arena.mjs`, `kai-algebra2-tests/design-review-screenshots/`
- **What:** Delete temp crawl scripts and screenshot directory. Data is captured in committed `.design-review-mcm.md`.
- **Commit to:** kai-algebra2-tests
- **Risk:** Low — screenshots are artifacts, review doc has all findings

### 6. Update plan.md with session state
- **File:** Session workspace plan.md
- **What:** Full checkpoint — everything accomplished today, current status, pending items
- **Commit to:** None (session file)
- **Risk:** None

### 7. Retire old T1-T7 MCM todos
- **What:** SQL update — mark old T1-T7 as superseded by the 14-task approved spec
- **Commit to:** None (session DB)
- **Risk:** None

### 8. Voice guide / MTI freshness scan
- **Files:** `mash-comms/Marcus voice guide.md.txt`, `mash-comms/Message type instructions.md.txt`
- **What:** Scan for stale agent references (FID→FI), verify section integrity, check for any gaps
- **Commit to:** mash-comms (if fixes needed)
- **Risk:** None — read-only scan, only commit if stale refs found

---

## Watchdog Checkpoints

| After task | Expected signal | If missing |
|------------|----------------|------------|
| 1 | Commit in mash-comms: "fix FID refs" | FD may be stuck on file edit — check session |
| 2 | Commit in kai-algebra2-tests: "design system update" | Largest task — allow 30 min |
| 3 | Commit in journal: "pitch freshness" or no commit if current | Check if FD moved to task 4 |
| 4 | Commit in kai-algebra2-tests: "inbox processed" | Small task — should be fast |
| 5 | Commit in kai-algebra2-tests: "cleanup temp files" | Check if git rm worked |
| 6 | No commit (session file) | Check if FD moved to task 7 |
| 7 | No commit (SQL update) | Check if FD moved to task 8 |
| 8 | Commit in mash-comms if fixes found, otherwise no commit | FD should report "queue complete" |

## Rules for FD

- **No new agent broadcasts.** Draft only, don't send.
- **No design decisions.** Only document already-approved decisions.
- **No code changes.** Only docs, cleanup, and metadata.
- **Commit after each task** so the watchdog can track progress.
- **If stuck >10 min on any task, skip it and move to the next.**
