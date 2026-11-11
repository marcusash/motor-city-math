# Single-source publishing

**Status:** active, supersedes the former two-repository sync procedure.

The only working and publishing repository is
[`marcusash/motor-city-math`](https://github.com/marcusash/motor-city-math).
The site is https://marcusash.github.io/motor-city-math/.
GitHub Pages builds this repository's `master` branch from `/`.
There is no development-to-publish mirror or repository transfer.

## Work and preserve

1. Verify the repository, intended account and write permission. App, CLI and Git
   credentials can differ. An inherited `GH_TOKEN` can override stored accounts.
   Never display tokens, change credentials silently or use an unrelated account.
2. Read the owning issue and current source. Use feature branches and pull requests
   into `master`; do not push directly to `master` or bypass required review.
3. Keep all approved editable product files and required public assets in this
   repository. Preserve content and reconcile newer work instead of copying an
   entire old checkout. Do not copy private scans, credentials, unrelated history
   or infrastructure from another repository.
4. Push task files to an authorized feature branch and read back the immutable
   commit and important file bytes. Link the receipt from the issue and README
   where applicable. A local commit or successful push alone is not verification.

## Release checks

Run from this repository's root:

```powershell
node tests/verify-practice-exams.js
node scripts/gp-exam-health.js
node tests/release-readiness-check.js
```

Run the targeted checks for changed reports, grading data and UI as well. If a
mandatory gate fails, preserve the work on a feature branch, record the exact
failure and stop before release. Distinguish pre-existing failures from changes
introduced by the task, but do not silently waive a hard failure.

## Deploy and verify

After review, all required checks and merge authorization are satisfied, merge
the pull request normally. GitHub Pages publishes the merged `master` tree,
including approved reports and printable documents; no copying script is needed.
Verify Pages' build commit and the actual live page and asset bytes before saying
the release is deployed. Record the merged commit, deployment and immutable
artifact links on the issue.

For rollback, create a reviewed revert pull request. Never force-push `master`.

## Retired entrypoints and historical sessions

`scripts/publish.cjs`, `scripts/publish-local.cjs` and
`scripts/scripts/publish.cjs` now fail explicitly without network, filesystem,
credential or Git mutations. Do not restore the former clone-and-copy workflow
or its separate publishing token.

Old conversations may still display an old repository association. Changing a
Git remote does not change the app's session metadata. Use a supported app
operation for that association; do not modify app databases or create replacement
sessions without authorization. Keep original workspaces and files until unique
work is remotely verified and cleanup is explicitly approved.
