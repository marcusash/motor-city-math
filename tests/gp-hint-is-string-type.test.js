// gp-hint-is-string-type.test.js — hint must be a string, not an array or object

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (q.hint === undefined) { pass++; continue; }
    if (typeof q.hint !== 'string') {
      fail++;
      failures.push(`${file}: Q${q.id} hint is ${typeof q.hint} (expected string)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-hint-is-string-type: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} hints are string type`);
