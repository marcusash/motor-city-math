// gp-1091-input-id-has-q-prefix.test.js
// All input IDs must start with "q" (e.g., q1_, q2_a).

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
    for (const inp of (q.inputs || [])) {
      if (typeof inp.id === 'string' && inp.id.startsWith('q')) { pass++; }
      else { fail++; failures.push(`${file}: ${q.id} input id="${inp.id}" doesn't start with 'q'`); }
    }
  }
}

console.log(`gp-1091-input-id-has-q-prefix: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} input IDs start with 'q'`);
