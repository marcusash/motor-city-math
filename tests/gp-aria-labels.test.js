/**
 * gp-aria-labels.test.js
 * Verifies all graph canvas elements in exam HTML have aria-label attributes.
 * WCAG 2.1 accessibility compliance check.
 * GP: sprint batch — test 14
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const HTML_FILES = fs.readdirSync(ROOT)
  .filter(f => f.endsWith('.html'))
  .map(f => path.join(ROOT, f));

let checks = 0;
let passed = 0;
let failed = 0;
const failures = [];

// Match canvas elements
const CANVAS_RE = /<canvas([^>]*)>/gi;
const ID_RE = /id=["']([^"']+)["']/i;
const ARIA_RE = /aria-label=["']([^"']+)["']/i;

for (const file of HTML_FILES) {
  const name = path.basename(file);
  const content = fs.readFileSync(file, 'utf8');

  let m;
  while ((m = CANVAS_RE.exec(content)) !== null) {
    const attrs = m[1];
    const idMatch = ID_RE.exec(attrs);
    const ariaMatch = ARIA_RE.exec(attrs);
    const id = idMatch ? idMatch[1] : '(no id)';
    checks++;

    if (ariaMatch && ariaMatch[1].trim().length > 0) {
      passed++;
    } else {
      failed++;
      failures.push(`${name} — <canvas id="${id}"> missing aria-label`);
    }
  }
}

console.log(`\n=== GP Aria Label Check ===`);
console.log(`Scanned ${HTML_FILES.length} HTML files, found ${checks} canvas elements`);

if (failed === 0) {
  console.log(`✅ ${passed}/${checks} canvas elements have aria-label`);
  process.exit(0);
} else {
  console.log(`❌ ${failed}/${checks} canvas elements missing aria-label:`);
  failures.forEach(f => console.log(`  ${f}`));
  process.exit(1);
}
