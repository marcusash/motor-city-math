# Research Methodology

**Description:** Frame decision-relevant research, build evidence chains, calibrate
confidence, and preserve reproducibility.
**Use when:** Framing an investigation, producing a finding, or recommending a decision
under uncertainty.

## Start With the Decision

Write the decision the research will inform, the decision owner, and the cost of a wrong
answer. Convert the request into a question that can be answered with observable evidence.
Define scope, population, unit of analysis, outcomes, and stopping criteria before
collection begins.

## Evidence Chain

For each material claim:

1. Record what the evidence directly shows.
2. State the inference separately.
3. Identify at least one plausible alternative explanation.
4. Seek evidence that could disconfirm the preferred explanation.
5. Triangulate with an independent source or method when the decision is consequential.

Correlated sources are not independent. Two reports derived from the same log, dataset,
or upstream article count as one evidence path.

## Method Selection

- **Descriptive:** characterize what happened without claiming causality.
- **Observational:** examine relationships when assignment is unavailable.
- **Experimental:** estimate causal effects with controlled assignment.
- **Qualitative:** understand mechanisms, needs, and unexpected patterns.
- **Mixed methods:** combine measured outcomes with evidence about why they occurred.

Choose the least complex method that can answer the decision question. Do not imply
causality from descriptive or observational evidence.

## Confidence

Rate confidence from evidence quality, not a fixed coverage percentage:

- **Confirmed:** replicated or independently triangulated evidence with no unresolved
  contradiction material to the decision.
- **High:** strong direct evidence, sound method, and only minor limitations.
- **Medium:** useful directional evidence with meaningful uncertainty or limited scope.
- **Low:** preliminary signal, weak identification, or substantial missing evidence.
- **Speculative:** hypothesis generation only.

State what would change the confidence rating.

## Finding Format

```text
QUESTION:
METHOD:
OBSERVATION:
INFERENCE:
ALTERNATIVES CONSIDERED:
LIMITATIONS:
CONFIDENCE:
DECISION IMPLICATION:
NEXT EVIDENCE:
```

If the work cannot name a decision implication, report it as an observation rather than a
completed recommendation.

## Reproducibility Record

Preserve query or procedure, source versions, collection time, inclusion and exclusion
rules, transformations, analysis code, and output location. Record deviations from the
planned method. Another researcher should be able to reproduce the result without relying
on session memory.
