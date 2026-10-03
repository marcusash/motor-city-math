# FA Architecture Review Checklist

**Trigger:** Load when reviewing a proposed system design, ADR, cross-component change,
new persistence path, external integration, or compatibility boundary.

**Output:** A scoped architecture verdict with evidence, blocking findings, advisory
risks, explicit assumptions, and required follow-up owners.

## Establish scope first

Name the behavior under review, authoritative repositories, changed boundaries, and
evidence inspected. Separate verified current behavior from proposed behavior. If
product requirements or specialist policy are missing, point to the owner rather than
inventing them.

## Review dimensions

1. **Responsibilities:** Does each component have one coherent reason to change? Are
   ownership and dependency direction explicit?
2. **Data authority:** Where is each durable datum created, validated, mutated, and
   reconciled? Multiple writers are acceptable only with a defined consistency model.
3. **Contracts:** Are schemas, API semantics, versioning, and compatibility behavior
   explicit at every boundary?
4. **Failure behavior:** What can fail, where is the error surfaced, what is retried,
   and which operations are idempotent?
5. **Consistency and recovery:** What happens on interruption, duplicate delivery,
   partial completion, or concurrent mutation? How is recovery proven?
6. **Security assumptions:** What crosses trust boundaries, which actor is authorized,
   and where are sensitive values minimized? Route specialist findings to the owning
   security authority.
7. **Evolution:** How are existing consumers, stored data, and old versions migrated or
   rolled back?
8. **Operability:** Which signals distinguish healthy, degraded, and failed states?
   Can an operator diagnose the failing boundary without inspecting private data?
9. **Scale and limits:** What measured workload, latency, storage, or cost limits apply?
   Test a credible growth factor rather than an arbitrary universal target.
10. **Evidence:** Do code, tests, measurements, and deployed behavior support the
    claims? Written invariants that current code violates are proposals, not facts.

## Finding severity

- **Blocking:** The design can lose or expose data, violates an accepted contract,
  cannot recover safely, has no accountable authority, or cannot meet an acceptance
  requirement.
- **Required before delivery:** A material risk lacks mitigation or validation but does
  not invalidate the design.
- **Advisory:** A bounded improvement with no demonstrated delivery risk.

## Output template

```markdown
## Architecture review: <system/change>

**Scope:** <components and contracts reviewed>
**Evidence:** <code, ADRs, tests, measurements, deployed behavior>
**Assumptions:** <unverified premises>
**Verdict:** Accept | Accept with required changes | Changes required

### Blocking findings
- <severity, evidence, consequence, required correction, owner>

### Required before delivery
- <risk, validation or mitigation, owner>

### Advisory
- <bounded improvement>

### Authority and follow-up
- <owning repository or decision record; unresolved owner and due condition>
```
