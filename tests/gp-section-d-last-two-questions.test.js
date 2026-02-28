// gp-section-d-last-two-questions.test.js — Section D must be the last 2 questions (indices 13-14)

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
  const secD = data.questions.map((q, i) => ({ q, i })).filter(({ q }) => q.section === 'D');
  const indices = secD.map(({ i }) => i);
  if (secD.length !== 2 || indices[0] !== 13 || indices[1] !== 14) {
    fail++;
    failures.push(`${file}: Section D at indices [${indices.join(',')}] (expected [13,14])`);
  } else {
    pass++;
  }
}

console.log(`gp-section-d-last-two-questions: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have Section D at positions 14-15 (indices 13-14)`);
