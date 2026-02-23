/**
 * gp-json-parse.test.js
 * Verifies all RP JSON files pass JSON.parse() without error.
 * GP: sprint batch — test 15
 */
const fs = require('fs');
const path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');

const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => f.startsWith('retake-practice-') && f.endsWith('.json'))
  .sort();

let passed = 0;
let failed = 0;
const failures = [];

for (const fname of RP_FILES) {
  const fpath = path.join(DATA_DIR, fname);
  try {
    const content = fs.readFileSync(fpath, 'utf8');
    JSON.parse(content);
    passed++;
  } catch (err) {
    failed++;
    failures.push(`${fname} — ${err.message}`);
  }
}

console.log(`\n=== GP JSON Parse Check ===`);
if (failed === 0) {
  console.log(`✅ ${passed}/${passed + failed} RP files parse cleanly`);
  process.exit(0);
} else {
  console.log(`❌ ${failed} JSON parse error(s):`);
  failures.forEach(f => console.log(`  ${f}`));
  process.exit(1);
}
