// gp-1014-max-inputs-per-question-guard.test.js — no question should have more than 10 inputs

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX = 10;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const count = (q.inputs || []).length;
    if (count <= MAX) { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} has ${count} inputs (max ${MAX})`); }
  }
}

console.log(`gp-1014-max-inputs-per-question-guard: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} questions have <= ${MAX} inputs`);
