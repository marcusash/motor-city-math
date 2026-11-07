# Task continuity

An owning-repository issue is the task ledger and recovery entry point. Git stores
code and versioned files; a supported approved destination stores other
deliverables. Local conversations and worktrees are not durable publication.

## Start and resume

Resolve the authorized account, repository, host, and visibility. App, CLI, Git,
and artifact storage can use different credentials. Use a supplied issue URL or
branch/PR reference first; otherwise search repository issues, including closed
issues for completed work. Do not filter only by the current author's account.
Reuse a clear match and clarify ambiguity rather than inventing a new task.

Read the issue and linked sources before continuing. Preserve the original
request and label proposals separately from user-approved decisions. Establish
the active executor before two agents edit the same deliverable.

## Checkpoint

At meaningful milestones and before stopping or handing off, publish reviewed
task files on a feature branch and verify the remote revision. Then append an
issue comment containing executor/workstream, progress, commit/artifact links,
validation commands and results, next action, and blockers. Do not overwrite
another agent's progress or claim comments are atomic locks.

Unfinished checkpoints are WIP, not delivered. Follow repository protections and
review requirements before merging. If a push, issue write, or artifact upload
fails, report "not remotely saved", preserve local work, and name the failed step.
Never delete the only remaining copy.

## Deliverables

For repository-appropriate files, link a remotely published exact commit version.
Retain that version on the default branch or another approved durable ref before
deleting its only branch. Other files can use supported release assets or an
approved document store, with intentional versioning and retention.

Verify download/access using the intended account. Local paths, app Library
items, temporary previews, and expiring URLs are not durable copies. Do not
assume arbitrary PDF uploads to issue comments are supported by the available
API. An issue artifact card does not prove its underlying binary was uploaded.

This repository is public. Do not include Enterprise context, confidential
documents, credentials, or private transcripts here. Unknown ownership is a
blocker, not permission to use a convenient fallback repository.

## Acceptance

On machine A, create/reuse an issue for a substantial task, record an approved
decision and a proposal distinctly, publish a code checkpoint and a suitable
deliverable, and verify the links.

On machine B, start a fresh authorized session without machine A's conversation
or worktree. Discover the issue, recover the exact revision and decisions, open
the deliverable, and identify the next action. Verify concurrent checkpoint
comments survive and denied writes/access are reported without account fallback.

Record actual results on the issue. One installed policy or successful push does
not prove second-machine recovery. Quick questions should create no issue.
Cloud execution and history syncing are optional and do not replace this contract.
