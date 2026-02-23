# GP Bug Tracker

**Last updated:** 2026-02-23

## Open Bugs

### HIGH Priority (blocks Kai or test suite)

| ID | Description | Owner | Filed | Status |
|----|-------------|-------|-------|--------|
| EM-001 | Em dash in rp4-q5 .hint | GR | 2026-02-23 | OPEN |
| EM-002 | Em dash in rp4-q9 .feedback_correct | GR | 2026-02-23 | OPEN |
| EM-003 | Em dash in rp5-q2 .hint | GR | 2026-02-23 | OPEN |
| EM-004 | Em dash in rp5-q5 .feedback_wrong | GR | 2026-02-23 | OPEN |
| EM-005 | Em dash in rp5-q10 .hint | GR | 2026-02-23 | OPEN |
| EM-006 | Em dash in rp5-q14 .hint | GR | 2026-02-23 | OPEN |
| EM-007 | Em dash in rp6-q7 .hint | GR | 2026-02-23 | OPEN |
| EM-008 | Em dash in rp7-q3 .feedback_correct | GR | 2026-02-23 | OPEN |
| EM-009 | Em dash in rp7-q6 .feedback_wrong | GR | 2026-02-23 | OPEN |
| EM-010 | Em dash in rp7-q12 .hint | GR | 2026-02-23 | OPEN |
| EM-011 | Em dash in rp9-q1 .hint | GR | 2026-02-23 | OPEN |

### MEDIUM Priority (degrades UX or accessibility)

| ID | Description | Owner | Filed | Status |
|----|-------------|-------|-------|--------|
| ARIA-001 | 6 canvas elements missing aria-labels | GA | 2026-02-22 | OPEN |
| PRINT-001 | Print CSS missing on 3 exam HTML files | GD | 2026-02-22 | OPEN |
| SCHEMA-001 | RP1-10 on schema_version 1.0 (target 2.0) | GI | 2026-02-23 | OPEN |

### LOW Priority (tech debt)

| ID | Description | Owner | Filed | Status |
|----|-------------|-------|-------|--------|
| LOCAL-001 | 4 HTML files share same localStorage key | GA | 2026-02-22 | OPEN |
| DOC-001 | docs/data-model.md was outdated (10 fields wrong) | GP | 2026-02-23 | FIXED |

## Closed Bugs

| ID | Description | Fixed | Commit |
|----|-------------|-------|--------|
| RP5-001 | RP5 Q4 wrong answer | GR | sprint 1 |
| RP5-002 | RP5 Q13 wrong answer | GR | sprint 1 |
| RP5-003 | RP5 version "2" → "2.0" | GP | sprint 1 |
| Q6D-001 | Q6d temperature answer was 62 (should be 66) | GP | sprint 1 |
| FIELD-001 | 93 missing fields across RP1-10 | GP | sprint 1 |
| FEEDBACK-001 | 34 ADHD violations in feedback text | GP | sprint 1 |
| HINT-001 | 9 ADHD violations in hint text | GP | sprint 1 |
| RP11-001 | RP11 missing version field | GP | session 3 |
| RP11-002 | RP11 schema_version 1.0 → 2.0 | GP | session 3 |
| DOC-001 | docs/data-model.md 10 field errors | GP | session 4 |

## Filing New Bugs

Send to GP inbox: `.agent-comms/grind/inbox-GP/`  
Schema: `{ from, to, type:"bug-report", priority, subject, body, created }`
