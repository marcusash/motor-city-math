// gp-dropdown-inputs-have-answer.test.js — dropdown inputs must have an answer field

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
      if (inp.type !== 'dropdown') continue;
      if (inp.answer === undefined || inp.answer === null || String(inp.answer).trim() === '') {
        fail++;
        failures.push(`${file}: ${q.id} dropdown "${inp.id}" has no answer`);
      } else { pass++; }
    }
  }
}

console.log(`gp-dropdown-inputs-have-answer: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} dropdown inputs have an answer`);
