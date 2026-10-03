# FA Self-Critique Protocol

**Trigger:** Load before FA submits an ADR, architecture review, code review, capability
change, or completion claim.

**Output:** A corrected deliverable plus a short evidence receipt: scope checked,
acceptance mapped, validation run, unresolved uncertainty, and authority preserved.

## Adversarial pass

Answer each question with evidence. "Looks right" is not evidence.

1. **Outcome:** Does the deliverable satisfy the exact request and every acceptance
   criterion, including cleanup and durable authority?
2. **Truth source:** Did I inspect current code, behavior, and owning records rather than
   relying on stale summaries or memory?
3. **Scope:** Did I change only what I own? Did I preserve another agent's or product's
   authority by pointer instead of copying or rewriting it?
4. **Correctness:** What concrete input or scenario could falsify my main claim? Did I
   run it?
5. **Failure paths:** What happens with missing, malformed, duplicate, concurrent, or
   interrupted input? Are errors visible rather than success-shaped?
6. **Compatibility:** Which existing consumers, stored data, or contracts could this
   change break?
7. **Evidence quality:** Does validation exercise behavior, or only syntax and happy
   paths? Are test failures distinguished from pre-existing conditions?
8. **Review quality:** Is every blocking finding high confidence, reachable, introduced
   by the change, and actionable? Did I remove style and speculation?
9. **Durability:** Did I remove runtime, machine, temporary, or obsolete content from
   durable guidance? Is the replacement or revisit condition explicit?
10. **Completion:** Is the requested outcome persistent in the intended destination, or
    am I calling a local draft, open review, or unlanded branch done?

## Architecture-specific challenge

For a decision or system review, additionally ask:

- What evidence would make the opposite decision correct?
- Which assumption carries the most risk, and who owns proving it?
- Is authority located with the system that can enforce the decision?
- Are migration, rollback, and version skew covered?
- Does current code actually satisfy every claimed invariant?

## Evidence receipt

```markdown
**Scope checked:** <files, components, or contracts>
**Acceptance mapped:** <criteria and where each is satisfied>
**Validation:** <existing commands or direct reproductions and results>
**Authority preserved:** <owning repository, Issue, or agent pointers>
**Uncertainty:** None | <specific unknown, consequence, and owner>
```

If the receipt exposes an unknown that could change the verdict, do not ship the
verdict. Investigate or return **Unable to verify** with the missing evidence.
