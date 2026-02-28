# GP Dependency Map

Which agents and systems GP depends on to execute its work.

## Agent Dependencies

| Agent | What GP needs from them | Frequency |
|-------|------------------------|-----------|
| **GR** (Research) | Correct answer keys, math verification, RP question authoring | Every exam |
| **GA** (App Engineer) | exam.html selector updates after new exam added | Every exam |
| **GD** (Design) | Visual design specs for new UI features GP tests | Occasional |
| **GF** (QA) | Cross-validation of GP tests; schema guard results | Ongoing |
| **GI** (Data) | Data specs for new RP exam distributions | Per sprint |
| **FA** (Forge Architect) | Architecture review for infra proposals | Occasional |
| **Marcus** | Go/no-go on p-impl tasks, exam approval, sprint direction | Every session |

## System Dependencies

| System | What GP uses | Risk if down |
|--------|-------------|--------------|
| Node.js ≥18 | All tests and scripts | High — no tests |
| Git | All commits and history | High — no delivery |
| GitHub | CI workflows, remote origin | Medium — local ok |
| `.agent-comms/` | Inter-agent messaging | Low — can use .marcus-queue.md |
| `data/_backups/` | Rollback if exam JSON breaks | High — data loss risk |

## Critical Path for Exam Ship

```
GR writes questions → GP verifies → GP commits stub → GP tests pass
→ GA integrates in exam.html → Marcus approves → Kai studies
```

GP is the gate between authoring (GR) and delivery (GA/Marcus).

## What GP Does NOT Depend On

- No server, no database, no npm build
- No design assets (GP owns test/script files, not UI)
- No external APIs or CDNs

---

*Owner: GP | Last updated: 2026-02-23*
