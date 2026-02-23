// gp-section-c-q12-q13.test.js — Section C must be Q12, Q13 (indices 11-12)

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
  const n = data.exam_id.replace('retake-practice-', '');
  for (let i = 11; i <= 12; i++) {
    const q = data.questions[i];
    const expectedId = `rp${n}-q${i + 1}`;
    if (q && q.id === expectedId && q.section === 'C') { pass++; }
    else { fail++; failures.push(`${file}: q[${i}] expected "${expectedId}" in C, got id="${q && q.id}" section="${q && q.section}"`); }
  }
}

console.log(`gp-section-c-q12-q13: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} Section C questions correctly indexed Q12-Q13`);
