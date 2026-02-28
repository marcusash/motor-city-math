/**
 * gp-schema-version.test.js
 * Verifies all RP JSON files have a 'version' field formatted as '2.0' (string).
 * GP: sprint batch — test 20
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
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, fname), 'utf8'));

  // Check version field exists
  if (!('version' in data)) {
    failures.push(`${fname} — missing 'version' field`);
    failed++;
    continue;
  }

  // Check version is a string (not a number)
  if (typeof data.version !== 'string') {
    failures.push(`${fname} — version is ${typeof data.version} '${data.version}', must be string '2.0'`);
    failed++;
    continue;
  }

  // Check version format
  if (!data.version.match(/^\d+\.\d+$/)) {
    failures.push(`${fname} — version '${data.version}' should be '2.0' format`);
    failed++;
    continue;
  }

  passed++;
}

console.log(`\n=== GP Schema Version Check ===`);
if (failed === 0) {
  console.log(`✅ ${passed}/${RP_FILES.length} RP files have valid version field`);
  process.exit(0);
} else {
  console.log(`❌ ${failed} version error(s):`);
  failures.forEach(f => console.log(`  ${f}`));
  process.exit(1);
}
