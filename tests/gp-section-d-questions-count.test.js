// gp-section-d-questions-count.test.js — Section D should have exactly 2 questions (Q14 and Q15)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED_D_COUNT = 2;

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const sectionD = data.questions.filter(q => q.section === 'D');
  if (sectionD.length !== EXPECTED_D_COUNT) {
    fail++;
    failures.push(`${file}: Section D has ${sectionD.length} questions (expected ${EXPECTED_D_COUNT})`);
  } else {
    pass++;
  }
}

console.log(`gp-section-d-questions-count: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have exactly ${EXPECTED_D_COUNT} Section D questions`);
