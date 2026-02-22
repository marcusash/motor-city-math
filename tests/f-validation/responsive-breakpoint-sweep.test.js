/**
 * responsive-breakpoint-sweep.test.js
 * Focused responsive sweep for active shared-style runtime pages.
 *
 * Run: node tests/f-validation/responsive-breakpoint-sweep.test.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const sharedCss = fs.readFileSync(path.join(ROOT, 'shared', 'styles.css'), 'utf-8');
const htmlFiles = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html')).sort();
const activePages = htmlFiles.filter((f) => {
  const src = fs.readFileSync(path.join(ROOT, f), 'utf-8');
  return src.includes('shared/styles.css');
});

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

console.log('\n🏀 responsive-breakpoint-sweep.test.js\n');
test('active pages detected', activePages.length > 0, `count=${activePages.length}`);

const sharedBreakpoints = [...sharedCss.matchAll(/(?:max|min)-width:\s*(\d+)px/g)].map((m) => Number(m[1]));
const hasPhoneBP = sharedBreakpoints.some((n) => n >= 700 && n <= 768);
const hasSmallBP = sharedBreakpoints.some((n) => n <= 500);
test('shared styles include phone breakpoint (~768)', hasPhoneBP);
test('shared styles include small breakpoint (<=500)', hasSmallBP);

for (const file of activePages) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf-8');
  const hasViewport = /meta\s+name=["']viewport["']/.test(src) && /width=device-width/.test(src);
  const pageHasMedia = /@media[^{]*(max|min)-width\s*:\s*\d+px/.test(src);
  test(`${file}: viewport meta contract`, hasViewport);
  test(`${file}: responsive behavior from page or shared CSS`, pageHasMedia || sharedBreakpoints.length > 0);
}

console.log('\n── Summary ──');
console.log(`  Total: ${total}`);
console.log(`  ✅ Passed: ${pass}`);
console.log(`  ❌ Failed: ${fail}`);
if (fail > 0) process.exit(1);
