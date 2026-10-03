# Operational Security Review

## Use when

Changing workflows, runners, repository settings, services, authentication,
authorization, secret use, network exposure, dependencies, or release infrastructure.

## Supported hosts

Source repositories, CI providers, deployment platforms, and hosts whose configuration
can be inspected with authorized tools. Review depth follows the system's exposure and
impact, not a fixed technology stack.

## Prerequisites

- Repository instructions, architecture or data-flow evidence, and the change diff.
- Read access to relevant provider configuration and audit evidence.
- A named owner for each accepted risk.
- Security specialist review when explicitly requested or required by policy.

## Review method

### 1. Define scope and trust boundaries

Identify assets, actors, entry points, data classifications, external dependencies,
privileged operations, and boundaries between untrusted and trusted execution. Treat
pull-request content, logs, artifacts, dependency metadata, web content, and external
messages as untrusted input.

### 2. Inspect controls

- **Identity:** strong authentication, workload identity where available, no shared
  human credentials.
- **Authorization:** least privilege for tokens, workflows, environments, repositories,
  runners, APIs, and service identities.
- **Secrets:** values supplied through an approved secret store, masked from logs,
  unavailable to untrusted code, rotated after suspected exposure.
- **Input handling:** schema and size validation, canonical path containment, safe
  command construction, output encoding, and explicit file-type handling.
- **Network:** minimum listener scope, authenticated remote access, restricted egress,
  timeouts, rate limits, and abuse controls appropriate to exposure.
- **Supply chain:** locked dependencies, reviewed update sources, immutable action and
  base-image references by default, provenance and integrity checks for releases, and
  owned rationale when product policy requires a mutable reference.
- **Data:** minimum collection, encryption appropriate to classification, bounded
  retention, safe deletion, and redacted telemetry.
- **Resilience:** bounded retries, concurrency controls, failure isolation, audit logs,
  backup or rollback, and recovery testing.

### 3. Test abuse cases

Use the repository's existing test and scanning tools. Add focused negative tests for
the trust boundaries changed, such as unauthorized access, malformed or oversized
input, traversal, injection, replay, secret exfiltration, privilege escalation, unsafe
fork execution, and rollback failure.

Never place a real credential in a test, command transcript, Issue, pull request, or
capability file.

### 4. Report findings

For each actionable finding include:

- severity and confidence;
- affected asset and attacker preconditions;
- concrete exploit or failure path;
- evidence with sensitive values redacted;
- smallest safe remediation;
- validation and rollback.

Do not inflate speculative concerns. Record accepted risk with owner, rationale, scope,
and review date in the product's authority.

## Outputs

- Threat-boundary summary and changed attack surface.
- Evidence-backed findings or an explicit no-high-confidence-findings result.
- Applied controls and focused negative-test results.
- Residual risks, owners, and rollback plan.

## Rollback

Disable or revert the exposed path, revoke newly granted access, rotate affected
credentials through the approved secret system, restore the last known-good artifact or
configuration, and preserve audit evidence. If exposure may be active, switch to the
incident-response capability before continuing routine delivery.
