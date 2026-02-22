/**
 * color-token-enforcement.test.js
 * Static guardrails for shared color token usage on core runtime pages.
 *
 * Run: node tests/f-validation/color-token-enforcement.test.js
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

console.log('\n🏀 color-token-enforcement.test.js\n');

const requiredTokens = [
  '--accent-red', '--accent-blue', '--accent-navy',
  '--text-primary', '--text-secondary', '--bg-page', '--bg-card',
  '--border-default', '--border-subtle'
];
requiredTokens.forEach((token) => {
  test(`shared token defined: ${token}`, sharedCss.includes(`${token}:`));
});

const corePages = [{ name: 'index.html', content: indexHtml }, { name: 'exam.html', content: examHtml }];
corePages.forEach((p) => {
  test(`${p.name} references color tokens`, /var\(--(accent|text|bg|border)-/.test(p.content));
});

const bannedHexInline = ['#e0e0e0', '#f5f5f5', '#333333', '#666666', '#8b1e3f'];
for (const hex of bannedHexInline) {
  const hit = indexHtml.toLowerCase().includes(hex) || examHtml.toLowerCase().includes(hex);
  test(`core pages avoid banned hardcoded ${hex}`, !hit);
}

console.log('\n── Summary ──');
console.log(`  Total: ${total}`);
console.log(`  ✅ Passed: ${pass}`);
console.log(`  ❌ Failed: ${fail}`);
if (fail > 0) process.exit(1);
