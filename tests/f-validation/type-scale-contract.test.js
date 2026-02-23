/**
 * GF Type Scale Contract (unlocked after GD locked scale 2026-02-22)
 *
 * GD confirmed 6 tokens are locked in shared/styles.css:
 *   --text-sm: 0.875rem (14px)
 *   --text-base: 1rem (16px)
 *   --text-lg: 1.25rem (20px)
 *   --text-xl: 1.75rem (28px)
 *   --text-2xl: 2.5rem (40px)
 * Plus the FA fd-* system for index.html dashboard only.
 *
 * This test locks these tokens. Any addition outside this set
 * must be flagged to GD (owns .design-system.md).
 *
 * SIZE_TOLERANCE in design-qa.spec.js is now 0.5px (was 1.5px).
 */

'use strict';

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function pass(label) { passed++; console.log('  ✓ ' + label); }
function fail(label) { failed++; console.log('  ✗ FAIL: ' + label); }

const ROOT = path.join(__dirname, '../..');
const css = fs.readFileSync(path.join(ROOT, 'shared', 'styles.css'), 'utf8');
const examHtml = fs.readFileSync(path.join(ROOT, 'exam.html'), 'utf8');

console.log('Type Scale Contract Tests (GD locked 2026-02-22)');

// ============================================================
// Section 1: All 6 tokens defined in shared/styles.css
// ============================================================
console.log('\n1. Token definitions in shared/styles.css:');

const LOCKED_TOKENS = [
  { name: '--text-sm', value: '0.875rem' },
  { name: '--text-base', value: '1rem' },
  { name: '--text-lg', value: '1.25rem' },
  { name: '--text-xl', value: '1.75rem' },
  { name: '--text-2xl', value: '2.5rem' },
];

LOCKED_TOKENS.forEach(({ name, value }) => {
  const defined = css.includes(`${name}:`) || css.includes(`${name} :`);
  const hasValue = css.includes(value);
  (defined && hasValue)
    ? pass(`${name}: ${value} defined`)
    : fail(`${name}: ${value} NOT found in shared/styles.css`);
});

// ============================================================
// Section 2: exam.html uses tokens not raw px/rem for font-size
// ============================================================
console.log('\n2. exam.html token usage:');

// Check key size references use var(--text-*) not bare rem/px
const textTokenUsage = LOCKED_TOKENS.filter(({ name }) => examHtml.includes(`var(${name})`)).length;
textTokenUsage >= 3
  ? pass(`exam.html uses ${textTokenUsage}/5 text tokens via var()`)
  : fail(`exam.html uses only ${textTokenUsage}/5 text tokens — may have raw rem/px`);

// No bare font-size with unrecognized values (raw em values in exam.html body)
// Allowed: 0.72rem (input hint — small outlier GD approved), standard tokens
const bareRemMatches = (examHtml.match(/font-size:\s*[\d.]+rem(?!.*var\()/g) || [])
  .filter(m => !m.includes('0.72rem') && !m.includes('0.875rem') && !m.includes('1.25rem') && !m.includes('1rem'));

bareRemMatches.length === 0
  ? pass('exam.html: no unapproved bare rem font-size values')
  : fail(`exam.html: ${bareRemMatches.length} unapproved bare rem values: ${bareRemMatches.slice(0, 3).join(', ')}`);

// ============================================================
// Section 3: design-qa.spec.js SIZE_TOLERANCE is 0.5px
// ============================================================
console.log('\n3. design-qa.spec.js SIZE_TOLERANCE:');

const designQa = fs.readFileSync(path.join(ROOT, 'tests', 'f-validation', 'design-qa.spec.js'), 'utf8');
const toleranceMatch = designQa.match(/SIZE_TOLERANCE\s*=\s*([\d.]+)/);
if (toleranceMatch) {
  const val = parseFloat(toleranceMatch[1]);
  val <= 0.5
    ? pass(`SIZE_TOLERANCE = ${val}px (<= 0.5px — locked)`)
    : fail(`SIZE_TOLERANCE = ${val}px — GD requires <= 0.5px after type scale lock`);
} else {
  fail('SIZE_TOLERANCE not found in design-qa.spec.js');
}

// ============================================================
// Section 4: APPROVED_SIZES_PX matches GD spec
// ============================================================
console.log('\n4. APPROVED_SIZES_PX in design-qa.spec.js:');

const GD_APPROVED = [12, 14, 16, 20, 28, 40];
const approvedMatch = designQa.match(/APPROVED_SIZES_PX\s*=\s*\[([^\]]+)\]/);
if (approvedMatch) {
  const sizes = approvedMatch[1].split(',').map(s => parseInt(s.trim()));
  const matches = JSON.stringify(sizes.sort((a, b) => a - b)) === JSON.stringify(GD_APPROVED.sort((a, b) => a - b));
  matches
    ? pass(`APPROVED_SIZES_PX = [${sizes.join(', ')}] matches GD spec`)
    : fail(`APPROVED_SIZES_PX = [${sizes.join(', ')}] does NOT match GD spec [${GD_APPROVED.join(', ')}]`);
} else {
  fail('APPROVED_SIZES_PX not found in design-qa.spec.js');
}

// ============================================================
// Section 5: No raw px font sizes in shared/styles.css for text
// ============================================================
console.log('\n5. shared/styles.css raw px guard:');

// Font-size values in CSS should be rem (not px) for scalability
const rawPxFontSizes = (css.match(/font-size:\s*[\d.]+px/g) || []);
rawPxFontSizes.length === 0
  ? pass('shared/styles.css: no raw px font-size values (all rem/var tokens)')
  : fail(`shared/styles.css: ${rawPxFontSizes.length} raw px font-size values: ${rawPxFontSizes.slice(0, 3).join(', ')}`);

// ============================================================
// Summary
// ============================================================
const total = passed + failed;
console.log('\n' + '='.repeat(50));
console.log(`${total} checks: ${passed} passed, ${failed} failed`);
if (failed === 0) { console.log('✓ PASS'); } else { console.log('✘ FAIL'); process.exit(1); }
