# Motor City Math — Contributing Guide

This is an AI-agent-developed study tool for Kai Ash (SAAS). All changes go through the 6-agent review model.

---

## Before You Touch Anything

1. Read `.agents.md` — file ownership is enforced. Do not edit files your agent doesn't own.
2. Read `.agent-protocol.md` — communication and quality gate rules.
3. Read `.agent-status.md` — find your section, see your backlog.

## Three Non-Negotiable Rules

1. **Math accuracy first.** Any exam content change requires GR verification. A wrong answer key breaks Kai's trust.
2. **Kai has ADHD.** Max 12 words per feedback. One action at a time. No walls of text.
3. **One file at a time.** Kai is actively using these tests. Never batch-refactor. Migrate and verify before moving on.

## Commit Format

All commits must use this format:
```
{AGENT_ID}: {short description}

{longer body if needed}

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

Example: `GP: add field audit script and pre-commit hook`

## Before Committing Exam JSON

Run all of these. All must pass:
```bash
node tests/verify-practice-exams.js
node tests/cross-exam-verify.js
npm run test:gp
node scripts/gp-exam-health.js
```

## Before Committing HTML

```bash
node tests/f-validation/design-compliance.spec.js
node tests/f-validation/exam-json-schema.test.js
```

## File Ownership

| File Pattern | Owner |
|-------------|-------|
| `index.html`, `exam.html`, `shared/` | GA |
| `data/retake-practice-*.json` | GR |
| `data/manifest.json`, `data/questions.json` | GI |
| `tests/` | GF |
| `scripts/`, `.github/`, `docs/`, `CHANGELOG.md` | GP |
| CSS component specs | GD |
| Dotfile specs (`.design-system.md`, etc.) | FD |

## Do Not

- Run `git config user.name` or `git config user.email` — uses Marcus's global identity.
- Load external scripts from polyfill.io (banned, security risk).
- Skip GR verification on math content changes.
- Commit secrets, API tokens, or credentials.
