# Mutation Testing

## Trigger

Load when verifying whether existing tests actually exercise the code they claim to
cover, or before trusting a line/branch coverage number as a quality signal.

## What it is

Mutation testing introduces small, deliberate faults into the code under test (a
mutant) — flipping a comparison, changing a boundary, removing a statement — and reruns
the test suite. A mutant that causes a test to fail is **killed**: the tests actually
guard that logic. A mutant that causes no test to fail **survives**: the tests exercise
that line without verifying its behavior, regardless of what coverage tooling reports.

Line and branch coverage only prove code executed during a test run; mutation testing
proves whether the assertions in that run would notice if the logic were wrong. Use it
as a diagnostic for the second question, not a replacement for `assertion-quality.md`.

## Discover before running

Find and use the product's own mutation testing tool and configuration if one exists
(for a JavaScript/TypeScript product this is commonly a Stryker config file at the
repository root or package level; other ecosystems have their own tools). Do not assume
a specific tool, config path, or invocation from memory or from another product. If the
product has no mutation testing set up, record that as a gap and, if asked to add one,
follow the product's own conventions rather than importing one wholesale from another
repository.

## Scope for cost

Mutation runs are expensive relative to the underlying tests. Scope runs to the files
or modules actually changed, or to the highest-risk area identified in
`risk-based-test-planning.md`, rather than the whole repository on every run.

## Interpreting results

- **Killed:** expected outcome; no action needed.
- **Survived:** the strongest signal — either add or strengthen an assertion so the
  mutant would be caught, or explicitly accept the residual risk with a stated reason
  (e.g., genuinely equivalent code paths, or intentionally low-risk logic).
- **No coverage / not run:** the mutated line has no test touching it at all — treat as
  equivalent to a missing test in the risk-based plan.
- **Timeout / ignored:** usually infrastructure noise (infinite loop mutants, generated
  code); exclude by configuration rather than by disregarding real survivors alongside
  them.

Do not chase a mutation score to 100%. Prioritize surviving mutants in the code the risk
plan marked as high-impact; a survivor in trivial, low-risk code is a lower priority
than one in logic with real blast radius.

## Output

A list of surviving mutants with file/location, the behavior the missing assertion
would need to check, and either the test added to kill it or the accepted-risk rationale
with an owner. This is diagnostic evidence for the DRI's landing decision, not a
standalone gate that blocks landing on its own — the product's own quality bar decides
whether a given mutation score is required to ship.
