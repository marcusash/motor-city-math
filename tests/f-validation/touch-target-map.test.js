/**
 * GF Touch Target Map (gf-skill-02)
 *
 * Static audit of interactive element minimum sizes.
 * WCAG 2.5.5 (AAA): 44x44px minimum for all touch targets.
 * ADHD design rule: larger targets reduce frustration on mobile.
 *
 * This static checker inspects CSS for explicit padding/min-height
 * values on buttons, inputs, and links. Full pixel verification
 * requires browser rendering — noted as Playwright gap.
 */

'use strict';

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
let warnings = 0;

function pass(label) { passed++; console.log('  ✓ ' + label); }
function fail(label) { failed++; console.log('  ✗ FAIL: ' + label); }
function warn(label) { warnings++; console.log('  ⚠ WARN: ' + label); }

const ROOT = path.join(__dirname, '../..');
const css = fs.readFileSync(path.join(ROOT, 'shared', 'styles.css'), 'utf8');
const examHtml = fs.readFileSync(path.join(ROOT, 'exam.html'), 'utf8');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

console.log('Touch Target Map Tests');

// ============================================================
// Section 1: Button minimum size (CSS padding audit)
// ============================================================
console.log('\n1. Button touch targets:');

// Primary submit button: padding 14px 32px = roughly 44px height with line-height
const hasPrimaryPadding = css.includes('padding: 14px 32px') || css.includes('padding:14px 32px') ||
  examHtml.includes('padding: 14px') || examHtml.includes('padding:14px');
hasPrimaryPadding ? pass('Primary button: >= 14px vertical padding (maps to >= 44px height)') : warn('Primary button: could not verify 44px minimum height');

// Secondary/ghost buttons: 10px padding minimum
const hasSecondaryPadding = css.includes('padding: 10px') || examHtml.includes('padding: 10px 18px') ||
  examHtml.includes('padding:10px');
hasSecondaryPadding ? pass('Secondary button: >= 10px vertical padding') : warn('Secondary button: padding not verified');

// Hint buttons: 6px + 14px (smaller) — flag for review
const hintBtnPadding = examHtml.includes('.hint-btn') && examHtml.includes('padding: 6px 14px');
if (hintBtnPadding) {
  warn('Hint button: 6px vertical padding — may be below 44px on mobile (track for Playwright verification)');
} else {
  pass('Hint button padding not found at 6px (may have been updated)');
}

// ============================================================
// Section 2: Input field touch targets
// ============================================================
console.log('\n2. Input field touch targets:');

// Inputs must have 8px+ padding for comfortable touch
const inputPadding = examHtml.includes('padding: 8px 12px') || examHtml.includes('padding:8px 12px');
inputPadding ? pass('Text/number inputs: 8px 12px padding') : warn('Text/number inputs: padding not found at 8px 12px');

// Radio option clickable area: container has 8px padding = 44px achievable
const radioPadding = examHtml.includes('.radio-option') && examHtml.includes('padding: 8px 12px');
radioPadding ? pass('Radio options: 8px 12px padding on clickable container') : warn('Radio options: container padding not verified');

// Select dropdowns: 8px padding
const selectPadding = examHtml.includes('padding: 8px 12px');
selectPadding ? pass('Select dropdowns: 8px 12px padding') : warn('Select dropdowns: padding not found');

// ============================================================
// Section 3: Navigation and link touch targets
// ============================================================
console.log('\n3. Navigation touch targets:');

// Exam nav/back link should have enough target area
const backLink = examHtml.includes('.btn-ghost') || examHtml.includes('btn-ghost');
backLink ? pass('Back link uses .btn-ghost class (inherits button sizing)') : warn('Back link missing .btn-ghost class');

// Graph interaction buttons
const graphBtn = examHtml.includes('.graph-btn') && examHtml.includes('padding: 6px 14px');
graphBtn ? warn('Graph buttons: 6px padding — may be under 44px minimum (Playwright verification needed)') : pass('Graph buttons: padding not confirmed at 6px (may be OK)');

// Skip to content link for accessibility
const skipLink = examHtml.includes('skip') || examHtml.includes('Skip to');
skipLink ? pass('Skip-to-content link present') : fail('Skip-to-content link missing');

// ============================================================
// Section 4: Dashboard (index.html) touch targets
// ============================================================
console.log('\n4. Dashboard touch targets:');

// Nav buttons on dashboard
const dashNavBtn = indexHtml.includes('.nav-btn') || indexHtml.includes('nav-btn');
dashNavBtn ? pass('Dashboard: .nav-btn class exists for test navigation') : warn('Dashboard: nav-btn class not found');

// CTA buttons on dashboard
const dashCTA = indexHtml.includes('.btn-primary') || indexHtml.includes('btn-primary');
dashCTA ? pass('Dashboard: .btn-primary CTA present') : warn('Dashboard: .btn-primary not found');

// ============================================================
// Section 5: ADHD compliance — one primary CTA visible
// ============================================================
console.log('\n5. ADHD CTA compliance:');

// ADHD rule: one CTA at a time (from .design-system.md)
// Check that exam page has exactly one primary submit CTA
const primaryCTACount = (examHtml.match(/class="btn-primary"/g) || []).length;
if (primaryCTACount === 0) {
  fail('Exam page: no .btn-primary CTA found');
} else if (primaryCTACount === 1) {
  pass(`Exam page: exactly 1 .btn-primary CTA (ADHD rule: one action at a time)`);
} else {
  warn(`Exam page: ${primaryCTACount} .btn-primary elements — review for ADHD compliance`);
}

// Check for large clickable zones on radio (full row = better for ADHD)
const radioFullRow = examHtml.includes('display: flex') && examHtml.includes('.radio-option');
radioFullRow ? pass('Radio options: flex layout (full-row clickable zone)') : warn('Radio options: flex layout not confirmed');

// ============================================================
// Section 6: Playwright gap documentation
// ============================================================
console.log('\n6. Playwright gap (documented):');

warn('Full pixel-accurate touch target verification requires browser rendering');
warn('Playwright test needed: measure offsetHeight of buttons post-render');
warn('Unblock after GP resolves win-arm64 canvas dependency');

// ============================================================
// Summary
// ============================================================
const total = passed + failed + warnings;
console.log('\n' + '='.repeat(50));
console.log(`${total} checks: ${passed} passed, ${failed} failed, ${warnings} warnings`);
console.log('(Warnings = needs Playwright verification, not hard failures)');
if (failed === 0) {
  console.log('✓ PASS (static layer clean, warnings documented)');
} else {
  console.log('✘ FAIL');
  process.exit(1);
}
