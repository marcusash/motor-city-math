# MCM Dashboard Score Display Failure - Postmortem

Date: 2026-02-22
Severity: P1
Status: Resolved
Authors: FA (investigation, deploy), FR (root cause analysis)

## Root Cause

One character on line 656 of index.html inside buildStandards().
A spurious closing single-quote terminated the JS string early.
The browser JS parser rejected the entire script block (lines 427-1073).
No function in that block ever loaded: buildChart, updateUpNext, rerenderAll, DOMContentLoaded listener.
The page loaded silently with zero visible JS errors.
The seed script worked because it lives in a separate script tag.

Fix: remove the spurious quote.
  BROKEN:  + pct + '%'" aria-valuenow="' +
  FIXED:   + pct + '%" aria-valuenow="' +

Committed: 6bd2ee6

## Why FA Missed It

FA made 4 fix attempts targeting the data/fetch path.
Assumption: data was not reaching render functions.
Actual: render functions did not exist at all.
FA did not run node --check on the live HTML. FR did.

Lesson: when JS functions appear to not run, check whether they were ever parsed. Evidence chain first.

## Deploy Complication

motor-city-math had diverged from kai-algebra2-tests by 12 commits.
FA did not run git fetch public before pushing. Operational miss.
PAT lacks workflow scope; merge brought in workflow file.
Fix: git rm --cached .github/workflows/publish-to-motor-city-math.yml, amend, push.

## What FR Did Right

FR fetched the live HTML directly. Ran node --check. Got a SyntaxError on line 656.
Did not accept FA diagnosis at face value. Evidence chain before conclusion.

## Recommendations

1. Add node --check index.html to pre-deploy checklist.
2. Add git fetch public before any push to public remote.
3. Build scripts/publish-local.cjs that includes both checks.
