# Metrics Validation

## Use when

Defining, checking, or presenting any metric, count, rate, or trend before it reaches
Marcus, another agent, or a durable record. Applies to one-off numbers and recurring
dashboards alike.

## Prerequisites

- The metric's source data and the query or computation that produced it.
- The prior value or baseline, if one exists.
- Knowledge of what the denominator represents and how it was scoped.

## Evidence checklist

Before presenting any metric, confirm all of the following:

1. **Sample size.** State `n`. Fewer than 30 data points is preliminary; say so.
2. **Time window.** State the exact window. Flag cherry-picked or unusually short
   windows.
3. **Baseline.** State the prior value and the trend direction, not just the current
   number.
4. **Denominator.** State what the denominator is. A percentage without a stated
   denominator is not a metric, it is a claim.
5. **Correlation vs. causation.** If the metric is presented as caused by a change,
   name what else changed in the same window.
6. **Provenance.** State where the number came from: a query against product data, a
   provider API response, or a manual count. See `provider-provenance.md` when the
   source is an external provider.

## Confidence tiers

| Tier | Condition |
|---|---|
| High | n > 100, stable measurement method, window representative of normal operation |
| Medium | n 30-100, or method recently changed, or window partly atypical |
| Low | n < 30, first measurement, known data-collection gap, or contested denominator |

State the tier alongside every metric. A metric with no stated tier is treated as Low.

## Privacy rule

Do not report or retain a metric at a granularity that identifies an individual unless
the product's stated purpose and consent basis cover that use. Aggregate to the
smallest group size the decision actually requires. See `voice-identity-governance.md`
when the underlying data is personal communication, voice, or identity material.

## Red flags

- A metric improved but the underlying user experience did not: the metric is
  measuring the wrong thing.
- Two metrics that should move together contradict each other: investigate before
  reporting either.
- A metric moved sharply overnight with no matching product change: suspect a
  data-collection break, not a real shift.
- "100% success" on a nontrivial process: the sample is too small or errors are being
  swallowed before they are counted.

## Output contract

Every metric presented to Marcus or another agent states, at minimum:

```
value | trend (up/down/flat vs. baseline) | time window | sample size | confidence tier
```

Show ranges, not only averages, for latency- or duration-style metrics (median and
p95, not just mean). If a metric is genuinely new, say "first measurement, no trend
yet" instead of inventing a baseline.

**Insufficient-evidence statement.** Report no number at all, and say so explicitly,
when any of these hold: the denominator is unknown or contested, the sample is zero or
the source query fails, or the only available data collection method is known to be
broken. This is distinct from the Low confidence tier, which still reports a number;
insufficient evidence means there is no number to report yet.

## Rollback

If a published metric is later found to rest on a broken query, wrong denominator, or
contaminated window, correct the record explicitly: state the old and new value, the
cause, and the window during which the wrong number was live. Do not silently replace
a number.
