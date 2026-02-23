// gp-section-b-q4-is-first.test.js — Section B first question should always be at index 3 (Q4)

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
  const q4 = data.questions[3];
  if (!q4 || q4.section !== 'B') {
    fail++;
    failures.push(`${file}: Q4 (index 3) is section="${q4 ? q4.section : 'missing'}" (expected B)`);
  } else {
    pass++;
  }
}

console.log(`gp-section-b-q4-is-first: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have Section B starting at Q4 (index 3)`);
