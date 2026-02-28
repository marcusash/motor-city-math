/**
 * gp-cdn-check.test.js
 * Verifies no external CDN references (polyfill.io, etc.) in HTML files.
 * GP: sprint batch — test 12
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const BANNED_CDNS = [
  'polyfill' + '.io',
  'cdn.polyfill' + '.io',
];

const HTML_FILES = fs.readdirSync(ROOT)
  .filter(f => f.endsWith('.html'))
  .map(f => path.join(ROOT, f));

let passed = 0;
let failed = 0;
const failures = [];

for (const file of HTML_FILES) {
  const name = path.basename(file);
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    for (const cdn of BANNED_CDNS) {
      if (line.includes(cdn)) {
        failures.push(`${name}:${idx + 1} — banned CDN: ${cdn}`);
        failed++;
      }
    }
  });
}

// Count passing files
const passingFiles = HTML_FILES.length - new Set(failures.map(f => f.split(':')[0])).size;
passed = HTML_FILES.length - new Set(failures.map(f => f.split(':')[0])).size;

console.log(`\n=== GP CDN Ban Check ===`);
if (failures.length === 0) {
  console.log(`✅ ${HTML_FILES.length}/${HTML_FILES.length} HTML files — no banned CDN references`);
  process.exit(0);
} else {
  console.log(`❌ ${failures.length} banned CDN reference(s) found:`);
  failures.forEach(f => console.log(`  ${f}`));
  process.exit(1);
}
