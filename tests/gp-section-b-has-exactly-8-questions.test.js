// gp-section-b-has-exactly-8-questions.test.js — each exam must have exactly 8 Section B questions

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
  const sectionB = data.questions.filter(q => q.section === 'B');
  if (sectionB.length !== 8) {
    fail++; failures.push(`${file}: Section B has ${sectionB.length} questions (expected 8)`);
  } else {
    pass++;
  }
}

console.log(`gp-section-b-has-exactly-8-questions: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have exactly 8 Section B questions`);
