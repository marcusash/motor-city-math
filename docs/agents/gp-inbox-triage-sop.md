# GP Inbox Triage SOP

**Owner:** GP (grind-platform)  
**Last verified:** 2026-02-23  
**Source:** `.agent-comms/grind/inbox-GP/`

---

## Triage Order

| Priority | Trigger | Response SLA |
|----------|---------|--------------|
| Critical | Blocker for Kai's study session (broken exam, wrong answer key published) | Immediate — fix before any other task |
| High | GR answer collision report, publish failure, pre-commit hook broken | Same session |
| Normal | Protocol questions, learning plan requests, time surveys, inbox acks | Within 2 sessions |
| Low | Informational broadcasts, roster corrections, mentoring updates | Log and reply when convenient |

## Required Fields (Schema Validation)

All GP outbound messages must include: `from`, `to`, `subject`, `body`, `created`, `status`.  
Messages missing any field are schema violations. Check with `gp-autq-31` procedure.

## Process

1. Sort inbox files by filename (timestamp prefix ensures chronological order).
2. Read each JSON; log `from`, `subject`, `type` to session notes.
3. Triage by priority above.
4. Reply to sender's inbox if action taken or ack needed.
5. Mark processed messages by noting them in `.agent-status.md` or session checkpoint.
6. After completing a major task, re-check inbox for messages that arrived while working.

## Known Schema Variants

Old FA-style messages (pre-2026-02-20) use `re` instead of `subject` and omit `created`/`status`. These pass content review but fail strict schema lint. Log as low-priority schema drift, do not modify originals.
