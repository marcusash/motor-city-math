// gp-input-id-not-empty.test.js — every input must have a non-empty id

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
    for (const inp of (q.inputs || [])) {
      if (!inp.id || typeof inp.id !== 'string' || inp.id.trim() === '') {
        fail++;
        failures.push(`${file}: Q${q.id} has input with missing or empty id`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-input-id-not-empty: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} inputs have non-empty id`);
