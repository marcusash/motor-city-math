// gp-all-sections-represented-per-exam.test.js — every exam must have at least 1 question per section A/B/C/D

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
  const sections = new Set(data.questions.map(q => q.section));
  const missing = ['A','B','C','D'].filter(s => !sections.has(s));
  if (missing.length > 0) {
    fail++;
    failures.push(`${file}: missing sections: ${missing.join(', ')}`);
  } else {
    pass++;
  }
}

console.log(`gp-all-sections-represented-per-exam: ${pass} pass, ${fail} missing sections`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have questions in all 4 sections`);
