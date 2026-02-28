// gp-section-d-is-last-two.test.js — Section D questions must be Q14 and Q15 (last 2)

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
  const qs = data.questions;
  const q14 = qs[13]; // index 13 = 14th question
  const q15 = qs[14]; // index 14 = 15th question

  [['Q14', q14], ['Q15', q15]].forEach(([label, q]) => {
    if (!q) { fail++; failures.push(`${file}: ${label} not found`); return; }
    if (q.section !== 'D') {
      fail++; failures.push(`${file}: ${label} (id=${q.id}) in Section ${q.section} (expected D)`);
    } else { pass++; }
  });
}

console.log(`gp-section-d-is-last-two: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} Q14/Q15 across 11 exams are Section D`);
