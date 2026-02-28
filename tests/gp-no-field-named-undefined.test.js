// gp-no-field-named-undefined.test.js — no question should have a field literally named 'undefined'

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
    if ('undefined' in q) {
      fail++;
      failures.push(`${file}: Q${q.id} has a field literally named 'undefined'`);
    } else {
      pass++;
    }
    // Check inputs too
    for (const input of (q.inputs || [])) {
      if ('undefined' in input) {
        fail++;
        failures.push(`${file}: Q${q.id} input "${input.id}" has 'undefined' field`);
      }
    }
  }
}

console.log(`gp-no-field-named-undefined: ${pass} pass, ${fail} bad field`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — no questions or inputs have a field literally named 'undefined'`);
