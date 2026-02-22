/**
 * accessibility-landmarks.test.js
 * Static landmark/skip-link guardrails for active runtime pages.
 *
 * Run: node tests/f-validation/accessibility-landmarks.test.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
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

console.log('\n🏀 accessibility-landmarks.test.js\n');
test('active page set detected', activePages.length > 0, `count=${activePages.length}`);

for (const file of activePages) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf-8');
  const hasMain =
    /<main\b/i.test(src) ||
    /id=["']main["']/i.test(src) ||
    /role=["']main["']/i.test(src);
  const hasSkip =
    /class=["'][^"']*skip-link/i.test(src) ||
    /class=["'][^"']*sr-only/i.test(src) ||
    /href=["']#main["']/i.test(src) ||
    /href=["'][^"']*#.*skip/i.test(src);

  test(`${file}: main landmark contract`, hasMain);
  test(`${file}: skip-link contract`, hasSkip);
}

console.log('\n── Summary ──');
console.log(`  Total: ${total}`);
console.log(`  ✅ Passed: ${pass}`);
console.log(`  ❌ Failed: ${fail}`);
if (fail > 0) process.exit(1);
