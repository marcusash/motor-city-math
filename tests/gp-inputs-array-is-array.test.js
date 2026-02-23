// gp-inputs-array-is-array.test.js — inputs field must be an array (never null or string)

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
    if (!Array.isArray(q.inputs)) {
      fail++;
      failures.push(`${file}: Q${q.id} inputs is ${typeof q.inputs} (expected array)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-inputs-array-is-array: ${pass} pass, ${fail} non-array`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} question inputs fields are arrays`);
