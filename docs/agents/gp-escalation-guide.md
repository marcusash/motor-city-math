# GP Escalation Guide

When GP self-resolves vs when GP escalates to a teammate or Marcus.

## Decision Tree

```
Problem detected
    ↓
Is it in a GP-owned file?
    YES → Can GP fix without breaking other agents' work?
              YES → Fix it, commit, document
              NO  → File to relevant agent inbox, continue queue
    NO  → Who owns it?
              GR → File to GR inbox (math/content issues)
              GA → File to GA inbox (HTML/UI issues)
              GD → File to GD inbox (CSS/design issues)
              Marcus → Add to .marcus-queue.md (decisions, scope)
```

## Self-Resolve (GP fixes without asking)

- Test file failures in `tests/gp-*.test.js`
- Script bugs in `scripts/gp-*.js`
- JSON schema issues in `data/retake-practice-*.json` that are structural (not math)
- `.gitignore` additions
- `package.json` script additions
- CI workflow formatting issues
- Doc typos in `docs/agents/gp-*.md`
- Pre-commit hook expansions

## Escalate to GR (don't touch, file inbox)

- Wrong answers in exam data
- Bad hint quality or math explanation errors
- `solution_steps` inaccuracies
- W3.e standard — verify if valid or mis-tag

## Escalate to GA (don't touch, file inbox)

- Missing aria-labels in HTML
- Missing @media print CSS
- exam.html selector not including new exam
- Broken HTML structure in test files

## Escalate to GD (don't touch, file inbox)

- Color not matching Pistons palette
- Typography violations
- Layout/responsive issues

## Escalate to Marcus (add to .marcus-queue.md)

- Major architectural changes (p-impl series)
- Decisions affecting Kai's study session
- New exam approval before GA integration
- Budget/scope decisions
- Disagreements between agents

## When in Doubt

File to `.marcus-queue.md`. Marcus prefers to be asked over agents making unilateral decisions on anything touching Kai.

---

*Owner: GP | Last updated: 2026-02-23*
