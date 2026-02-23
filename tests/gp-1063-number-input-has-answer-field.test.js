// gp-1063-number-input-has-answer-field.test.js — all number inputs must have answer field

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
      if (inp.type !== 'number') continue;
      if ('answer' in inp && inp.answer !== null && inp.answer !== undefined) { pass++; }
      else { fail++; failures.push(`${file}: ${q.id}/${inp.id} number input missing answer field`); }
    }
  }
}

console.log(`gp-1063-number-input-has-answer-field: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} number inputs have answer field`);
