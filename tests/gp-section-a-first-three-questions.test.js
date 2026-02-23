// gp-section-a-first-three-questions.test.js — Section A must always be questions 1-3 (indices 0-2)

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
  const secA = data.questions.map((q, i) => ({ q, i })).filter(({ q }) => q.section === 'A');
  const indices = secA.map(({ i }) => i);
  if (!indices.every((v, i) => v === i) || secA.length !== 3) {
    fail++;
    failures.push(`${file}: Section A at indices [${indices.join(',')}] (expected [0,1,2])`);
  } else {
    pass++;
  }
}

console.log(`gp-section-a-first-three-questions: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have Section A at positions 1-3 (indices 0-2)`);
