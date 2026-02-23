// gp-exam-first-question-is-section-a.test.js — first question in every exam must be Section A

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const first = data.questions[0];
  if (!first || first.section !== 'A') {
    fail++;
    failures.push(`${file}: First question section="${first ? first.section : 'missing'}" (expected A)`);
  } else { pass++; }
}

console.log(`gp-exam-first-question-is-section-a: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams start with a Section A question`);
