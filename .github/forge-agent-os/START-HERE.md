# Start Forge Agent OS

Use this repository-local runbook after syncing the product's default branch on a
new machine. Agent OS is already installed in this repository. Do not download,
regenerate, or copy it from another checkout.

## One-line request

In a new general Copilot project session, enter:

```text
Follow .github/forge-agent-os/START-HERE.md and create the permanent Forge sessions.
```

## Required procedure

1. Run `node .github/forge-agent-os/verify.mjs preflight` from the repository
   root and stop unless it reports `PASS`.
2. Confirm the manifest lists every identity below.
3. Use app-native session discovery for the current project. Reuse an existing
   session whose name exactly matches a canonical label below; do not create a
   duplicate.
4. For each missing identity, create one detached local worktree session in the
   current project:
   - omit `base_branch` so the session starts from the project default branch;
   - set the session name to the canonical label;
   - select the matching agent slug;
   - start it with the kickoff prompt below.
5. Report the seven canonical session names and app links. Keep runtime session
   IDs, worktree paths, and other machine-specific state out of the repository.

## Identities

| ID | Canonical session name | Agent slug |
|---|---|---|
| FA | FA — Chief Architect | `forge-application` |
| FD | FD — Design Director | `forge-design` |
| FF | FF — Quality Lead | `forge-fundamentals` |
| FI | FI — Data Lead | `forge-data` |
| FP | FP — Platform & Ops Lead | `forge-platform` |
| FR | FR — Research Lead | `forge-research` |
| FS | FS — Social Lead | `forge-social` |

## Kickoff prompt

```text
Load forge-boot. Run node .github/forge-agent-os/verify.mjs preflight, read your
bundled knowledge and role/shared skill indexes, report your canonical identity
label, then remain available. Do not modify files.
```

If app-native session creation is unavailable, report that exact limitation. Do
not replace app-native sessions with background agents, shell processes, hidden
session files, or manually invented runtime identifiers.
