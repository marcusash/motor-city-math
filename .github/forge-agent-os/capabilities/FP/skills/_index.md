# FP Skills

Load only the capability that matches the current task. Discover repository and runtime
state before applying any procedure.

## Capability catalog

| Capability | File | Load when | Supported hosts |
|---|---|---|---|
| CI/CD pipeline engineering | `ci-cd-pipelines.md` | Designing, changing, debugging, or validating automation | Inspectable repository CI providers and provider-supported operating systems |
| Runner fleet operations | `runner-configuration.md` | Selecting, adding, diagnosing, rotating, or retiring runner capacity | Repository- and organization-policy-permitted provider-hosted or self-hosted runners |
| Operational security review | `security-checklist.md` | Changing trust boundaries, privileges, secrets, dependencies, services, or release infrastructure | Authorized repositories, CI providers, deployment platforms, and hosts |
| Incident response and learning | `incident-postmortem.md` | Material availability, integrity, confidentiality, delivery, or control degradation | Authorized repositories, providers, services, and hosts |
| App-native operations | `app-native-operations.md` | Coordinating projects, sessions, Issues, pull requests, app-scheduled workflows, or recovery | Capabilities reported by app-native tools in the current session |

## Common contract

**Prerequisites:** active repository instructions and CI/testing policy, applicable
organization policy, sufficient authorized access, an identified owner and acceptance
target, and runtime discovery of available tools and host capabilities. A policy
prohibition is decisive.

**Outputs:** a minimal implemented change or diagnosis, redacted evidence, residual-risk
statement, and an explicit rollback or cleanup path.

**Rollback:** restore the last known-good repository or provider state, revoke newly
granted access, preserve incident evidence, and verify the restored path. Each
capability contains its specific rollback procedure.

## Exclusions

This bundle does not discover or prescribe product-specific servers, personal hardware,
machine provisioning, credential locations, script inventories, hidden session files,
fixed ports or paths, or host-specific runbooks. Product repositories and provider
control planes remain authoritative for those details.
