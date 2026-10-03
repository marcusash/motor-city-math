# Evaluation Lifecycle

**Description:** Design and maintain versioned, calibrated evaluation systems from corpus
construction through regression monitoring.
**Use when:** Building or maintaining repeatable quality evaluation for a model, agent,
prompt, retrieval system, or product behavior.

## Lifecycle

1. **Purpose:** define the decision, target behavior, users, and failure costs.
2. **Specification:** convert requirements into observable criteria and critical failures.
3. **Corpus:** sample realistic, diverse, adversarial, and boundary cases with provenance.
4. **Rubric:** define anchored scores, weights, pass rules, and non-compensable failures.
5. **Calibration:** train raters on shared examples and resolve rubric ambiguity.
6. **Baseline:** freeze system version, corpus version, evaluator version, and results.
7. **Execution:** run blinded, repeatable evaluation with captured outputs and metadata.
8. **Analysis:** report distributions, slices, uncertainty, disagreements, and failure
   clusters.
9. **Decision:** map results to release, rollback, iteration, or further evidence.
10. **Maintenance:** add escaped failures to a development set, not directly to the locked
    holdout; monitor drift; and retire invalid items.

## Corpus Rules

Keep a locked holdout for release decisions. Deduplicate semantically, not only by exact
text. Track source, consent or usage basis, difficulty, capability, and risk tags. Prevent
training or prompt-tuning examples from leaking into the holdout.

## Evaluators

Human review is required for subjective or high-impact judgments. Model graders may scale
evaluation only after calibration against human labels. Measure agreement, inspect
disagreements, and version grader prompts and models.

## Regression Gate

Define thresholds before the run. Include overall quality, critical failure count,
high-risk slices, latency, and cost where relevant. Aggregate gains never compensate for a
new critical failure unless the decision owner explicitly accepts that tradeoff.

## Eval Record

Record system commit, model and parameters, prompt version, dataset version, evaluator
version, execution time, random seed where applicable, raw outputs, scores, and analysis.
An average score without failure examples and slice results is not a complete evaluation.
