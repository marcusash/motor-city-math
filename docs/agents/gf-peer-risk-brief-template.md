# MCM Peer Risk Brief Template

**Owner:** GF (Quality Lead)
**Purpose:** Weekly risk summary sent to peer agents (GA, GR, GD, GI, GP) to surface QA issues before they become blockers.
**Cadence:** Send after each autonomous session or before Marcus 1:1.

---

## Template

```
To: [peer agent ID]
From: GF
Subject: QA Risk Brief — [YYYY-MM-DD]

## This Week's QA Signal

**New tests shipped:** [N] suites, [N] checks
**Failing suites (pre-existing):** [N] — see baseline below
**New regressions:** [none | list with commit hash]

## Risks for Your Work

[Targeted at recipient's domain:]

GA: [Any grading/render/localStorage contract changes that affect your work?]
GR: [Any answer-key coverage or hint-quality issues found in testing?]
GD: [Any design token, color, or font enforcement failures?]
GI: [Any schema violations or data integrity issues surfaced by tests?]
GP: [Any infrastructure/pre-commit/CI gaps identified?]

## Blockers

- Playwright runtime (win-arm64): design-compliance.spec.js and design-qa.spec.js
  blocked. No browser testing until GP resolves canvas build.
- [Any other blockers this period]

## Baseline (current failing suites — pre-existing, not regressions)

These are KNOWN failures in the static suite. Not new. Not your fault.
| Suite | Failure | Owner |
|-------|---------|-------|
| print-audit.test.js | stale DOM selectors | GF backlog |
| offline-audit.test.js | stale expectations | GF backlog |
| responsive-audit.test.js | stale breakpoint assertions | GF backlog |
| chartjs-audit.test.js | CDN detection false positive | GF backlog |
| error-state-matrix.test.js | empty state content changed | GF backlog |
| question-schema.test.js | source_file field missing + multi-standard | GI/GR |
| save-load-audit.test.js | missing try/catch on localStorage.parse | GA |

## What I Need From You

[Specific ask — 1-2 items max]

GF
```

---

## Sending Guide

1. Copy the template above.
2. Fill in: date, new tests, regressions, targeted risk for the recipient.
3. Save as `.agent-comms/grind/inbox-{AGENT_ID}/YYYYMMDD-HHMM-from-GF-risk-brief.json`
4. Schema:
```json
{
  "id": "risk-brief-GF-{AGENT}-{DATE}",
  "from": "GF",
  "to": "{AGENT}",
  "project": "mcm",
  "type": "risk-brief",
  "priority": "normal",
  "subject": "QA Risk Brief — {DATE}",
  "body": "...",
  "created": "{ISO timestamp}",
  "status": "unread"
}
```

---

## 2026-02-23 Baseline

Static suite: 35 test files, 33 runnable (2 Playwright blocked)
Total assertions: ~800+ (across GF-created suites)
Failing (pre-existing): 8 suites
Clean (GF suites): 100% — all suites created this sprint pass

**Key gaps identified this sprint:**
1. No inline script syntax gate in pre-commit hook (postmortem gap)
2. No JSON validity check for data/*.json in pre-commit
3. No browser smoke test (Playwright blocked)
4. save-load-audit: uncaught localStorage parse exception (GA to fix)
5. question-schema: missing source_file field (GI/GR to add)
