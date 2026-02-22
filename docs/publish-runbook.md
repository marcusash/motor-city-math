# Publishing Runbook: kai-algebra2-tests → motor-city-math

**Public URL:** https://marcusash.github.io/motor-city-math/
**Private source:** https://github.com/marcusash_microsoft/kai-algebra2-tests (master)
**Public target:** https://github.com/marcusash/motor-city-math (master)

---

## Quick Publish (agents use this)

```powershell
cd C:\GitHub\kai-algebra2-tests
MOTOR_CITY_MATH_TOKEN=your_token node scripts/publish.cjs
```

Or store the token once in `.env.local` at the repo root (never committed):
```
MOTOR_CITY_MATH_TOKEN=your_token_here
```

Then just run:
```powershell
node scripts/publish.cjs
```

The script clones motor-city-math to a temp dir, copies all public files, and pushes. Done in ~30 seconds.

---

## One-Time Token Setup (Marcus does this once per year)

1. Go to https://github.com/settings/tokens?type=beta logged in as **marcusash** (not marcusash_microsoft)
2. Click "Generate new token (fine-grained)"
3. Name: `motor-city-math-publish`
4. Expiration: 1 year
5. Repository access: Only select repositories > `marcusash/motor-city-math`
6. Permissions: Contents = **Read and Write**, Workflows = **Read and Write**
7. Copy the token immediately
8. Create `.env.local` in kai-algebra2-tests with `MOTOR_CITY_MATH_TOKEN=<token>`
9. Share with GA via secure channel (not in any committed file)

---

## What Gets Published vs What Stays Private

| Published | Not Published |
|-----------|---------------|
| index.html, exam.html | .agent-comms/ |
| shared/ (CSS, JS) | All .md spec files |
| data/ (question data) | tests/ |
| docs/ | import/ocr-output/ |
| scripts/ | eng.traineddata |
| README.md | PDFs |

---

## GitHub Action (on hold)

The action at `.github/workflows/publish-to-motor-city-math.yml` is configured but currently
failing with 0 jobs. Root cause: private repo Actions require billing setup on the
`marcusash_microsoft` account (GitHub Actions minutes for private repos). Use
`scripts/publish.cjs` instead until this is resolved.

To resolve GitHub Actions: add a payment method to github.com/marcusash_microsoft account settings,
then the action will auto-trigger on every push.

### Quick Triage Decision Tree

1. **Workflow shows "0 jobs" immediately:** treat as account-level Actions gating (billing/settings), not YAML syntax.
2. **Workflow starts but publish step fails auth:** rotate `MOTOR_CITY_MATH_TOKEN`, confirm `Contents` + `Workflows` write on `marcusash/motor-city-math`.
3. **Workflow succeeds but site not updated:** verify Pages source is `master` `/` on target repo, then republish via `node scripts/publish.cjs`.
4. **Need urgent release for Kai:** bypass Action and run `node scripts/publish.cjs` directly.

---

## Publish Parity Check (Script vs Workflow)

Validated on 2026-02-22:
- **Same file list:** `index.html`, `exam.html`, `final_exam_251123.html`, `final_exam_251123_mini.html`, `nonlinear_exam_mvp.html`, `_gen.js`, `package.json`, `README.md`
- **Same directory list:** `shared/`, `data/`, `docs/`, `scripts/`
- **Same publish gate:** both paths exit cleanly when no staged diff exists in target repo
- **Same destination:** `marcusash/motor-city-math` `master` branch

Only operational difference:
- **Script path** uses local token (`MOTOR_CITY_MATH_TOKEN`) and works now
- **Workflow path** requires Actions runtime + valid secret in private source repo

Use this quick parity command after major publish-script edits:

```powershell
cd C:\GitHub\kai-algebra2-tests
node scripts\publish.cjs --help 2>$null
```

If workflow behavior diverges from script behavior, update this runbook first, then notify GP + FA.

---

## Current Status

- Script publish: `scripts/publish.cjs` — works, use this
- GitHub Action: configured but failing (billing issue on private repo)
- Last published: 2026-02-21 commit 4fee5e9
- Site: https://marcusash.github.io/motor-city-math/ (live)
