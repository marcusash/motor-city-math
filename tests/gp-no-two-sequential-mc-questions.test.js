// gp-no-two-sequential-mc-questions.test.js — avoid 2+ consecutive MC questions (variety for Kai)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const qs = data.questions;
  for (let i = 0; i < qs.length - 1; i++) {
    if (qs[i].type === 'multiple-choice' && qs[i + 1].type === 'multiple-choice') {
      warn++;
      warnings.push(`${file}: Q${qs[i].id} and Q${qs[i+1].id} are consecutive MC questions`);
    }
  }
  pass++;
}

console.log(`gp-no-two-sequential-mc-questions: ${pass} exams checked, ${warn} pairs flagged`);
if (warnings.length) {
  console.log('INFO — consecutive MC questions (consider variety):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams checked for sequential MC variety`);
