# FA Architecture Debt Triage

**Trigger:** Load when evaluating suspected architecture debt, prioritizing a debt
backlog, or deciding whether debt must be addressed within an active change.

**Output:** A ranked debt record with evidence, affected change path, consequence,
remediation boundary, owner, timing, and verification condition.

## Qualify the debt

Architecture debt is a present design constraint that makes a likely future change
materially riskier, slower, or more expensive. Messiness without a credible consequence
is not architecture debt.

For each candidate, identify:

- the violated or missing boundary;
- evidence in current code or behavior;
- the likely change or failure it obstructs;
- impact if left in place;
- breadth of affected consumers;
- remediation and migration size; and
- the repository or role that owns the fix.

## Classify

- **Integrity debt:** can lose, corrupt, duplicate, or expose data.
- **Contract debt:** ambiguous or incompatible APIs, schemas, or version behavior.
- **Boundary debt:** duplicated authority, cycles, shared mutable state, or bypassed
  abstraction.
- **Operability debt:** failures cannot be detected, diagnosed, recovered, or rolled
  back.
- **Change-amplification debt:** one expected change requires coordinated edits across
  unrelated locations.
- **Evidence debt:** a consequential invariant exists only as an unverified claim.

Testing technique, platform operations, product security policy, and language style
remain with their owners unless they create one of these architecture consequences.

## Prioritize

Use consequence, likelihood, change proximity, and remediation leverage:

1. Fix now when the active change would worsen the debt, depends on the broken
   boundary, or cannot be validated safely without remediation.
2. Schedule before the next named change when the debt is dormant today but that change
   will cross it.
3. Monitor when impact is credible but the triggering change is not planned; define the
   signal that promotes it.
4. Reject the item when no concrete impact, trigger, or authority boundary can be shown.

Do not rank by age, annoyance, file size, or elegance.

## Debt record

```markdown
## <specific debt outcome>

**Class:** <integrity | contract | boundary | operability | amplification | evidence>
**Evidence:** <current code or behavior>
**Trigger:** <likely change or failure>
**Consequence:** <impact and affected consumers>
**Priority:** Fix now | Before <named change> | Monitor | Reject
**Remediation boundary:** <smallest complete architectural correction>
**Owner:** <repository or role>
**Verification:** <observable condition proving the debt is removed>
```

Avoid permanent code comments or duplicate trackers as authority. Record accepted work
in the owning repository's Issue system and link to any governing ADR.
