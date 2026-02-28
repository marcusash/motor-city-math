# GP Pre-commit Guide

The pre-commit hook at `tests/f-validation/pre-commit-check.js` runs before every commit.

## What It Checks

| Check | Description | What It Catches |
|-------|-------------|-----------------|
| (a) | polyfill.io references | Banned CDN in HTML/JS |
| (b) | CDN URLs with local alternatives | Other banned CDNs |
| (b2) | HTML structure | Duplicate html/head/body tags |
| (c) | File size protection | Files > 500KB |
| (bonus) | Hardcoded hex colors | Colors not in Pistons palette |

## Current Exclusions

The hook excludes these file patterns from CDN checks:
- `f-validation` directory (the hook file itself)
- `gp-cdn-check` (GP's CDN audit test)

## Adding New Exclusions

If you create a test that legitimately references banned patterns (as strings to detect), add an exclusion in `tests/f-validation/pre-commit-check.js`:

```javascript
// Around line 90:
&& !fileName.includes('your-test-file-name')
```

## Running Manually

```powershell
# Check staged files only (what commit would check):
node tests/f-validation/pre-commit-check.js

# Check all files:
node tests/f-validation/pre-commit-check.js --all
```

## When It Fails

If the hook blocks your commit:
1. Read the SAFETY CHECK SUMMARY output
2. Find the flagged file(s)
3. Fix the violation (remove banned CDN, fix duplicate tags, etc.)
4. Stage the fix and retry

If it's a false positive (your test file legitimately references the pattern):
1. Add an exclusion for your file (see above)
2. Stage the pre-commit-check.js change
3. Commit both changes together

## Never Bypass the Hook

Do not use `git commit --no-verify`. The hook protects Kai's study tool from:
- External CDN failures during exam
- Structural HTML errors that break the renderer
- File corruption (oversized files)
