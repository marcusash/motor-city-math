// gp-each-question-has-at-least-1-input.test.js — every question must have at least 1 input

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
    if ((q.inputs || []).length >= 1) { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} has no inputs`); }
  }
}

console.log(`gp-each-question-has-at-least-1-input: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} questions have at least 1 input`);
