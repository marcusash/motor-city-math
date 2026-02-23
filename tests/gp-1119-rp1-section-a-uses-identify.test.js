// gp-1119-rp1-section-a-uses-identify.test.js
// RP1 Section A Q1/Q2/Q3 must all be identify type (older exam pattern).

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'retake-practice-1.json'), 'utf8'));

let pass = 0, fail = 0;
const failures = [];

for (const q of data.questions.filter(q => q.section === 'A')) {
  if (q.type === 'identify') { pass++; }
  else { fail++; failures.push(`${q.id} type="${q.type}" (expected identify)`); }
}

console.log(`gp-1119-rp1-section-a-uses-identify: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- RP1 Section A: ${pass} questions all use identify type (older exam pattern)`);
