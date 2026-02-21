# Publishing Runbook: kai-algebra2-tests → motor-city-math

**Public URL:** https://marcusash.github.io/motor-city-math/
**Private source:** https://github.com/marcusash_microsoft/kai-algebra2-tests (master)
**Public target:** https://github.com/marcusash/motor-city-math (master)

---

## One-Time Setup (Marcus does this once)

### Step 1: Create a Personal Access Token on the marcusash account

1. Go to https://github.com/settings/tokens?type=beta while logged in as **marcusash** (not marcusash_microsoft)
2. Click "Generate new token (fine-grained)"
3. Name it: `motor-city-math-publish`
4. Expiration: No expiration (or 1 year, your call)
5. Repository access: Only select repositories > `marcusash/motor-city-math`
6. Permissions: Contents = **Read and Write**
7. Click "Generate token" — copy it immediately

### Step 2: Add the token as a secret in kai-algebra2-tests

1. Go to https://github.com/marcusash_microsoft/kai-algebra2-tests/settings/secrets/actions
2. Click "New repository secret"
3. Name: `MOTOR_CITY_MATH_TOKEN`
4. Value: paste the token from Step 1
5. Click "Add secret"

That's it. From this point on, publishing is fully automated.

---

## How It Works After Setup

Every push to `kai-algebra2-tests` master triggers the GitHub Action.
The action syncs these files/dirs to `motor-city-math`:
- `index.html`, `exam.html`, `final_exam_251123.html`, `final_exam_251123_mini.html`
- `shared/`, `data/`, `docs/`, `scripts/`, `_gen.js`, `package.json`, `README.md`

Agent comms, spec files, test files, and OCR artifacts are NOT published.

GitHub Pages rebuilds automatically after the push. Live in ~60 seconds.

---

## GA Can Trigger a Manual Publish

GA (and any agent) can trigger a publish from the GitHub Actions UI:

1. Go to https://github.com/marcusash_microsoft/kai-algebra2-tests/actions/workflows/publish-to-motor-city-math.yml
2. Click "Run workflow"
3. Enter a reason (optional)
4. Click "Run workflow"

Or via gh CLI (from the kai-algebra2-tests directory):
```
gh workflow run publish-to-motor-city-math.yml --field reason="GA: new features published"
```

---

## Manual Push (if Action is not set up yet)

If Marcus needs to publish right now before the PAT is created:

```powershell
# From a terminal logged in as marcusash (not marcusash_microsoft):
cd C:\GitHub\kai-algebra2-tests
git remote add public https://github.com/marcusash/motor-city-math.git
git push public master
```

Or using the gh CLI switch:
```powershell
gh auth login   # log in as marcusash in a second profile
gh auth switch  # switch to marcusash
cd C:\GitHub\kai-algebra2-tests
git push public master
```

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

## Current Status

- GitHub Action: configured in `.github/workflows/publish-to-motor-city-math.yml`
- Secret `MOTOR_CITY_MATH_TOKEN`: NOT YET ADDED (Marcus must do Step 1-2 above)
- Last published: 2026-02-19 (commit af5e5c6)
- kai-algebra2-tests is ahead by: ~8 commits as of 2026-02-21
