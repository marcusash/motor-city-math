# GP Publish Pipeline Spec

**Owner:** GP (grind-platform)  
**Last updated:** 2026-02-23

---

## Purpose

Define the exact conditions, steps, and quality gates required before any content is published from the private `kai-algebra2-tests` repo to the public `motor-city-math` GitHub Pages site.

---

## Trigger

Manual only. `workflow_dispatch` in `.github/workflows/publish-to-motor-city-math.yml`.

No automatic publish on push. Every publish is a deliberate human decision.

---

## Pre-Publish Checklist (Required)

Before triggering publish, ALL of the following must pass:

```bash
# 1. Full exam verify
node tests/verify-practice-exams.js
# Expected: N/N pass (current: 3008/3008)

# 2. Cross-exam dedup
node tests/cross-exam-verify.js
# Expected: 0 hard failures

# 3. GP health check (8 gates)
node scripts/gp-exam-health.js
# Expected: 8/8 pass, "SYSTEM HEALTHY — ready for Kai"

# 4. Schema guard
node tests/f-validation/localstorage-schema-guard.test.js
# Expected: 50/50 pass
```

If any check fails: stop. Fix and re-verify before publishing.

---

## What Gets Published

From `publish-to-motor-city-math.yml`:
- HTML files: `index.html`, `exam.html`, `final_exam_251123.html`, `final_exam_251123_mini.html`, `nonlinear_exam_mvp.html`
- Directories: `shared/`, `data/`, `docs/`, `scripts/`
- Config: `package.json`, `README.md`

**Not published:** `tests/`, `.agent-comms/`, `.github/`, dotfiles (`.agent-*.md`, etc.)

---

## Gate: Math Accuracy

Any exam that was modified since the last publish MUST have:
1. GR sign-off on answer key (noted in commit message or .agent-comms)
2. `node tests/verify-practice-exams.js` pass for that specific exam

---

## Gate: ADHD Compliance

All feedback strings must pass 12-word limit:
```bash
node tests/gp-feedback-length.test.js
# Expected: 300/300
```

---

## Rollback

If a publish introduces a regression:
1. Identify the bad commit SHA
2. Revert: `git revert <SHA>`
3. Force-push to motor-city-math repo's main branch
4. Notify Marcus immediately via `.marcus-queue.md`

---

## Secrets

- `MOTOR_CITY_MATH_TOKEN` — stored in GitHub repo secrets. Never log. Never commit.
- Token must have push access to `marcusash/motor-city-math`.
- If token is expired: create new PAT with `repo` scope. Update in GitHub repo settings.

---

## Frequency

Publish after each verified sprint completion. Not more than once per day unless critical hotfix.
