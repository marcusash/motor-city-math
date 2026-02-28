// gp-section-b-exists.test.js — every exam must have at least one Section B question
// Section B is the core free-response section for this exam format

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
  const hasB = data.questions.some(q => q.section === 'B');
  if (hasB) {
    pass++;
  } else {
    fail++;
    issues.push(`${file}: no Section B questions found`);
  }
}

console.log(`gp-section-b-exists: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have Section B questions`);
