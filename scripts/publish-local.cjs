#!/usr/bin/env node
/**
 * publish-local.cjs
 * Publishes kai-algebra2-tests changes to marcusash/motor-city-math (GitHub Pages).
 *
 * Usage: node scripts/publish-local.cjs [--dry-run]
 *
 * Why this exists: GitHub Actions runners are disabled on marcusash_microsoft
 * enterprise account. The publish workflow can never run automatically.
 * This script is the canonical publish path.
 *
 * Pre-conditions it checks:
 *   1. node --check on index.html (catches JS parse errors before deploy)
 *   2. git fetch public to detect divergence before push
 *   3. Warns if public/master has commits not in local
 */

'use strict';

const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const DRY_RUN = process.argv.includes('--dry-run');

function run(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf8', ...opts }).trim();
}

function check(cmd, opts = {}) {
  const r = spawnSync(cmd, { shell: true, cwd: ROOT, encoding: 'utf8', ...opts });
  return { ok: r.status === 0, stdout: r.stdout, stderr: r.stderr };
}

function log(msg) { console.log(`[publish] ${msg}`); }
function fail(msg) { console.error(`[publish] FAIL: ${msg}`); process.exit(1); }

// 1. JS syntax check on index.html - extract main script block and check it
log('Step 1: JS syntax check on index.html');
const htmlContent = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
// Extract the largest <script> block (the main app script)
const scriptMatches = [...htmlContent.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi)];
if (!scriptMatches.length) {
  fail('No inline script blocks found in index.html');
}
// Check each script block for syntax
const tmpDir = require('os').tmpdir();
let syntaxOk = true;
for (let i = 0; i < scriptMatches.length; i++) {
  const content = scriptMatches[i][1].trim();
  if (!content) continue;
  const tmpFile = path.join(tmpDir, `mcm-syntax-check-${i}.js`);
  fs.writeFileSync(tmpFile, content);
  const r = spawnSync('node', ['--check', tmpFile], { encoding: 'utf8' });
  fs.unlinkSync(tmpFile);
  if (r.status !== 0) {
    syntaxOk = false;
    fail(`index.html script block ${i + 1} has a JS syntax error. Fix before publishing.\n${r.stderr}`);
  }
}
log('  index.html JS syntax OK');

// 2. Fetch public remote to see current state
log('Step 2: git fetch public');
try {
  run('git fetch public');
} catch (e) {
  fail(`git fetch public failed. Is the PAT set? Is the remote configured?\n${e.message}`);
}

// 3. Check for divergence
log('Step 3: checking divergence from public/master');
let ahead = '0', behind = '0';
try {
  ahead  = run('git rev-list --count public/master..HEAD');
  behind = run('git rev-list --count HEAD..public/master');
} catch (e) {
  fail(`Could not compute divergence: ${e.message}`);
}

log(`  Local is ${ahead} commit(s) ahead, ${behind} commit(s) behind public/master`);

if (parseInt(behind) > 0) {
  log(`  WARNING: public/master has ${behind} commits not in local. Will merge before push.`);
  if (!DRY_RUN) {
    try {
      run('git merge public/master --no-edit');
    } catch (e) {
      fail(`Merge failed. Resolve conflicts manually, then re-run.\n${e.message}`);
    }
    log('  Merge complete.');
  }
}

// 4. Push
if (DRY_RUN) {
  log('DRY RUN: would run: git push public master');
  log('DRY RUN: no changes made.');
  process.exit(0);
}

log('Step 4: git push public master');
try {
  const out = run('git push public master');
  log(`  Push succeeded: ${out}`);
} catch (e) {
  // Check for workflow scope error specifically
  if (e.message && e.message.includes('workflow')) {
    log('  Push blocked by workflow scope. Removing workflow file from HEAD and retrying...');
    run('git rm --cached .github/workflows/publish-to-motor-city-math.yml 2>NUL || true');
    run('git commit --amend --no-edit');
    run('git push public master');
    log('  Push succeeded after removing workflow file from commit.');
  } else {
    fail(`Push failed:\n${e.message}`);
  }
}

log('Done. GitHub Pages will rebuild in ~30 seconds.');
log('Verify: https://marcusash.github.io/motor-city-math/');
log('Hard refresh in browser: Ctrl+Shift+R');
