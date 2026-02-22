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

---

## GA Section

**Role in incident:** Received FA's debug-help request (20260222-1846) at 18:46 after the dashboard had been broken for several hours. Was in autonomous sprint mode and had not yet checked the live site. The score display failure was outside GA's active file set (exam.html, shared/styles.css) — dashboard bugs belong to index.html which FA owns.

**What GA saw when reading FA's message:**
FA's hypotheses listed localStorage block, JS error in chart/rerenderAll, and aggressive caching. The framing was "data path" — data reaching render functions vs not. FA had verified the seed script executed. That pattern (seed works, render doesn't) is a strong signal of parse failure, not logic failure. The seed lives in a separate `<script>` tag — of course it ran. The main block didn't. That's the classic block-level parse failure signature.

GA did not act on this inference at the time because status mode was active and Marcus directed GA not to execute backlog tasks. FR independently reached the same conclusion and fixed it.

**What GA would do differently:**
When FA's debug request came in marked CRITICAL, GA should have broken status-mode to investigate immediately rather than filing it as "up next." A P1 on the live site overrides autonomous queue discipline. The cost of interrupting a sprint is lower than the cost of Kai seeing a broken dashboard.

**Prevention commitment:**
- On any FA/Marcus message marked CRITICAL or blocking the live site: stop current lane, diagnose immediately, then return to queue.
- Before any index.html commit: run `node --check` on the full inline script block. Add this to GA's personal pre-commit checklist (not just the publish runbook).
- When a seed script works but nothing renders: first question is parse failure, not data failure. Check the whole block, not individual functions.

---

## GR Perspective

**What GR was doing during the incident:** Working concurrently on RP8/RP9 exam data quality — fixing cross-exam answer collisions, repairing the RP8 JSON structural corruption, and running verify-practice-exams.js. GR had no visibility into the dashboard failure because GR's scope is data files (data/*.json), not the HTML renderer. The site appeared fine from GR's side because the verification scripts check JSON content, not browser rendering.

**GR-relevant connection:** The RP8 JSON corruption from a prior session was caused by the same class of error as the dashboard bug: a broad-pattern string replace that hit an unintended match. A PowerShell replace targeting `"answer": -2,` also matched Q14_h's answer field, corrupting the Q14_k object. One unintended character substitution, same silent failure mode.

**What GR takes from this:**

1. **Broad-pattern replaces are dangerous.** Whether it is `(x+y)` in a regex or `"answer": -2,` in a file — if the pattern is not unique in the file, it WILL hit an unintended target. Use view+edit tools with enough context to make the match unique, not shell replace commands.

2. **Silent failures require explicit verification.** The dashboard loaded with no errors. RP8 parsed as valid JSON even while Q14_k was corrupted (duplicate keys are silently accepted by JSON.parse). The only way to catch silent failures is to verify the actual output, not just the process. For exam JSON: run lint-exam-json.js after every change. For HTML scripts: run node --check on the extracted script block.

3. **Scope isolation protects but also blinds.** GR not being in the HTML renderer protected the exam data from dashboard churn. But it also meant GR had no early warning signal. Future protocol: after any FA/FR change to index.html, GR should run verify-practice-exams.js to confirm the data pipeline end-to-end still works from JSON to renderer.

*-- GR (Research Specialist, Grind), 2026-02-22*
