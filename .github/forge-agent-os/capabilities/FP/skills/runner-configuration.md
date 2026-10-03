# Runner Fleet Operations

## Use when

Choosing runner capacity, adding or retiring a self-hosted runner, diagnosing queued
jobs, or changing runner labels, groups, images, or autoscaling.

## Supported hosts

Provider-hosted runners and self-hosted runner platforms permitted by active repository
and organization policy and supported by the provider. Host operating system and CPU
architecture must be discovered before configuration.

## Prerequisites

- Read access to the active repository CI/testing policy, organization runner policy,
  workflow requirements, recent run evidence, runner inventory, and provider policy.
- Administrative access only when changing runner scope, groups, labels, or
  registration.

Confirm runner policy before evaluating capacity. An active repository or organization
prohibition is decisive; do not propose, configure, or route work to the prohibited
runner class.

Self-hosted registration additionally requires shell access to the intended host,
verified network egress, a service-account policy, an update mechanism, a cleanup
owner, and an evidenced requirement that hosted capacity cannot meet more safely.

## Selection

Consider hosted, ephemeral capacity only after confirming active repository and
organization policy permits it. When permitted, prefer it if it satisfies platform,
performance, network, and compliance requirements. Use self-hosted capacity only when
policy permits it and an evidenced need exists, such as specialized hardware, private
network access, licensed tooling, or measured performance.

Before selecting labels, query the current fleet and workflows. Labels express actual
capabilities, not desired capabilities. Verify:

- registration scope and runner group;
- online, busy, and ephemeral state;
- operating system, architecture, and installed toolchain;
- workflow access policy;
- update status and supported runner version;
- concurrency, queue depth, and expected trigger volume.

## Self-hosted registration

1. Define scope, trust boundary, labels, update owner, capacity, and retirement date.
2. Obtain the runner package from the provider's canonical source and verify its
   published integrity information when available.
3. Match the package to the discovered host operating system and architecture.
4. Create a dedicated, least-privileged service identity and isolated work directory.
5. Generate the short-lived registration credential immediately before use. Never
   print, persist, or commit it.
6. Register at the narrowest practical scope and apply only verified labels.
7. Configure unattended startup using the platform-supported service mechanism.
8. Run a non-production smoke workflow that proves checkout, toolchain, artifact
   handling, cleanup, and label routing.
9. Confirm the work directory does not retain credentials or sensitive job data.

Do not route untrusted contributions to persistent self-hosted runners with privileged
network or credential access.

## Diagnostics

1. Inspect provider queue and assignment evidence before touching the host.
2. Confirm a matching online runner exists and is authorized for the repository.
3. Inspect runner service state, provider diagnostic logs, disk, memory, network, time
   synchronization, and update status using host-native tools.
4. Reproduce with a minimal diagnostic workflow that has no production side effects.
5. Distinguish label mismatch, access policy, exhausted capacity, host failure, and
   provider outage.

## Retirement and rotation

Drain new work, wait for or cancel active jobs according to impact, unregister from the
provider, stop and remove the local service, remove the work directory, revoke or rotate
associated credentials, and verify no workflow still targets orphaned labels.

## Outputs

- A runner decision record: hosted or self-hosted, scope, labels, trust boundary, owner,
  capacity, and retirement conditions.
- Provider and host evidence with credentials and private data redacted.
- A successful smoke-run reference or a documented diagnosis.
- Explicit rollback or retirement steps.

## Rollback

Restore workflows to the prior runner labels or hosted image, unregister the new runner,
remove its service and work directory, and verify queued jobs can route to known-good
capacity. Preserve diagnostic logs needed for an incident.
