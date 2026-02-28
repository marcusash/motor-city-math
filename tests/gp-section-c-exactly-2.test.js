// gp-section-c-exactly-2.test.js — every exam must have exactly 2 Section C questions

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
  const sectionC = data.questions.filter(q => q.section === 'C');
  if (sectionC.length !== 2) {
    fail++;
    failures.push(`${file}: Section C has ${sectionC.length} questions (expected 2)`);
  } else {
    pass++;
  }
}

console.log(`gp-section-c-exactly-2: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have exactly 2 Section C questions`);
