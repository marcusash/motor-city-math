# Reliable Pipeline Operations

## Use when

Designing, debugging, or hardening a data pipeline: scoring (e.g. sentiment or
classification), aggregation, ETL-style transforms, or any multi-step process that
turns raw records into a derived result other features depend on.

## Supported hosts

Any pipeline whose input, transform, and output can be inspected and re-run from the
current product repository. Discover the actual implementation before describing its
behavior; do not assume a specific algorithm, lexicon, or weighting scheme without
reading the current source.

## Prerequisites

- The pipeline's current source (transform code, config, or model) in the product
  repository.
- A representative input sample and its expected output.
- Knowledge of what downstream feature consumes the pipeline's output.

## Procedure

### 1. Model the pipeline as a contract

For any pipeline, state:

- **Input.** Shape and source of the raw record.
- **Transform.** The stages the record passes through, in order, described at the
  method level (e.g. "tokenize, look up weighted lexicon, apply negation and
  sparse-match dampening, normalize"), pointing to the source file for exact
  implementation rather than reproducing weights, thresholds, or lexicon contents here.
- **Output shape.** The fields the pipeline produces and their type and range.
- **Confidence signal.** Whether the pipeline emits its own confidence or reliability
  indicator (e.g. based on sample size, match count, or model score) and how consumers
  should treat a low-confidence result.
- **Failure modes.** What happens on empty input, malformed input, or a dependency
  timeout: does it throw, return a default, or silently degrade.

### 2. Verify reliability

1. Re-run the pipeline against a fixed input set and confirm output stability across
   runs (same input, same output, unless the transform is intentionally
   non-deterministic).
2. Check performance against the product's stated latency budget for the pipeline's
   call site; a pipeline embedded in a render path has a stricter budget than a
   background job.
3. Check that the pipeline's confidence signal actually correlates with quality on a
   held-out sample; a confidence label that never changes is not measuring anything.
4. Identify known limitations (language coverage, edge cases, adversarial input) and
   record them next to the contract, not as a surprise discovered later.

### 3. Harden

- Add explicit handling for the failure modes found in step 1, rather than letting
  them propagate as an unhandled exception into a caller that assumes success.
- Cache expensive pure computations only when the input is immutable for the cache's
  lifetime; invalidate on any input or model-version change.
- When aggregating pipeline output over many records (e.g. building stats or trends),
  compute the aggregate once and cache it; do not recompute an O(n) aggregate on every
  render.

## Outputs

A pipeline contract (input, transform, output shape, confidence signal, failure modes),
verification evidence (stability, latency, confidence correlation), and a documented
limitations list, all pointing to the current product source rather than duplicating
it.

## Rollback

If a pipeline change regresses output quality, latency, or a downstream consumer,
revert to the last known-good transform or model version and re-verify against the
fixed input set before reapplying the change.
