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

---

## GI Section: Data Integrity During the Outage

**Agent:** GI (Data Engineer)
**Scope:** Practice exam JSON files, validation tooling, cross-exam uniqueness rules

### What GI observed during the incident

During the dashboard failure window, GI was running autonomous validation passes and found
separate (unrelated) data failures in `retake-practice-8.json` and across RP5/RP6/RP8/RP9:

- **RP8 invalid JSON:** PowerShell replace operation corrupted Q5 `inputs` array and Q14 `k` object.
  `verify-practice-exams.js` failed to parse the file entirely.
- **39 verify-practice failures:** RP6/RP8/RP9 unique-answer checks flagged repeated numeric answers
  within a single exam (most from FR simulation using x=2 across multiple question types).
- **32 cross-exam hard failures:** Same slot, same numeric answer appearing across exams, violating
  H-2/H-3/H-4 rules. Root cause: RP8/RP9 exponential questions shared answer values with RP4/RP5.

These were independent of the dashboard syntax bug but both were active at the same time.

### What GI did

1. Ran full validation stack and captured all failure details with slot-level answer maps.
2. Sent 7 structured blocker messages to GR inbox (`inbox-GR/20260222-*`) with exact duplicates,
   file locations, and answer tables to minimize GR's triage time.
3. Continued shipping tooling (FI coaching tasks 4-12) while waiting for GR fixes.

### Resolution

GR fixed all issues (commits `ce95f8e`, `6e204ad`, `c433f5b`). Final state:
- `verify-practice-exams.js`: 2687/2687 PASS
- `cross-exam-verify.js`: 0 hard failures
- `tests/property/exam-shape.property.test.js`: 50/50 PASS
- `scripts/ci-data-gate.cjs`: PASS (0 errors, 24 warnings expected)
- `artifacts/duplicate-signatures.json`: 8 entries reduced to 2 after GR fixes (W3.d::3.5 and W3.d::6)

### GI learnings from this incident

**1. Concurrent failures mask each other.** The dashboard was broken AND the data had 39+32 failures
simultaneously. GI kept running validation independently rather than waiting for dashboard fix.
This was correct: data integrity does not pause for infra failures.

**2. Structured blocker messages reduce GR turnaround.** Sending slot-level answer maps with exact
file+question IDs let GR fix 32 hard failures in one pass (commits `6e204ad`, `c433f5b`) without
back-and-forth. The format that worked: `exam::slot answers=[v1,v2] vs exam::slot answers=[v1,v2]`.

**3. Property tests need clean data to mean anything.** The 50-run property test was blocked by the
RP8 JSON corruption. Added this to the CI gate ordering: data validator runs before property test.
Order: validate-exam-contract, verify-practice-exams, cross-exam-verify, then property tests.

*-- GI (Data Engineer), 2026-02-22*

---

## GF Section: QA Perspective

**Filed by:** GF (Quality Lead, Grind), 2026-02-23

### What QA gates would have caught this

A static JS syntax check on the full inline script block would have caught the parse failure
in under 5 seconds. No browser required. The specific check:

```powershell
# Extract main <script> block from index.html and syntax-check it
node --check index.html
# For inline scripts without import/export, node --check catches block-level parse failures.
```

The error would have been: `SyntaxError: Unexpected string` at the line of the spurious `'`.

This check was not in the pre-deploy gate. It is now.

### What guardrails we have added

As a direct result of this incident, GF has added or expanded the following static test suite
entries in `tests/f-validation/`:

| Guard | File | Checks added |
|-------|------|--------------|
| Font token enforcement | `font-token-enforcement.test.js` | `system-ui` hardcoded in JS strings flagged |
| Color token enforcement | `color-token-enforcement.test.js` | Hardcoded hex in JS string literals flagged |
| Keyboard nav contract | `keyboard-nav-pass.test.js` | aria-label presence in JS string output |
| Scorecard contract | `scorecard-contract.test.js` | JS-rendered DOM output validated by pattern |

None of these would have caught a parse failure directly, because they parse the source HTML
as text. But the **pre-deploy checklist** now includes `node --check` as a mandatory gate, and
a future `gf-delivery-05-syntax-check-gate` task will automate that check as a Node.js test.

### Root cause category: assumption error, not tooling gap

FA had the right tool (`node --check`) and the wrong input (isolated function body vs. the
full script block). This is an assumption error: assuming that a function-level check is
equivalent to a block-level check. It is not.

**QA lesson:** Static syntax checks must run on the artifact as the browser sees it -- the full
inline `<script>` block extracted from the live HTML, not an isolated snippet. Any QA gate that
tests a re-assembled or partial version of source is weaker than it appears.

### What we are adding to process

1. **Pre-deploy syntax gate:** `node --check` on the extracted script block before every push
   to `motor-city-math`. Owner: whoever runs the publish step (currently FA or GP).
2. **Automated syntax check test:** `tests/f-validation/inline-script-syntax-check.test.js`
   (planned, `gf-delivery-05`). Extracts the main `<script>` block from `index.html`,
   writes it to a temp file, runs `node --check`, asserts exit code 0.
3. **Design-compliance canary:** The `design-compliance.spec.js` Playwright suite will catch
   any page that loads with a blank body or empty chart container. The current blocker is the
   win-arm64 canvas build; once resolved, this becomes our first runtime smoke test.

### Why this was not caught earlier

GF's static test suite runs against source HTML text, not parsed JS execution. A parse failure
produces a valid HTML file (the `<script>` tag is syntactically fine from the HTML parser's
perspective). The JS parser silently swallows the error at runtime. None of our text-pattern
tests scan JS string literals for unbalanced quotes in the context of their enclosing
string concatenation chain.

The correct fix is at the execution layer: `node --check` on the extracted block. Text scanning
cannot reliably detect context-sensitive string termination errors in multi-line concatenations.

**New rule for GF test design:** Parse-failure detection belongs in execution-layer gates, not
text-pattern guards. Text guards catch naming/token/contract violations. Syntax checks catch
structural failures. Both layers must be present in the pre-deploy checklist.
