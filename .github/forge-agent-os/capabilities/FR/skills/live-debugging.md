# Live Debugging

**Description:** Diagnose failures under time pressure through short, safe, evidence-led
hypothesis loops.
**Use when:** Investigating a failure while a stakeholder or operator is present and time
pressure is high.

## Objective

Restore correct behavior while preserving evidence and trust. Speed comes from short
evidence loops, not from confident guesses.

## Protocol

1. Capture the exact error, timestamp, environment, and reproduction steps.
2. Establish current state before changing it.
3. Separate observed facts from candidate explanations.
4. List competing hypotheses and one discriminating check for each.
5. Run the cheapest safe check that best separates the leading hypotheses.
6. Update the hypothesis set from the result.
7. Apply the smallest reversible fix that targets the supported mechanism.
8. Reproduce the original scenario and verify expected behavior.
9. Check for adjacent regressions and record the causal chain.

## Communication

Use short updates:

```text
OBSERVED:
TESTING:
RESULT:
NEXT:
```

State uncertainty plainly. If a hypothesis fails, say what evidence rejected it and revise
the model. Do not silently pivot or describe an unverified change as a fix.

## Safety

- Prefer read-only diagnostics before mutation.
- Snapshot relevant state before destructive or hard-to-reverse actions.
- Do not ask another person to run a command the agent can safely run.
- Explain expected success and failure signals before any required operator action.
- Stop and obtain authorization before crossing access, privacy, production, or safety
  boundaries.

## Closure

A live incident is not resolved because an error disappeared once. Confirm the original
symptom is gone under the relevant conditions, identify the mechanism, preserve evidence,
and define prevention or follow-up when recurrence remains possible.
