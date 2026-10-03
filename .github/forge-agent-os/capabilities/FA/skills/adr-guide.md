# FA ADR Guide

**Trigger:** Load before proposing, recording, superseding, or reviewing a
consequential technical decision.

**Output:** A decision record in the owning repository, or an explicit conclusion that
an ADR is unnecessary. The output names the authority location, decision, evidence,
tradeoffs, owner, status, and replacement trigger.

## Decide whether an ADR is warranted

Write an ADR only when all are true:

1. A real decision has been made between credible alternatives.
2. The choice changes a durable system boundary, dependency, data contract, operating
   model, or costly-to-reverse implementation direction.
3. Future maintainers could reasonably choose differently without the rationale.
4. The repository does not already make the decision unambiguous and enforceable.

Do not use an ADR for open work, meeting notes, runtime state, implementation narration,
or a rule owned by another repository. Put unfinished decisions in an Issue. Put a
repo-local invariant in the product's authoritative agent instructions when every
executor must load it. Record a general correction in `LESSONS.md`.

## Place the record

The repository that owns the affected system owns the ADR. Cross-product decisions may
live in Forge only when Forge is the actual authority for the shared contract. Never
copy product truth into Forge to make it easier to find; link to the product record.

Forge-owned cross-cutting decisions live in `knowledge/decisions/`. That directory's
agent-audience, slug naming, and lead-with-the-rule conventions take precedence over the
generic record format below.

## Required evidence

Before accepting the decision:

- inspect the current implementation and deployed behavior;
- identify constraints and decision drivers;
- compare at least two viable options on the same criteria;
- identify migration, rollback, and compatibility effects;
- name assumptions that could invalidate the choice; and
- confirm the owner who can accept the consequences.

## Record format

```markdown
# <Decision stated as an outcome>

**Status:** Proposed | Accepted | Superseded
**Date:** YYYY-MM-DD
**Owner:** <system or role that owns the decision>
**Scope:** <affected repositories, components, or contracts>

## Context
<Problem, constraints, and evidence that force a choice.>

## Decision
<One unambiguous statement of what will be true.>

## Alternatives
- **<Option>:** <why it was not selected under the same criteria>

## Consequences
- **Benefits:** <what becomes easier or safer>
- **Costs:** <complexity, lock-in, migration, or operating burden accepted>

## Validation
<How implementation and compatibility will prove the decision works.>

## Revisit when
<Specific evidence or condition that should reopen the choice.>

## References
<Owning Issue, implementation, measurements, or superseded record.>
```

## Review verdict

Return one of:

- **Accept:** evidence supports a durable choice and the owner accepts its costs.
- **Revise:** the decision is sound but the record lacks required evidence or scope.
- **Reject:** no decision exists, authority is misplaced, or the rationale conflicts
  with current code.
- **Supersede:** a newer accepted record replaces it; link both directions.
