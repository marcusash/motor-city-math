// gp-section-a-min-3-questions.test.js — every exam must have at least 3 Section A questions

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_A = 3;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const sectionA = data.questions.filter(q => q.section === 'A');
  if (sectionA.length < MIN_A) {
    warn++;
    warnings.push(`${file}: Section A has only ${sectionA.length} questions (min ${MIN_A})`);
  } else {
    pass++;
    console.log(`  ${file}: Section A = ${sectionA.length} questions`);
  }
}

console.log(`gp-section-a-min-3-questions: ${pass} pass, ${warn} below min`);
if (warnings.length) {
  console.log('INFO — exams with fewer than 3 Section A questions:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have 3+ Section A questions`);
