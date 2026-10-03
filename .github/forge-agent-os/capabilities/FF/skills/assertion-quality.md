# Test and Assertion Quality

## Trigger

Load when writing or reviewing a test to check that it actually verifies behavior and
fails for the right reason.

## Signs of a weak test

- **No real assertion.** The test only calls code and checks it did not throw
  ("smoke-only"), or asserts a value is truthy/defined rather than a specific expected
  outcome.
- **Asserts implementation, not behavior.** The test checks that an internal function
  or mock was called with certain arguments instead of checking the observable result a
  user or caller depends on. It breaks on safe refactors and passes on real regressions.
- **Over-broad matchers.** Asserting a type, a non-null value, or "contains something"
  where a specific value is knowable and should be checked exactly.
- **Unreviewed snapshots.** A snapshot test whose diffs are accepted without reading
  them verifies that output changed, not that it is correct.
- **Order- or state-dependent.** The test only passes because of leftover state from a
  prior test or a specific run order.
- **Testing the mock, not the system.** Every collaborator is mocked so thoroughly that
  the test only proves the mocks were wired correctly.

## Checklist for a sound test

1. Arranges realistic state or input, not a value contrived to avoid a real code path.
2. Exercises one clear behavior; failure points at one likely cause.
3. Asserts an observable outcome (return value, persisted state, emitted event,
   rendered result) rather than an internal call.
4. Is independent of other tests and of execution order.
5. Fails clearly and specifically when the behavior regresses — the failure message
   should tell a reader what broke without re-reading the test body.
6. Does not depend on incidental timing, environment, or execution order (see
   `failure-triage.md` for flakiness root causes).

## Verify a test actually protects the behavior

The strongest check is to break the behavior on purpose and confirm the test fails
(red-first). Where that is impractical retroactively, mutation testing (see
`mutation-testing.md`) gives the same signal at scale by mutating the code and checking
whether tests catch it.

## Review output

For each reviewed test or test file, record findings by severity:

- **Blocking:** the test cannot fail when the real behavior regresses (no assertion,
  asserts the wrong thing, or is currently disabled without an owner).
- **Major:** the test is flaky, order-dependent, or asserts implementation details in a
  way that will produce false failures on safe changes.
- **Minor:** naming, duplication, or missing edge case that does not currently mask a
  real regression.

Resolve blocking findings before the test is counted as coverage for the risk it claims
to address in the test plan. This review is evidence for the DRI's landing decision; it
does not authorize FF to rewrite or gate the change on its own behalf.
