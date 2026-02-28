// gp-each-exam-has-section-a.test.js — every exam must have at least 1 Section A question

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
  const sectionA = data.questions.filter(q => q.section === 'A');
  if (sectionA.length >= 1) { pass++; }
  else { fail++; failures.push(`${file}: no Section A questions`); }
}

console.log(`gp-each-exam-has-section-a: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have Section A questions`);
