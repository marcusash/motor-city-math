// gp-inputs-per-exam-minimum.test.js — each exam must have at least 20 inputs

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_INPUTS = 20;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  let count = 0;
  for (const q of data.questions) {
    if (Array.isArray(q.inputs)) count += q.inputs.length;
  }
  if (count < MIN_INPUTS) {
    fail++;
    failures.push(`${file}: only ${count} inputs (min ${MIN_INPUTS})`);
  } else { pass++; }
}

console.log(`gp-inputs-per-exam-minimum: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have >= ${MIN_INPUTS} inputs`);
