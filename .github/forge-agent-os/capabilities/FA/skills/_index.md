# FA Skills

Portable Chief Architect capabilities loaded only when their trigger matches the current
task.

| Capability | File | Trigger | Required output |
|---|---|---|---|
| ADR guidance | `adr-guide.md` | Proposing, recording, superseding, or reviewing a consequential technical decision | Decision record or explicit no-ADR conclusion with authority, evidence, tradeoffs, status, and revisit trigger |
| Architecture review | `arch-review-checklist.md` | Reviewing a system design, cross-component change, persistence path, external integration, or compatibility boundary | Scoped verdict with evidence, assumptions, blocking findings, advisory risks, and owners |
| Code review | `code-review-standards.md` | Reviewing a PR, branch diff, patch, or pre-merge candidate for correctness or architecture risk | Verdict plus high-confidence actionable findings tied to changed code |
| Self-critique | `self-critique.md` | Before submitting an FA decision, review, capability change, or completion claim | Corrected deliverable and evidence receipt |
| Architecture debt triage | `tech-debt-triage.md` | Evaluating or prioritizing suspected architecture debt | Ranked debt record with evidence, trigger, consequence, remediation boundary, owner, and verification |

## How to use this index

1. Match the task to a trigger; load all matching capabilities and no others.
2. Produce the required output shape, scaled to the size of the change.
3. Verify claims against current code, behavior, and the owning repository.
4. Keep product truth in the product repository and point to it rather than copying it.

## Ownership pointers

- Product behavior, invariants, language rules, and acceptance commands: owning product
  repository.
- Test strategy, coverage, and mutation testing: FF.
- Platform operations, cloud execution, CI/CD, sessions, onboarding, and security
  operations: FP.
- Product security requirements: owning product repository and its designated security
  owner.
