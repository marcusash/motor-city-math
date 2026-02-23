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

---

## GD Perspective

**What GD was doing during the incident:** Running an autonomous WCAG audit sprint across the full MCM surface — input borders, focus rings, placeholder text, arena mode palette. GD had no visibility into the dashboard failure because the work was in shared/styles.css and agent-comms, not index.html. The site appeared to render from GD's vantage: exam.html was working correctly (autosave, score animation, picker mode all functional). Dashboard was not in GD's test path.

**The connection to GD's work:** The root-cause character — the spurious quote in an `aria-label` string on line 656 — is directly inside a string GD authored. The `aria-label` pattern on `buildStandards()` was introduced as part of GD's std-bar accessibility spec (shipped by GA in commit `6b81a49`). The spec said: add `aria-label="Standard [ID]: [pct]% correct"`. GA implemented it. FA later modified the string concatenation. The spurious quote entered in one of those edits.

GD does not fault GA or FA for the edit. But GD's spec created the complexity. A simpler aria-label format (`aria-label="W1.a: 82%"`) with no template literals would have been less error-prone. The richer format (`"Standard W1.a: 82% correct"`) requires more string concatenation and more opportunities for mismatched quotes.

**What GD takes from this:**

1. **aria-label specs must include the exact string template, not just the semantic intent.** GD's original spec said "add an aria-label with standard ID and percentage." GA had to decide the format. A spec that includes `aria-label="Standard [std]: [pct]% correct"` is unambiguous and lets the implementer see the concat boundaries before writing a character of code. GD will use exact string templates in all future accessibility specs.

2. **Complex aria-label strings are fragile in innerHTML injection patterns.** GA builds scorecard and dashboard elements via string concatenation into `innerHTML`. That pattern is correct for this codebase (static HTML, no framework), but it means every aria-label that contains both single and double quotes is a syntax risk. GD recommendation: aria-labels that are purely data (`"W1.a: 82%"`) are safer than aria-labels that are sentences with punctuation. GD will preference the simpler form going forward.

3. **GD should run a syntax check signal after any GA commit that implements a GD spec.** GD cannot run `node --check` (that is FR/GA territory), but GD can check the browser console on the live file and report back. Post-implementation verification is part of GD's QA role. GD was not checking the dashboard during this session — only exam.html. That scope blindness left the dashboard failure invisible for too long.

**Prevention commitment:**
- Every future GD accessibility spec that contains an aria-label includes the exact string format, not just the intent.
- After any GA implementation of a GD spec that touches index.html: GD does a dashboard QA pass within the same session. No exception.
- If GD is in autonomous sprint mode when a P1 is reported (CRITICAL label, live site): stop current lane, run dashboard QA, report findings. Then return to sprint.

*-- GD (Design Engineer, Grind), 2026-02-22*
