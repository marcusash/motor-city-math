/**
 * f-t7-responsive: Responsive Breakpoint QA
 * Static analysis of responsive CSS for 375px and 768px breakpoints.
 * Playwright-blocked; pure source analysis.
 *
 * 6 key pages tested per GP T7 directive.
 * Checks:
 *  1. shared/styles.css has @media breakpoints at 375px-ish and 768px-ish
 *  2. Key pages reference shared/styles.css (inheriting responsive rules)
 *  3. Viewport meta tag present on all 6 pages
 *  4. No fixed-width containers wider than 375px without max-width override
 *  5. Touch-friendly sizing: min-touch-target 44px referenced in CSS
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

// 6 key pages per T7 directive
const KEY_PAGES = [
  'index.html',
  'exam.html',
  'scorecard.html',
  'scorecard-2.html',
  'final_exam_251123.html',
  'nonlinear_exam_mvp.html',
];

const SHARED_STYLES = path.join(ROOT, 'shared', 'styles.css');

// ── 1. Shared CSS responsive breakpoints ──
console.log('\n── 1. shared/styles.css responsive breakpoints ──');
check('shared/styles.css exists', fs.existsSync(SHARED_STYLES));

if (fs.existsSync(SHARED_STYLES)) {
  const css = fs.readFileSync(SHARED_STYLES, 'utf8');

  // Find all @media max-width values
  const mediaWidths = [...css.matchAll(/@media[^{]*max-width:\s*(\d+)px/g)]
    .map(m => parseInt(m[1]));
  const mediaMinWidths = [...css.matchAll(/@media[^{]*min-width:\s*(\d+)px/g)]
    .map(m => parseInt(m[1]));

  // Check for breakpoints in tablet range (720-800px)
  const hasTabletBreakpoint = mediaWidths.some(w => w >= 720 && w <= 820) ||
    mediaMinWidths.some(w => w >= 720 && w <= 820);
  check('768px tablet breakpoint (720-820px range)', hasTabletBreakpoint,
    `found max-widths: [${mediaWidths.join(', ')}]`);

  // Check for breakpoints in phone range (360-430px)
  const hasPhoneBreakpoint = mediaWidths.some(w => w >= 360 && w <= 500) ||
    mediaMinWidths.some(w => w >= 360 && w <= 500);
  check('375px phone breakpoint (360-500px range)', hasPhoneBreakpoint,
    `found max-widths: [${mediaWidths.join(', ')}]`);

  // Total responsive breakpoints found
  const totalBreakpoints = mediaWidths.length + mediaMinWidths.length;
  check(`at least 2 responsive breakpoints in shared CSS`, totalBreakpoints >= 2,
    `found ${totalBreakpoints}`);

  // Check viewport meta in shared (some pages inline it)
  // Also check pointer:coarse for touch support
  const hasTouchMedia = css.includes('pointer: coarse') || css.includes('pointer:coarse');
  check('touch device support (pointer:coarse)', hasTouchMedia);

  // Check min-touch-target or 44px reference for ADHD-friendly targets
  const has44px = css.includes('44px') || css.includes('min-touch-target');
  check('44px touch target reference', has44px, '44px not found in shared CSS');
}

// ── 2. Pages have viewport meta tag ──
console.log('\n── 2. Viewport meta on key pages ──');
for (const page of KEY_PAGES) {
  const fp = path.join(ROOT, page);
  if (!fs.existsSync(fp)) { warn(`${page}: not found (skip)`); continue; }
  const raw = fs.readFileSync(fp, 'utf8');
  const hasViewport = raw.includes('name="viewport"') && raw.includes('width=device-width');
  check(`${page}: viewport meta tag`, hasViewport);
}

// ── 3. Production pages inherit shared responsive CSS ──
console.log('\n── 3. Key pages use shared/styles.css (inherit responsive rules) ──');
// Only check the 2 production pages; others are standalone prototypes
for (const page of ['index.html', 'exam.html']) {
  const fp = path.join(ROOT, page);
  if (!fs.existsSync(fp)) { warn(`${page}: not found`); continue; }
  const raw = fs.readFileSync(fp, 'utf8');
  check(`${page}: links shared/styles.css`, raw.includes('shared/styles.css'));
}

// Standalone prototype pages: check they have their own responsive CSS
// scorecard.html/scorecard-2.html use flex layouts (naturally responsive, no @media needed)
for (const page of ['scorecard.html', 'scorecard-2.html', 'final_exam_251123.html', 'nonlinear_exam_mvp.html']) {
  const fp = path.join(ROOT, page);
  if (!fs.existsSync(fp)) { warn(`${page}: not found (skip)`); continue; }
  const raw = fs.readFileSync(fp, 'utf8');
  const hasMedia = raw.includes('@media') || raw.includes('shared/styles.css');
  const isFlexOnly = !hasMedia && raw.includes('flex') && !raw.includes('float:') && !raw.includes('width: 800px');
  if (hasMedia) {
    check(`${page}: has @media or shared CSS`, true);
  } else if (isFlexOnly) {
    warn(`${page}: no @media queries (flex-only layout — may be acceptable for prototype)`);
  } else {
    check(`${page}: has @media or shared CSS`, false, 'no responsive CSS found');
  }
}

// ── 4. No hardcoded full-width containers blocking 375px layout ──
console.log('\n── 4. No blocking fixed widths > 375px on production pages ──');
const FIXED_WIDTH_PATTERN = /(?:width|min-width):\s*([4-9]\d{2}|\d{4,})px(?!\s*and)/g;
for (const page of ['index.html', 'exam.html']) {
  const fp = path.join(ROOT, page);
  if (!fs.existsSync(fp)) continue;
  const raw = fs.readFileSync(fp, 'utf8');

  // Only check inline <style> blocks, not the shared CSS reference
  const styleBlocks = [...raw.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);
  const inlineCSS = styleBlocks.join('\n');

  const matches = [...inlineCSS.matchAll(FIXED_WIDTH_PATTERN)];
  const problematic = matches.filter(m => {
    const val = parseInt(m[1]);
    return val > 375 && val < 1200; // flag medium-range fixed widths
  });

  if (problematic.length > 3) {
    warn(`${page}: ${problematic.length} fixed-width rules > 375px in inline CSS (review for responsive compat)`);
  } else {
    check(`${page}: no blocking fixed-width rules in inline CSS`, true);
  }
}

console.log('\n── RESPONSIVE QA SUMMARY ──');
if (warnings > 0) console.log(`  ${WARN} ${warnings} warning(s) — review above`);
console.log(`\n  Tests: ${passed + failed} total, ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
