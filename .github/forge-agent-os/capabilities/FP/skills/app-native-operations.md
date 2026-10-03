# App-Native Operations

## Use when

Creating, finding, coordinating, recovering, reviewing, or cleaning up work through the
Copilot app's project, session, Issue, pull-request, workflow, and canvas tools.

## Supported hosts

App-native operations exposed by the tools available in the current session. Tool
availability and schemas are discovered at runtime. Local, cloud, worktree, and branch
sessions are supported only when the relevant app tool reports that capability.

## Prerequisites

- A product repository and Issue when the work needs a durable record.
- One DRI and one primary executor.
- The active repository's instructions, authority pointers, and acceptance criteria.
- App-native tools sufficient for the requested operation.

## Discovery

Use app-native listing and inspection tools to discover projects, sessions, branches,
linked Issues or pull requests, active plans, diffs, and workflows. Reuse returned
handles only for the active operation. Do not copy runtime identifiers, workspace paths,
or transient state into source files, Issues, capability docs, or long-lived prompts.

## Session choice

- Continue in the current session for the assigned primary deliverable.
- Create a child session only for a separately owned leaf or independent support work.
- Use a worktree for isolated repository changes by default.
- Use a branch session only when working intentionally in an existing checkout.
- Use a cloud session only when the repository and task support it and remote execution
  is useful.
- Stack on the current branch only when the new work explicitly depends on its commits.

Never delegate the assigned primary deliverable merely because another agent, model, or
workspace could perform it.

## Coordination

1. Put scope, owner, dependencies, acceptance, and blockers in the product Issue.
2. Use direct app-native messages for timely coordination with the actual owner.
3. Inspect a pending plan before approving or rejecting it.
4. Treat cross-session summaries as leads, then verify important claims against the
   repository, diff, run, or Issue.
5. Use pull-request and review-thread tools for durable code-review communication.
6. Keep human-facing outbound content behind the required draft-and-approval gate.

## Recovery

When a session stalls or fails:

1. Inspect its app-native status and durable repository state.
2. Preserve uncommitted work when accessible.
3. Continue from the committed branch or create a replacement session from the correct
   base.
4. Restate the Issue, owner, scope, acceptance, and known evidence in the replacement
   kickoff.
5. Verify the replacement is attached to the intended repository and branch before
   editing.

Do not repair app runtime state by editing hidden session files or guessing identifiers.

## Cleanup

After accepted work is delivered, retire superseded pull requests, temporary branches,
and child sessions using app-native tools. Archive or delete only resources the current
session is authorized to manage. Never delete a session or worktree merely to hide an
unresolved conflict or failed delivery.

## Outputs

- Correct project/session placement and direct owner coordination.
- Durable Issue and pull-request references for decisions and implementation.
- Verified delivery state, with runtime handles kept transient.
- Cleanup of superseded app-native resources.

## Rollback

Stop or archive newly created child work, return coordination to the durable Issue,
restore work from the last committed branch, and reopen or recreate only the minimum
session needed. Repository history, not app runtime metadata, is the recovery anchor.
