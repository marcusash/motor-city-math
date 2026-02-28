// gp-hint-is-string.test.js — hint field must be a string (or null/absent) — never a number or object

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
    const hint = q.hint;
    if (hint !== undefined && hint !== null && typeof hint !== 'string') {
      fail++;
      failures.push(`${file}: Q${q.id} hint is ${typeof hint} (expected string or null)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-hint-is-string: ${pass} pass, ${fail} wrong type`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} hint fields are string or null`);
