// gp-question-section-a-always-exists.test.js — every exam must have at least 1 Section A question

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const hasA = data.questions.some(q => q.section === 'A');
  const hasC = data.questions.some(q => q.section === 'C');
  const hasD = data.questions.some(q => q.section === 'D');

  if (!hasA) {
    fail++;
    issues.push(`${file}: no Section A questions found`);
  } else if (!hasC) {
    fail++;
    issues.push(`${file}: no Section C questions found`);
  } else if (!hasD) {
    fail++;
    issues.push(`${file}: no Section D questions found`);
  } else {
    pass++;
  }
}

console.log(`gp-question-section-a-always-exists: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} exams have Section A, C, and D questions`);
