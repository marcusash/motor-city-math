# Prompt Evaluation

**Description:** Compare prompts, models, and generation systems using fair, blinded, and
repeatable evaluation.
**Use when:** Comparing prompts, models, tools, or generation strategies.

## Define the Claim

Specify the task, target users, operating context, quality criteria, critical failures,
latency and cost constraints, and the decision threshold. A prompt comparison must test a
named change, not an entire uncontrolled bundle.

## Fair Comparison

- Use identical input information, tools, context, model settings, and output constraints
  unless that factor is the independent variable.
- Randomize output order and blind raters to condition.
- Use a representative corpus plus difficult and adversarial slices.
- Run enough repetitions to characterize stochastic variation.
- Prevent reference answers or evaluation labels from leaking into the prompt.

When inputs differ in information content, the comparison measures briefing quality rather
than prompt quality.

## Rubric

Use task-specific anchored criteria. Include factuality, instruction adherence,
completeness, usability, and safety where relevant. Define critical failures separately
from scalar quality scores. Calibrate human raters on examples before the main run.

## Model Graders

Treat model grading as a measurement instrument. Validate it against blinded human labels,
measure agreement and directional bias, and version the grader model and prompt. Do not use
the same unvalidated model family as both producer and sole judge.

## Analysis

Report win, tie, and loss rates; score distributions; uncertainty; slice performance;
critical failures; latency; and cost. Inspect disagreements and representative outputs.
Do not select a winner solely from an average that hides regressions on important cases.

## Release

Freeze the winning prompt, corpus, configuration, and baseline. Add real escaped failures
to a development set, not directly to the locked holdout. Re-run the release gate after
any prompt, model, tool, or retrieval change.
