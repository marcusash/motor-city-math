# GP Test Strategy

Platform engineering test philosophy for Motor City Math.

## Core Principle

Tests exist to catch regressions before they reach Kai. Not to increase coverage metrics.

## Test Categories

### 1. Structural Tests (always run)

Verify JSON is parseable, fields are present, types are correct.

Files: `gp-field-completeness.test.js`, `gp-schema-version-v2.test.js`, `gp-metadata-complete.test.js`, `gp-json-parse.test.js`

### 2. Content Quality Tests (run on data changes)

Verify answer uniqueness, hint presence, feedback length, tolerance ranges.

Files: `gp-answer-uniqueness.test.js`, `gp-hint-presence.test.js`, `gp-hint-length.test.js`, `gp-feedback-length.test.js`, `gp-answer-tolerance.test.js`

### 3. Cross-Exam Tests (run when new exam added)

Verify answers don't repeat across exams. Verify standard distribution.

Files: `tests/cross-exam-verify.js`, `tests/f-validation/exam-cross-exam-dedup.test.js`

### 4. Platform Tests (run on infrastructure changes)

Verify pre-commit hook, CODEOWNERS, CHANGELOG, commit prefix, CDN refs.

Files: `gp-commit-prefix.test.js`, `gp-cdn-check.test.js`, `gp-viewport-meta.test.js`, `gp-print-css.test.js`, `gp-aria-labels.test.js`

### 5. The Master Gate (always run before publishing)

```
node tests/verify-practice-exams.js
node scripts/gp-exam-health.js
```

If these two pass, the system is Kai-ready.

## What GP Does NOT Test

- **Math correctness** — that's GR's job. GP verifies structure, not content.
- **UI rendering** — that's GD/GF with Playwright.
- **Browser compatibility** — that's GF with cross-browser Playwright.

## Adding New Tests

1. Name: `tests/gp-{what-it-tests}.test.js`
2. Must exit 0 on pass, exit 1 on hard fail
3. Advisory results: print warning, exit 0
4. Document in `docs/agents/gp-verification-matrix.md`
5. Add to `npm run test:gp:all` in package.json

## Current Test Count

23 GP test files (as of 2026-02-23).

---

*Owner: GP | Philosophy: gate over coverage*
