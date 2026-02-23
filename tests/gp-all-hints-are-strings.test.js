// gp-all-hints-are-strings.test.js — every question hint must be a string (not null/object)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (typeof q.hint !== 'string') {
      fail++;
      failures.push(`${file}: Q${q.id} hint is ${typeof q.hint} (expected string)`);
    } else { pass++; }
  }
}

console.log(`gp-all-hints-are-strings: ${pass} pass, ${fail} wrong type`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} question hints are strings`);
