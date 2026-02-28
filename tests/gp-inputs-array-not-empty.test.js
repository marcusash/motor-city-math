// gp-inputs-array-not-empty.test.js — every question must have at least one input

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
    if (!Array.isArray(q.inputs) || q.inputs.length === 0) {
      fail++;
      failures.push(`${file}: Q${q.id} has ${Array.isArray(q.inputs) ? 'empty' : 'missing'} inputs array`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-inputs-array-not-empty: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} questions have at least one input`);
