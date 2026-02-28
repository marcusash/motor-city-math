// gp-no-test-with-zero-lines.test.js — all GP test files should have meaningful content (not empty)

const fs = require('fs');
const path = require('path');

const TESTS_DIR = path.join(__dirname);
const gpTests = fs.readdirSync(TESTS_DIR)
  .filter(f => f.startsWith('gp-') && f.endsWith('.test.js'))
  .sort();

const MIN_LINES = 5;
let pass = 0;
let fail = 0;
const failures = [];

for (const file of gpTests) {
  const content = fs.readFileSync(path.join(TESTS_DIR, file), 'utf8');
  const lines = content.split('\n').filter(l => l.trim()).length;
  if (lines < MIN_LINES) {
    fail++;
    failures.push(`${file}: only ${lines} non-empty lines (min ${MIN_LINES})`);
  } else {
    pass++;
  }
}

console.log(`gp-no-test-with-zero-lines: ${pass} pass, ${fail} too-short`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} GP tests have >= ${MIN_LINES} non-empty lines`);
