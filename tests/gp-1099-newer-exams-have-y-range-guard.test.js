// gp-1099-newer-exams-have-y-range-guard.test.js
// RP6-11 graphs must have y_range (2-element array).

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
    const yr = q.graph.y_range;
    if (Array.isArray(yr) && yr.length === 2) { pass++; }
    else { fail++; failures.push(`RP${n}: ${q.id} y_range="${JSON.stringify(yr)}" (need [min,max])`); }
  }
}

console.log(`gp-1099-newer-exams-have-y-range-guard: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} RP6-11 graphs have valid y_range arrays`);
