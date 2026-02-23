# GP Publish Drill Checklist

**Owner:** GP (grind-platform)  
**Last verified:** 2026-02-23  
**Scenario:** Manual publish.cjs release when GitHub Actions is unavailable (outage, token expiry, workflow file corruption)

---

## Pre-Publish Gate

- [ ] `node tests/verify-practice-exams.js` passes (all exams N/N)
- [ ] `node tests/cross-exam-verify.js` passes (0 hard failures)
- [ ] `git status` shows clean working tree on `master`
- [ ] Confirm `MOTOR_CITY_MATH_TOKEN` is active (check via Marcus or GitHub Settings > Tokens)

## Publish Steps (workflow_dispatch)

1. Navigate to: `https://github.com/marcusash_microsoft/kai-algebra2-tests/actions`
2. Select workflow: "Publish to motor-city-math"
3. Click **Run workflow** on branch `master`
4. Monitor run — expect 60-90s
5. Confirm green checkmark before declaring publish done

## Manual Fallback (if Actions unavailable)

```powershell
# From repo root, assuming publish.cjs is current
node scripts/publish.cjs
```

- Publishes HTML files + `shared/`, `data/`, `docs/`, `scripts/` to public `motor-city-math` repo
- Requires `MOTOR_CITY_MATH_TOKEN` in environment or `.env` (NOT committed)

## Post-Publish Verification

- [ ] Open `https://marcusash.github.io/motor-city-math/` — page loads
- [ ] Open `https://marcusash.github.io/motor-city-math/exam.html` — RP5/RP8 selectable
- [ ] Open `https://marcusarch.github.io/motor-city-math/?dad=1` — Dad Mode loads score file
- [ ] Confirm latest retake exam JSON appears in `data/` on the public repo

## Rollback

If publish broke the live site, revert on the public repo: force-push prior `master` commit to `marcusash/motor-city-math`.
