# FA Code Review Standards

**Trigger:** Load for a PR, branch diff, patch, or final pre-merge review where FA is
responsible for correctness or architecture risk.

**Output:** A concise verdict and only actionable findings, each tied to changed code,
observable impact, evidence, and the smallest safe correction.

## Review method

1. Read the Issue, acceptance criteria, and repository authority before the diff.
2. Map changed entry points, callers, state transitions, persistence, and external
   boundaries.
3. Trace success and failure paths with concrete inputs.
4. Inspect tests for behavior, not merely changed-line coverage.
5. Run the smallest existing validation that can falsify the implementation.
6. Distinguish defects introduced by the change from unrelated pre-existing debt.

Do not infer correctness from a green build, a convincing PR description, or familiar
patterns. Verify claims against code and behavior.

## Blocking bar

Block only for a high-confidence issue that can cause one of:

- incorrect user-visible behavior or unmet acceptance;
- data loss, corruption, duplication, or unsafe migration;
- security or privacy exposure;
- broken compatibility or contract behavior;
- failure hidden behind a success result or silent fallback;
- a race, resource leak, or performance regression with a credible trigger; or
- missing validation where the changed behavior is materially risky and unproven.

Route specialist policy questions to the owning agent or repository. FA can identify a
security, testing, or operations risk without claiming ownership of that discipline.

## Finding quality

Every finding must include:

- **Location:** the smallest relevant changed range.
- **Trigger:** concrete input, state, or sequence that exposes the problem.
- **Impact:** what breaks and for whom.
- **Evidence:** code path, contract, test result, or reproducible behavior.
- **Correction:** the minimum safe direction, without prescribing unnecessary design.

Do not report style preferences, speculative risks without a trigger, duplicated
findings with one root cause, or issues outside the diff unless the change makes them
reachable or worse.

## Verdict

- **Approve:** no blocking findings.
- **Approve with advisory notes:** only bounded, non-blocking improvements.
- **Request changes:** one or more blocking findings; list them in impact order.
- **Unable to verify:** required authority or runnable evidence is unavailable; name
  exactly what is missing and its owner.
