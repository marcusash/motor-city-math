# GP Naming Conventions

**Owner:** GP  
**Applies to:** all GP-created files

## File Naming

### Tests

Pattern: `tests/gp-{what-it-checks}.test.js`

Examples:
- `gp-hint-no-emdash.test.js` — checks hint fields for em dashes
- `gp-question-count.test.js` — checks question count per exam
- `gp-mc-correct-index.test.js` — checks MC answer is valid option

Rules:
- Always `gp-` prefix
- Kebab-case
- `.test.js` suffix
- Name describes the check, not the file it checks

### Scripts

Pattern: `scripts/gp-{what-it-does}.js`

Examples:
- `gp-morning-check.js` — runs morning ritual checks
- `gp-standards-coverage.js` — analyzes standard coverage
- `gp-feedback-tone-check.js` — scans for tone violations

Rules:
- Always `gp-` prefix
- Kebab-case
- `.js` suffix (use `.cjs` only if module system requires)

### Docs

Pattern: `docs/agents/gp-{topic}.md`

Examples:
- `gp-emergency-playbook.md` — emergency procedures
- `gp-sprint-log.md` — sprint history
- `gp-bug-tracker.md` — open/closed bugs

Rules:
- Always `gp-` prefix
- Kebab-case
- `.md` suffix
- Topic is a noun or noun phrase (not a verb)

### Data Files

GP does NOT own data files. File naming for data files is GI's responsibility.

## Commit Messages

Pattern:
```
GP: <short imperative summary>

<body explaining what changed and why>

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

Rules:
- Always `GP:` prefix (exact case, colon, space)
- First line is imperative: "Add", "Fix", "Update" — not "Added" or "Adding"
- First line under 72 characters
- Body explains what changed and key test results
- Always include co-author trailer

## Variable Naming (JS)

- Use `camelCase` for variables and functions
- Use `UPPER_SNAKE_CASE` for constants
- Use descriptive names — no abbreviations for test names

## Test Output Format

All GP tests must output:
```
gp-{test-name}: {pass} pass, {fail} fail   (or N/N pass)
VIOLATIONS:
   {file} Q{id} {field}: {description}
OK — {summary of what passed}
```

Exit code:
- 0 if all pass
- 1 if any violations
