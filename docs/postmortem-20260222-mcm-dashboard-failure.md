# Postmortem: MCM Dashboard Empty Chart and Missing Score Data

**Severity:** P1 -- site appeared broken to Marcus; Kai's progress was invisible
**Reported by:** Marcus (screenshot of blank chart)
**Root cause by:** FR (evidence-chain methodology)
**Fix deployed by:** FA
**Date:** 2026-02-22
**Status:** Resolved. Live site verified by Marcus.

---

## What Happened

The MCM dashboard at https://marcusash.github.io/motor-city-math/ showed an empty chart and
default "Up Next" placeholder text. No score data rendered. No console errors visible. The
site appeared completely broken to Marcus and Kai.

FA made 4 fix attempts targeting the data fetch and localStorage path. All passed individual
syntax checks. None fixed the symptom.

FR was brought in to find the root cause independently.

---

## Root Cause

One character on line 656 of `C:\GitHub\kai-algebra2-tests\index.html` inside `buildStandards()`:

```
BROKEN:  + pct + '%'" aria-valuenow="' +
FIXED:   + pct + '%" aria-valuenow="' +
```

The spurious closing single-quote (`'`) after `%` terminated the JS string early. The browser
JS parser rejected the ENTIRE main script block (lines 427-1073). No function in that block
ever loaded: `buildChart()`, `updateUpNext()`, `rerenderAll()`, the `DOMContentLoaded` listener.
None.

The page loaded silently with zero visible JS errors because a parse failure at block level
suppresses the entire block without throwing at runtime. The DevTools console showed no errors.
The seed script worked because it lives in a separate `<script>` tag, unaffected by the failure.

---

## Why FA Missed It (4 Fix Attempts)

FA's fix attempts targeted the data fetch and localStorage path. The assumption was: data is not
reaching the render functions. That assumption was wrong. The render functions did not exist at
all -- they were never parsed.

FA ran `node --check` on individual extracted function bodies. Those passed because the syntax
error only appears in context, not in an isolated function. FA did not run `node --check` on the
full script block as fetched from the live HTML.

**Lesson:** When JS functions appear to not run at all, the first question is whether they were
ever parsed -- before assuming data or logic errors. `node --check` on the full live script block
takes 5 seconds and would have found this immediately.

---

## How FR Found It

FR applied the evidence-chain methodology:

1. Did not accept FA's diagnosis (data path) at face value.
2. Fetched the live HTML directly.
3. Ran `node --check` on the full extracted main script block (not individual functions).
4. Got a clean SyntaxError pointing to line 656.
5. Named the root cause only after the evidence chain was complete.
6. Delivered a single-line fix with exact before/after.

FR committed the fix to `kai-algebra2-tests` as `6bd2ee6`.

---

## Deploy Complication

The `motor-city-math` public repo (GitHub Pages) had diverged from `kai-algebra2-tests` by 12
commits. Direct pushes had been made to `motor-city-math` during a previous session, creating
independent commit history.

FA attempted `git push public master`. Rejected: public remote had 12 commits not in local.

FA merged `public/master`. Conflict on index.html line 656 -- public still had the bug, HEAD had
the fix. Took HEAD.

Second push rejected: the PAT (fine-grained, `motor-city-math` Contents only) lacks workflow
scope. The merge had brought in the GitHub Actions workflow file from `kai-algebra2-tests`
history. `motor-city-math` does not have that file in its history. Resolved by removing the
workflow file from the merge commit via `git rm --cached`, then amending and pushing.

GitHub Pages rebuilt. Marcus verified: chart correct, Dad View active, Practice #4 shown in
Up Next.

**Operational miss:** FA did not run `git fetch public` before attempting the push. Always
fetch from a deployment target with independent commit history before pushing.

---

## Changes Made

| File | Change |
|------|--------|
| `C:\GitHub\kai-algebra2-tests\index.html` line 656 | `'%'"` to `'%"` (one char) |
| Private repo (`kai-algebra2-tests`) | Commit `6bd2ee6` (FR) |
| Public repo (`motor-city-math`) | Pushed by FA after merge conflict resolution |

---

## Learnings

### 1. Parse before debugging logic

When a JS block appears to not run at all, run `node --check` on the full live script block
first. A parse failure is invisible at runtime but deterministic and fast to find with the right
tool. FA's 4 fix attempts skipped this step because the assumption was logic failure, not parse
failure. That assumption cost 4 debug cycles.

**Added to MCM pre-deploy checklist:** run `node --check` on the script block extracted from
index.html before any push to motor-city-math.

### 2. Fetch before you push to a split-history remote

`motor-city-math` and `kai-algebra2-tests` diverged because direct pushes went to the public
repo during a prior session. This split history is now permanent. Every future push to the public
remote requires `git fetch public` first to avoid rejected pushes and merge conflicts.

**Added to publish-runbook.md as a mandatory pre-publish step.**

### 3. PAT scope must include Workflows if merging across repos

The fine-grained PAT for `marcusash/motor-city-math` (Contents: Read and Write) does not cover
Workflows. Merging from a repo with a workflow file brings that file into the tree. The push
will be rejected unless the PAT has Workflows: Read and Write.

Resolution: always `git rm --cached .github/workflows/*` before pushing from `kai-algebra2-tests`
to `motor-city-math`, or add Workflows scope to the PAT (see publish-runbook.md token setup).

### 4. Evidence-chain methodology works

FA made 4 informed attempts using partial evidence (function-level node --check, localStorage
path inspection). FR used one tool on the right input and found the root cause in one pass.

The difference was not capability -- it was methodology. Fetch the actual failing artifact.
Run the diagnostic on the exact input the browser sees. Name the root cause only after the
evidence chain is complete.

---

## Pre-Deploy Checklist (MCM)

Add these steps before every push to motor-city-math:

```powershell
cd C:\GitHub\kai-algebra2-tests

# 1. Fetch public remote first
git fetch public

# 2. Extract main script block and syntax-check it
# (manual: copy lines 427-1073 from index.html into a temp .js file)
# Or use the publish parity check:
node --check index.html  # for inline scripts, use a script extractor

# 3. Push (or use publish script)
git push public master
# or: node scripts\publish.cjs
```

---

*-- FR (Forge Research), 2026-02-22*
*Postmortem draft by FA (Chief Architect). Filed and learnings extracted by FR.*
