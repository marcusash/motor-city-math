/**
 * f-t7-dark: Arena Mode Dark QA
 * Static analysis of dark (arena) mode CSS across all pages.
 * Playwright-blocked (win-arm64 canvas); this is a CSS contract test.
 *
 * Architecture: arena mode CSS lives in shared/styles.css (body.arena-mode).
 * Pages load shared/styles.css and shared/scripts.js for the toggle logic.
 *
 * Checks:
 *  1. shared/styles.css has body.arena-mode block with required dark tokens
 *  2. No hardcoded colors in body.arena-mode block
 *  3. Arena toggle JS exists in shared/scripts.js
 *  4. localStorage key (mcm-arena-mode) is consistent across pages
 *  5. prefers-color-scheme:dark auto-apply handled
 *  6. Arena pages reference shared/styles.css
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const PASS = '\x1b[32m✓\x1b[0m';
const FAIL = '\x1b[31m✗\x1b[0m';
const WARN = '\x1b[33m⚠\x1b[0m';

let passed = 0;
let failed = 0;

function check(label, ok, detail = '') {
  if (ok) {
    console.log(`  ${PASS} ${label}`);
    passed++;
  } else {
    console.log(`  ${FAIL} ${label}${detail ? ': ' + detail : ''}`);
    failed++;
  }
}

function warn(label, detail = '') {
  console.log(`  ${WARN} ${label}${detail ? ': ' + detail : ''}`);
}

// Pages expected to use arena mode via shared assets (production pages only)
// scorecard.html and scorecard-2.html are FD design prototypes with inline styles
const ARENA_PAGES = [
  'index.html',
  'exam.html',
];

// Dark-mode token prefixes that must appear inside body.arena-mode block
const REQUIRED_DARK_TOKENS = ['--bg-', '--text-', '--accent-'];

// Hardcoded color patterns banned in arena-mode context
const BANNED_HARDCODED = [
  /color:\s*white\b/i,
  /background(?:-color)?:\s*black\b/i,
  /color:\s*#000\b/,
  /background(?:-color)?:\s*#fff\b/,
];

const SHARED_STYLES = path.join(ROOT, 'shared', 'styles.css');
const SHARED_SCRIPTS = path.join(ROOT, 'shared', 'scripts.js');
const EXPECTED_KEY = 'mcm-arena-mode';

// ── 1. shared/styles.css arena-mode block ──
console.log('\n── 1. shared/styles.css body.arena-mode block ──');
check('shared/styles.css exists', fs.existsSync(SHARED_STYLES));

if (fs.existsSync(SHARED_STYLES)) {
  const css = fs.readFileSync(SHARED_STYLES, 'utf8');

  // Extract body.arena-mode block
  const blockMatch = css.match(/body\.arena-mode\s*\{([^}]+)\}/);
  const block = blockMatch ? blockMatch[1] : '';

  check('body.arena-mode {} block found', !!block, 'selector not in shared/styles.css');

  for (const token of REQUIRED_DARK_TOKENS) {
    check(`arena-mode defines ${token}* tokens`, block.includes(token));
  }

  // No hardcoded colors in arena-mode block
  let hardcoded = null;
  for (const banned of BANNED_HARDCODED) {
    const m = block.match(banned);
    if (m) { hardcoded = m[0]; break; }
  }
  check('no hardcoded colors in arena-mode block', !hardcoded, hardcoded || '');
}

// ── 2. shared/scripts.js arena toggle logic ──
console.log('\n── 2. Arena toggle logic in shared/scripts.js ──');
check('shared/scripts.js exists', fs.existsSync(SHARED_SCRIPTS));

if (fs.existsSync(SHARED_SCRIPTS)) {
  const js = fs.readFileSync(SHARED_SCRIPTS, 'utf8');
  check('arenaToggle / arena-toggle function exists', js.includes('arena-toggle') || js.includes('arenaToggle'));
  check(`uses "${EXPECTED_KEY}" localStorage key`, js.includes(`'${EXPECTED_KEY}'`) || js.includes(`"${EXPECTED_KEY}"`));
  check('adds/removes arena-mode class on body', js.includes('arena-mode'));
  check('prefers-color-scheme:dark auto-apply', js.includes('prefers-color-scheme'));
}

// ── 3. Pages reference shared assets ──
console.log('\n── 3. Arena pages reference shared/styles.css ──');
for (const page of ARENA_PAGES) {
  const filePath = path.join(ROOT, page);
  if (!fs.existsSync(filePath)) {
    warn(`${page}: file not found (skip)`);
    continue;
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  const hasSharedCSS = raw.includes('shared/styles.css');
  check(`${page}: links shared/styles.css`, hasSharedCSS);
}

// ── 4. localStorage key consistency across pages ──
console.log('\n── 4. localStorage key consistency across pages ──');
for (const page of ARENA_PAGES) {
  const filePath = path.join(ROOT, page);
  if (!fs.existsSync(filePath)) { continue; }
  const raw = fs.readFileSync(filePath, 'utf8');
  // Page must NOT use old standalone 'arena-mode' as a localStorage key
  const usesOldKey = (raw.match(/localStorage\.(getItem|setItem|removeItem)\(['"]arena-mode['"]\)/g) || []).length > 0;
  if (usesOldKey) {
    check(`${page}: no stale localStorage 'arena-mode' key`, false, 'still uses old key — should be mcm-arena-mode');
  } else {
    check(`${page}: no stale localStorage 'arena-mode' key`, true);
  }
}

console.log('\n── ARENA DARK MODE QA SUMMARY ──');
console.log(`\n  Tests: ${passed + failed} total, ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
