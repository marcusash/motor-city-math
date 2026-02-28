// gp-section-a-has-at-least-3-questions.test.js — each exam must have >= 3 Section A questions

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
  const sectionA = data.questions.filter(q => q.section === 'A');
  if (sectionA.length < 3) {
    fail++; failures.push(`${file}: Section A has ${sectionA.length} questions (need >= 3)`);
  } else {
    pass++;
  }
}

console.log(`gp-section-a-has-at-least-3-questions: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have >= 3 Section A questions`);
