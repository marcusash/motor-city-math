// gp-1103-newer-exams-no-asymptotes.test.js
// RP6-11 graphs must NOT have asymptotes field (newer schema uses x_range/y_range instead).

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const NEWER = [6, 7, 8, 9, 10, 11];

let pass = 0, fail = 0;
const failures = [];

for (const n of NEWER) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, `retake-practice-${n}.json`), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    if (!('asymptotes' in q.graph)) { pass++; }
    else { fail++; failures.push(`RP${n}: ${q.id} has asymptotes field (unexpected for newer schema)`); }
  }
}

console.log(`gp-1103-newer-exams-no-asymptotes: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} RP6-11 graphs have no asymptotes field (newer schema)`);
