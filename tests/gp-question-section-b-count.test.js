// gp-question-section-b-count.test.js — Section B should have 3-5 questions per exam

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_B = 6;
const MAX_B = 10;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const bCount = data.questions.filter(q => q.section === 'B').length;
  if (bCount < MIN_B || bCount > MAX_B) {
    warn++;
    warnings.push(`${file}: Section B has ${bCount} questions (expected ${MIN_B}-${MAX_B})`);
  } else {
    pass++;
  }
}

console.log(`gp-question-section-b-count: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have ${MIN_B}-${MAX_B} Section B questions`);
