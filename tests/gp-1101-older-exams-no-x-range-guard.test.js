// gp-1101-older-exams-no-x-range-guard.test.js
// RP1-5 graphs must NOT have x_range field.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const OLDER = [1, 2, 3, 4, 5];

let pass = 0, fail = 0;
const failures = [];

for (const n of OLDER) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, `retake-practice-${n}.json`), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    if (!('x_range' in q.graph)) { pass++; }
    else { fail++; failures.push(`RP${n}: ${q.id} has x_range (expected none for older exams)`); }
  }
}

console.log(`gp-1101-older-exams-no-x-range-guard: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} RP1-5 graphs have no x_range field (older schema)`);
