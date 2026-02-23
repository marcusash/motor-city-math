# GP Commit Conventions

**Owner:** GP (grind-platform)  
**Last updated:** 2026-02-23

---

## Format

All GP commits must use this format:

```
GP: {short imperative description}

{Optional body with detail}

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

## Why `GP:` Prefix

FO's sprint attribution parser recognizes agent prefix style (`GP:`, `GD:`, `GA:` etc.).
Conventional commit format (`fix(GP):`, `feat(GP):`) is NOT parsed by FO.
Using `GP:` ensures every commit is attributed correctly in sprint dashboards.

## Examples

Good:
```
GP: field audit + bulk fix — 93 missing fields across all 10 RPs
GP: CI workflow to auto-validate exam JSON on push/PR
GP: update agent-status.md with sprint output
```

Not (FO won't attribute):
```
fix(GP): field audit
feat(gp): ci workflow
chore: update status
```

## Scope Reference

| Scope word | Use when |
|-----------|---------|
| (no scope) | General platform work |
| `scripts/` | New or updated scripts |
| `tests/` | New or updated tests |
| `docs/` | Documentation only |
| `ci/` | GitHub Actions workflows |
| `data/` | RP JSON data changes |
| `comms/` | Agent inbox messages |
| `hook/` | Pre-commit hook changes |

## Body Guidelines

- List files changed if more than 2
- Include verify result if exam data changed
- Include test pass counts if tests added
- Always include Co-authored-by trailer
