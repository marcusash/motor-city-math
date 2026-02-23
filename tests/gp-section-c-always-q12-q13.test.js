// gp-section-c-always-q12-q13.test.js — Section C questions must always be at position 12 and 13 (1-indexed)

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
  const secC = data.questions
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => q.section === 'C');
  
  if (secC.length !== 2) {
    fail++;
    failures.push(`${file}: Section C has ${secC.length} questions (expected 2)`);
    continue;
  }
  
  const [c1, c2] = secC;
  if (c1.i !== 11 || c2.i !== 12) {
    fail++;
    failures.push(`${file}: Section C at positions [${c1.i+1},${c2.i+1}] (expected [12,13])`);
  } else {
    pass++;
  }
}

console.log(`gp-section-c-always-q12-q13: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have Section C at positions 12 and 13`);
