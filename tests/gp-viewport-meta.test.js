/**
 * gp-viewport-meta.test.js
 * Verifies all production HTML files have viewport meta tag for mobile.
 * GP: sprint batch — test 17
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const HTML_FILES = fs.readdirSync(ROOT)
  .filter(f => f.endsWith('.html'))
  .map(f => ({ name: f, path: path.join(ROOT, f) }));

const VIEWPORT_RE = /<meta[^>]+name=["']viewport["'][^>]*>/i;

let passed = 0;
let failed = 0;
const failures = [];

for (const { name, path: fpath } of HTML_FILES) {
  const content = fs.readFileSync(fpath, 'utf8');
  if (VIEWPORT_RE.test(content)) {
    passed++;
  } else {
    failed++;
    failures.push(`${name} — missing <meta name="viewport">`);
  }
}

console.log(`\n=== GP Viewport Meta Check ===`);
if (failed === 0) {
  console.log(`✅ ${passed}/${HTML_FILES.length} HTML files have viewport meta tag`);
  process.exit(0);
} else {
  console.log(`❌ ${failed}/${HTML_FILES.length} file(s) missing viewport meta tag:`);
  failures.forEach(f => console.log(`  ${f}`));
  process.exit(1);
}
