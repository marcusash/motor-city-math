// gp-1098-newer-exams-have-x-range-guard.test.js
// RP6-11 graphs must have x_range (2-element array).

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
    const xr = q.graph.x_range;
    if (Array.isArray(xr) && xr.length === 2) { pass++; }
    else { fail++; failures.push(`RP${n}: ${q.id} x_range="${JSON.stringify(xr)}" (need [min,max])`); }
  }
}

console.log(`gp-1098-newer-exams-have-x-range-guard: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} RP6-11 graphs have valid x_range arrays`);
