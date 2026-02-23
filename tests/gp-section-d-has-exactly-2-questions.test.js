// gp-section-d-has-exactly-2-questions.test.js — each exam must have exactly 2 Section D questions

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
  const sectionD = data.questions.filter(q => q.section === 'D');
  if (sectionD.length !== 2) {
    fail++; failures.push(`${file}: Section D has ${sectionD.length} questions (expected 2)`);
  } else {
    pass++;
  }
}

console.log(`gp-section-d-has-exactly-2-questions: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have exactly 2 Section D questions`);
