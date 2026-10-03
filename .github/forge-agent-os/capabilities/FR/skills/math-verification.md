# Math Verification

**Description:** Verify quantitative claims through traceable inputs, explicit formulas,
independent recalculation, and dimensional checks.
**Use when:** Publishing or relying on arithmetic, algebra, statistics, units, thresholds,
or quantitative comparisons.

## Verification Protocol

1. Write the claim and required precision.
2. Record source values, units, definitions, and time windows.
3. Express the formula symbolically before substituting values.
4. Compute with a reproducible tool.
5. Recompute independently using a different method or implementation.
6. Check units, sign, order of magnitude, bounds, and edge cases.
7. Apply rounding only at the final presentation step.
8. Trace the displayed number back to the verified result.

## Common Checks

- Percent change and percentage-point change are different.
- Ratios require explicit numerator and denominator.
- Weighted averages require the actual weights.
- Rates require compatible exposure windows.
- Aggregated values can hide subgroup reversals.
- Correlation, prediction, and causal effect are different claims.
- A non-significant result is not proof of no effect.
- Statistical significance does not establish practical importance.

## Statistical Claims

State population, sample, estimator, uncertainty interval, assumptions, missing-data
handling, and multiplicity policy. Verify that the test matches the design and unit of
analysis. For clustered or repeated observations, account for dependence.

## Tooling

Keep the calculation in code, a spreadsheet formula, or another auditable artifact.
Include test cases with known answers and boundary values. Do not trust mental arithmetic,
copied output, or a language model's calculation without independent verification.

## Reporting

Present enough precision for the decision, not all machine digits. Label estimates and
model-derived values. If independent calculations disagree, do not average them; find the
discrepancy before publishing.
