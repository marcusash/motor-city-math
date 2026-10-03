# CI/CD Pipeline Engineering

## Use when

Designing, changing, debugging, or validating automated build, test, release, deploy,
or repository-automation workflows.

## Supported hosts

Repository CI providers and operating systems whose configuration and current
capabilities can be inspected from the active repository and provider APIs. Examples
may include GitHub Actions on Linux, Windows, or macOS, but support is evidence-based,
not assumed.

## Prerequisites

- Read access to repository instructions, workflow definitions, manifests, and recent
  run evidence.
- Provider access sufficient for the requested read or change.
- The repository's existing build, test, lint, package, and deployment commands.
- An identified rollback target, normally the last known-good workflow revision.

## Procedure

### 1. Discover the contract

1. Read repository instructions and the linked Issue.
2. Enumerate workflow files, reusable workflows, actions, manifests, lockfiles, and
   environment declarations.
3. Inspect repository and organization settings that affect permissions, runners,
   environments, required checks, and secrets without exposing secret values.
4. Inspect recent runs by workflow, event, branch, commit, conclusion, duration, and
   runner labels.
5. Record the exact failing job and first causal error. Later failures are often
   consequences.

### 2. Model the pipeline

For each job, identify:

- trigger and concurrency behavior;
- inputs, outputs, dependencies, and artifacts;
- requested permissions and environment gates;
- runner requirements and toolchain setup;
- cache keys and invalidation;
- retry, timeout, and cancellation behavior;
- release or deployment side effects.

Separate repository defects from provider outages, policy restrictions, runner
capacity, flaky tests, and expired external dependencies.

### 3. Make the smallest complete change

- Reuse repository commands rather than creating a second build path.
- Pin third-party actions and base images to approved immutable references. If product
  policy requires a mutable reference, record its owner, rationale, and update control.
- Declare the minimum job or workflow permissions.
- Bound execution with timeouts and intentional concurrency.
- Keep untrusted pull-request code away from write tokens and protected environments.
- Make caches disposable and artifacts traceable to commit and run.
- Before adding or changing a scheduled trigger, verify the target runner pool can
  service it when otherwise idle and bound failure-notification volume.
- Add manual invocation only when it is a useful diagnostic or controlled release path,
  not as a universal requirement.

### 4. Validate

1. Validate syntax with an existing repository tool or provider parser.
2. Run the smallest local command that covers changed behavior.
3. Inspect the diff for accidental trigger, permission, secret, or runner changes.
4. Execute an appropriate provider event or manual run when authorized.
5. Confirm every required job, artifact, and environment result against the same commit.

Do not declare success from a green rerun alone. Explain why the change addresses the
first causal failure and whether nondeterminism remains.

## Outputs

- A minimal workflow or repository-configuration change.
- Evidence: repository, commit, workflow, run URL or identifier, job conclusion, and
  relevant log excerpts with secrets redacted.
- A concise statement of trigger, permissions, runner requirements, and residual risk.
- Rollback instructions tied to a known-good revision.

## Rollback

Revert the workflow or configuration change, cancel newly queued runs if they could
cause harm, restore the prior required-check or environment configuration, and run the
previous known-good path. Never delete logs or artifacts needed to understand a failed
deployment.
