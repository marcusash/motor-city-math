// gp-section-b-q11-is-last.test.js — Section B last question should always be at index 10 (Q11)

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
  const q11 = data.questions[10];
  if (!q11 || q11.section !== 'B') {
    fail++;
    failures.push(`${file}: Q11 (index 10) is section="${q11 ? q11.section : 'missing'}" (expected B)`);
  } else {
    pass++;
  }
}

console.log(`gp-section-b-q11-is-last: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have Section B ending at Q11 (index 10)`);
