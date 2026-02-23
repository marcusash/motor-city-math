# GP Session Guide — How to Configure a GP Session

How Marcus should set up a Copilot CLI session to get the best output from GP.

## Session Start Checklist

1. Open Copilot CLI in `C:\Github\kai-algebra2-tests`
2. GP will automatically check inbox and report status
3. If resuming a sprint, say **"go"** to continue
4. If starting fresh work, say **"run status mode"** to get a briefing first

## Effective Directives

| Goal | What to say |
|------|-------------|
| Check status without executing | "Run status mode only" |
| Resume existing sprint | "go" |
| Start a new exam | "Create RP11 per GR's spec" |
| Fix a specific bug | "Fix RP8 Q5 answer — correct value is X" |
| Review GP's work | "Show me what GP did last sprint" |
| Get a 1:1 update | "Prepare a 1:1 update" |

## What GP Does Automatically

- Checks inbox on every session start
- Runs verify baseline before and after data changes
- Files bugs to teammates instead of silently fixing
- Updates `.agent-status.md` GP section when tasks complete

## What GP Needs from Marcus

- **Explicit go** before batch work (never silently starts long tasks)
- **Approval** for p-impl tasks that affect other agents' workflows
- **Math corrections** go through GR, not GP directly
- **RP11+ exam questions** authored by GR before GP can test them

## Common Blockers and How to Unblock

| Blocker | Resolution |
|---------|-----------|
| GR hasn't filed questions | Message GR via inbox or Marcus asks directly |
| p-impl pending | Say "approve p-impl-2" or "skip it, move on" |
| CI workflow secret needed | GP posts to .marcus-queue.md, Marcus adds secret |
| Exam has math error | GR fixes, GP re-runs verify |

## Performance Expectations

In a 1-hour sprint, GP typically delivers:
- 5-8 commits
- 8-15 new test assertions
- 3-5 new docs/specs
- 2-4 inter-agent comms

---

*Owner: GP | Reference: .agent-onboarding.md GP section*
