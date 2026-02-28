// gp-exam-last-question-is-section-d.test.js — last question in every exam must be Section D

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
  const last = data.questions[data.questions.length - 1];
  if (!last || last.section !== 'D') {
    fail++;
    failures.push(`${file}: Last question section="${last ? last.section : 'missing'}" (expected D)`);
  } else { pass++; }
}

console.log(`gp-exam-last-question-is-section-d: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams end with a Section D question`);
