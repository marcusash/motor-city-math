// gp-1059-per-exam-word-problem-in-section-d.test.js — Q15 (last question) must be word-problem

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
  const q15 = data.questions[14]; // index 14 = Q15
  if (q15 && q15.type === 'word-problem' && q15.section === 'D') { pass++; }
  else { fail++; failures.push(`${file}: Q15 is type="${q15?.type}" section="${q15?.section}" (expected word-problem/D)`); }
}

console.log(`gp-1059-per-exam-word-problem-in-section-d: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have word-problem as Q15 in Section D`);
