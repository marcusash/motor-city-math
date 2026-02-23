# GP Cross-Agent Coordination Protocol

How GP works with each agent on the team.

## GP ↔ GR (Research)

**Direction:** GR → GP → merge  
**Frequency:** Every exam

| Step | Who | Action |
|------|-----|--------|
| 1 | GR | Authors questions in `data/retake-practice-N.json` |
| 2 | GR | Messages GP inbox: "RP-N ready for verify" |
| 3 | GP | Runs full verify sequence (3 commands) |
| 4 | GP | Reports to GR inbox: pass or specific failures |
| 5 | GR | Fixes any failures, re-submits |
| 6 | GP | Commits to master on pass |

**GP does NOT:** Change answer values, edit hints, modify standards codes.

## GP ↔ GA (App Engineer)

**Direction:** GP files → GA fixes  
**Frequency:** When GP tests find HTML issues

GP runs `gp-aria-labels.test.js`, `gp-print-css.test.js`, `gp-viewport-meta.test.js`. When these fail:
1. GP files to GA inbox with exact file/line context
2. GP does NOT touch exam.html or index.html
3. GA fixes, GP re-runs test to confirm

After new exam passes GP verify:
1. GP messages GA: "RP-N verified clean, ready for exam.html integration"
2. GA adds to selector, GP spot-checks health gate

## GP ↔ GD (Design)

**Direction:** GD specs → GP tests  
**Frequency:** When design rules change

When GD updates `.design-system.md`:
1. GD messages GP inbox with changed rules
2. GP reviews if any GP tests need to reflect new rules
3. GP updates tests or advisory thresholds

GP does NOT make design decisions. GP enforces what GD specifies.

## GP ↔ GF (QA)

**Direction:** Parallel, coordinated  
**Frequency:** Ongoing

- GF owns `tests/f-validation/` — Playwright + schema guard
- GP owns `tests/gp-*.test.js` — structural + content
- Both run on master, both report to health gate
- When GP's structural tests find issues GF's tests don't catch, GP files to GF inbox as info
- When GF's Playwright finds UI issues, GF files to GA inbox (not GP)

## GP ↔ GI (Data)

**Direction:** GI specs → GP validates  
**Frequency:** When data schema changes

GI owns question bank data specs. When GI proposes schema changes:
1. GI messages GP inbox with proposed field additions
2. GP reviews impact on existing `gp-field-completeness.test.js`
3. GP updates tests to include new required fields
4. Both agents sign off before GA implements in HTML

## GP ↔ Marcus (Human Lead)

**Direction:** Marcus directives → GP execution  
**Frequency:** Every session

- Marcus opens session, GP checks inbox and reports status
- Marcus says "go" → GP executes sprint queue
- Marcus says "stop" → GP stops, files status to `.agent-status.md`
- Marcus approvals needed for: p-impl tasks, new exam ship, scope changes
- GP questions go in `.marcus-queue.md`

---

*Owner: GP | Reference: .agent-protocol.md for formal rules*
