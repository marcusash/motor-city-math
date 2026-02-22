/**
 * font-token-enforcement.test.js
 * Ensures core pages use the shared font token contract.
 *
 * Run: node tests/f-validation/font-token-enforcement.test.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const sharedCss = fs.readFileSync(path.join(ROOT, 'shared', 'styles.css'), 'utf-8');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
const examHtml = fs.readFileSync(path.join(ROOT, 'exam.html'), 'utf-8');

let total = 0, pass = 0, fail = 0;
function test(name, ok, detail = '') {
  total++;
  if (ok) {
    pass++;
    console.log(`  ✅ ${name}`);
  } else {
    fail++;
    console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

console.log('\n🏀 font-token-enforcement.test.js\n');

test('shared/styles.css defines --font-body token', sharedCss.includes('--font-body:'));
test('shared/styles.css applies --font-body to body', sharedCss.includes('body {') && sharedCss.includes('font-family: var(--font-body);'));
test('shared/styles.css applies --font-body to core text elements', sharedCss.includes('h1, h2, h3, h4, h5, h6, p, label, button, a, li, td, th') && sharedCss.includes('font-family: var(--font-body);'));
test('index chart labels use --font-body token', !indexHtml.includes('font-family="system-ui,sans-serif"') && indexHtml.includes('font-family="var(--font-body)"'));
test('index chart legend uses --font-body token', !indexHtml.includes('font-family:system-ui,sans-serif') && indexHtml.includes('font-family:var(--font-body)'));
test('exam page loads shared styles', examHtml.includes('shared/styles.css'));

console.log('\n── Summary ──');
console.log(`  Total: ${total}`);
console.log(`  ✅ Passed: ${pass}`);
console.log(`  ❌ Failed: ${fail}`);
if (fail > 0) process.exit(1);
