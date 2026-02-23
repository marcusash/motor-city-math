// gp-number-inputs-answer-is-number.test.js — number input answers must be numeric (not strings)

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
    if (!Array.isArray(q.inputs)) continue;
    for (const inp of q.inputs) {
      if (inp.type !== 'number') continue;
      if (inp.answer === undefined || inp.answer === null) continue;
      if (typeof inp.answer !== 'number') {
        fail++;
        failures.push(`${file}: ${q.id} number input "${inp.id}" answer="${inp.answer}" (type: ${typeof inp.answer})`);
      } else { pass++; }
    }
  }
}

console.log(`gp-number-inputs-answer-is-number: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} number input answers are numeric type`);
