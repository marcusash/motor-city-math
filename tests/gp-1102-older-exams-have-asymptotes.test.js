// gp-1102-older-exams-have-asymptotes.test.js
// RP1-5 graphs must have asymptotes field (may be null/empty but field must exist).

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
    if ('asymptotes' in q.graph) { pass++; }
    else { fail++; failures.push(`RP${n}: ${q.id} missing asymptotes field`); }
  }
}

console.log(`gp-1102-older-exams-have-asymptotes: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} RP1-5 graphs have asymptotes field`);
