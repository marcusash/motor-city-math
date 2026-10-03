# Failure and Flakiness Triage

## Trigger

Load when a test or CI run fails, is intermittent, or a keep/fix/quarantine decision is
needed before landing a change.

## Triage sequence

1. **Reproduce.** Run the failing test in isolation, then in the same suite/order it
   originally failed in. A failure that only reproduces in one of these two conditions
   is itself a finding.
2. **Isolate the layer.** Determine whether the cause is the product code, the test
   code, the test environment, or external infrastructure. Do not default to "flaky,
   re-run it" without this step.
3. **Classify.**
   - **Deterministic product bug:** the code is wrong. Fix the code; keep the test.
   - **Deterministic test bug:** the test asserts the wrong thing, uses stale fixtures,
     or encodes an assumption that changed. Fix the test.
   - **Flaky test:** passes and fails on the same code under the same inputs. This is a
     defect in the test or in the system's determinism — never a normal condition to
     tolerate.
   - **Environment/infrastructure issue:** dependency unavailable, resource exhaustion,
     host difference. Fix the environment or the test's isolation from it.
4. **Decide.** Fix now, or record a tracked, owned, time-boxed quarantine (see below).
   Silent skip, deletion without replacement, or indefinite `.skip` is not a decision.

## Common flakiness root causes

| Symptom | Likely cause |
|---|---|
| Fails only under parallel/CI load | Shared mutable state, port/file/database contention |
| Fails only occasionally, same inputs | Unawaited async work, race condition, fixed `sleep` instead of a deterministic wait |
| Fails only in a specific run order | Test pollution — state leaking between tests |
| Fails only in one environment | Uncontrolled external dependency, clock/timezone/locale difference |
| Passes locally, fails in CI (or the reverse) | Environment drift, missing seed/fixture reset |

Prefer deterministic waits (poll for the actual condition) over fixed delays. Prefer
isolated fixtures and state reset per test over shared setup. Prefer controlling or
faking a genuinely external dependency over asserting against its live behavior.

## Quarantine discipline

A quarantined test is a tracked exception, not a resolution:

- has an owner and a linked Issue explaining the suspected cause;
- has an expiry or explicit re-evaluation point;
- is excluded visibly (a named skip/tag), never silently deleted;
- does not quietly reduce the risk coverage established in the test plan without the
  DRI knowing.

## Output

For each triaged failure, record: what failed, reproduction steps, isolated layer,
classification, root cause, and the decision (fixed / quarantined with owner and expiry
/ intentionally removed with rationale). This record is triage evidence for the DRI's
landing decision — it does not authorize shipping with unexplained red or silently
skipped tests.
