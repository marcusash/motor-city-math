// gp-question-has-section-field.test.js — every question must have a section field

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
  for (const q of data.questions) {
    if (!q.section || typeof q.section !== 'string' || q.section.trim() === '') {
      fail++;
      failures.push(`${file}: Q${q.id} missing or empty section field`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-question-has-section-field: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} questions have section field`);
