// gp-1072-q4-always-in-section-b.test.js
// Q4 (index 3) must always be in Section B.

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
  const q4 = data.questions[3];
  if (q4 && q4.section === 'B') { pass++; }
  else { fail++; failures.push(`${file}: Q4 (index 3) is section="${q4?.section}" (expected B)`); }
}

console.log(`gp-1072-q4-always-in-section-b: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have Q4 (index 3) in Section B`);
