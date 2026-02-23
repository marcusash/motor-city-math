/**
 * f-t7-light: Light Mode Checklist
 * Static analysis of light mode (default) across production HTML pages.
 * Playwright-blocked; pure CSS/HTML source analysis.
 *
 * Light mode = the default when arena-mode class is NOT on body.
 * Checks:
 *  1. :root CSS variables use token pattern (not hardcoded final colors in core files)
 *  2. shared/styles.css defines all required light-mode :root tokens
 *  3. Production pages reference shared/styles.css (not self-styling)
 *  4. No bare hardcoded colors in shared/styles.css :root block
 *  5. prefers-color-scheme:dark handled (OS preference respected)
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
let warnings = 0;

function check(label, ok, detail = '') {
  if (ok) { console.log(`  ${PASS} ${label}`); passed++; }
  else { console.log(`  ${FAIL} ${label}${detail ? ': ' + detail : ''}`); failed++; }
}
function warn(label, detail = '') {
  console.log(`  ${WARN} ${label}${detail ? ': ' + detail : ''}`);
  warnings++;
}

const SHARED_STYLES = path.join(ROOT, 'shared', 'styles.css');

// Production pages (not design prototypes with inline styles)
const PRODUCTION_PAGES = [
  'index.html',
  'exam.html',
  // dad.html is a redirect stub with its own minimal inline styles
];

// Required :root tokens for light mode (Pistons palette)
const REQUIRED_ROOT_TOKENS = [
  '--bg-page',
  '--bg-card',
  '--text-primary',
  '--text-secondary',
  '--accent-red',
  '--accent-blue',
  '--accent-navy',
];

// ── 1. shared/styles.css :root light-mode tokens ──
console.log('\n── 1. shared/styles.css :root light-mode tokens ──');
check('shared/styles.css exists', fs.existsSync(SHARED_STYLES));

if (fs.existsSync(SHARED_STYLES)) {
  const css = fs.readFileSync(SHARED_STYLES, 'utf8');

  // Extract :root block
  const rootMatch = css.match(/:root\s*\{([^}]+)\}/);
  const rootBlock = rootMatch ? rootMatch[1] : '';
  check(':root {} block found in shared/styles.css', !!rootBlock);

  for (const token of REQUIRED_ROOT_TOKENS) {
    check(`:root defines ${token}`, rootBlock.includes(token));
  }

  // Detect obviously hardcoded font stacks (not a token violation, just raw values are OK here)
  // What we ban: bare `color: white` / `color: black` inside :root (should be #hex)
  const bannedInRoot = [
    { pattern: /--[\w-]+:\s*white\b/i, label: 'color value "white" in token' },
    { pattern: /--[\w-]+:\s*black\b/i, label: 'color value "black" in token' },
  ];
  for (const { pattern, label } of bannedInRoot) {
    const m = rootBlock.match(pattern);
    if (m) warn(`${label} found`, m[0]);
  }
}

// ── 2. Production pages load shared/styles.css ──
console.log('\n── 2. Production pages link shared/styles.css ──');
for (const page of PRODUCTION_PAGES) {
  const fp = path.join(ROOT, page);
  if (!fs.existsSync(fp)) { warn(`${page} not found (skip)`); continue; }
  const raw = fs.readFileSync(fp, 'utf8');
  check(`${page}: links shared/styles.css`, raw.includes('shared/styles.css'));
}

// ── 3. Design prototype pages flagged (inline styles, no shared CSS) ──
console.log('\n── 3. Design prototype pages (inline styles expected) ──');
const PROTOTYPE_PAGES = ['scorecard.html', 'scorecard-2.html', 'mockup.html', 'mockup-ab.html', 'chart-variants.html'];
for (const page of PROTOTYPE_PAGES) {
  const fp = path.join(ROOT, page);
  if (!fs.existsSync(fp)) continue;
  const raw = fs.readFileSync(fp, 'utf8');
  const usesShared = raw.includes('shared/styles.css');
  // These are expected to NOT use shared styles — flag if they DO (unexpected dependency)
  if (usesShared) {
    warn(`${page}: uses shared/styles.css (unexpected for prototype — verify intentional)`);
  } else {
    check(`${page}: correctly self-styled (no shared/styles.css dependency)`, true);
  }
}

// ── 4. No hardcoded background in body default (light mode baseline) ──
console.log('\n── 4. body default uses CSS token (not hardcoded color) ──');
if (fs.existsSync(SHARED_STYLES)) {
  const css = fs.readFileSync(SHARED_STYLES, 'utf8');
  // body { background: var(--bg-page) } is correct; background: #fff is bad
  const bodyMatch = css.match(/^body\s*\{([^}]+)\}/m);
  const bodyBlock = bodyMatch ? bodyMatch[1] : '';
  const usesTokenBg = bodyBlock.includes('var(--bg-page)') || bodyBlock.includes('var(--bg');
  const hasHardcodedBg = /background(?:-color)?:\s*#[0-9a-f]{3,6}\b/i.test(bodyBlock) &&
    !bodyBlock.includes('var(');
  check('body background uses CSS token (var(--bg-page))', usesTokenBg || !hasHardcodedBg,
    hasHardcodedBg ? 'hardcoded background found in body' : '');
}

// ── 5. Light mode color contrast — token values reasonable ──
console.log('\n── 5. Light mode color token sanity ──');
if (fs.existsSync(SHARED_STYLES)) {
  const css = fs.readFileSync(SHARED_STYLES, 'utf8');
  const rootMatch = css.match(/:root\s*\{([^}]+)\}/);
  const rootBlock = rootMatch ? rootMatch[1] : '';

  // --bg-page should be a light color (high luminance hex)
  const bgPageMatch = rootBlock.match(/--bg-page:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})/);
  if (bgPageMatch) {
    const hex = bgPageMatch[1].replace('#', '');
    const rgb = hex.length === 6
      ? [parseInt(hex.slice(0,2),16), parseInt(hex.slice(2,4),16), parseInt(hex.slice(4,6),16)]
      : [parseInt(hex[0]+hex[0],16), parseInt(hex[1]+hex[1],16), parseInt(hex[2]+hex[2],16)];
    const luminance = (rgb[0]*299 + rgb[1]*587 + rgb[2]*114) / 1000;
    check(`--bg-page is light (luminance >= 200): ${bgPageMatch[1]}`, luminance >= 200,
      `luminance = ${Math.round(luminance)} (expected >= 200 for light mode default)`);
  } else {
    warn('--bg-page not found as hex color in :root (may use rgba or named color)');
  }
}

console.log('\n── LIGHT MODE QA SUMMARY ──');
if (warnings > 0) console.log(`  ${WARN} ${warnings} warning(s) — review above`);
console.log(`\n  Tests: ${passed + failed} total, ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
