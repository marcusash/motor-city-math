# GP Quality Gates

All quality gates owned and maintained by GP.

## Gate 1: Exam Verify (Primary)

**Command:** `node tests/verify-practice-exams.js`  
**Frequency:** Before every commit touching exam data  
**Baseline:** 3008/3008  
**Action if fails:** DO NOT commit. Report to GR/Marcus immediately.

## Gate 2: Health Gate (Secondary)

**Command:** `node scripts/gp-exam-health.js`  
**Frequency:** After scripts or package.json changes  
**Baseline:** 11/11  
**Checks:** JSON parse, schema version, title, hint count, feedback, uniqueness, viewport, CODEOWNERS, CHANGELOG, CONTRIBUTING, pre-commit hook  
**Action if fails:** Fix before pushing.

## Gate 3: Cross-Exam Dedup

**Command:** `node tests/cross-exam-verify.js`  
**Frequency:** When a new exam is added  
**Baseline:** 0 hard failures  
**Action if fails:** GR must fix answer collisions before merge.

## Gate 4: Pre-Commit Hook

**Command:** Auto-runs on `git commit`  
**Checks:** polyfill.io ban, CDN with local alternative, duplicate HTML tags, file size protection, hardcoded hex  
**Action if blocks:** Fix the flagged issue. Never bypass hook.

## Gate 5: ADHD Compliance

**Command:** `node tests/gp-hint-presence.test.js && node tests/gp-feedback-length.test.js`  
**Frequency:** After any hint/feedback edits  
**Baseline:** 150/150 hints, 300/300 feedback  
**Action if fails:** Flag to GR for fix.

## Gate 6: Schema Version

**Command:** `node tests/gp-schema-version-v2.test.js`  
**Frequency:** When new RP file added  
**Baseline:** 11/11 files have schema_version "2.0"  
**Action if fails:** Update the file's schema_version field.

## Gate 7: Aria Labels (Advisory)

**Command:** `node tests/gp-aria-labels.test.js`  
**Status:** 6 failures found, bugs filed to GA  
**Baseline target:** 0 failures  
**Action:** Wait for GA fix; advisory only, does not block ship.

## When to Run All Gates

Full gate run before any release to Kai:

```
node tests/verify-practice-exams.js &&
node tests/cross-exam-verify.js &&
node scripts/gp-exam-health.js
```

If all three pass: system is healthy, Kai-ready.

---

*Owner: GP | Gates added/removed only with GP approval*
