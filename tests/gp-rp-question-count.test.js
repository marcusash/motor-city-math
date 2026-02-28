// gp-rp-question-count.test.js — all RP exams must have exactly 15 questions (exam spec requirement)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED_COUNT = 15;
let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const count = (data.questions || []).length;
  if (count === EXPECTED_COUNT) {
    pass++;
    console.log(`  OK: ${file} — ${count} questions`);
  } else {
    fail++;
    issues.push(`${file}: has ${count} questions (expected ${EXPECTED_COUNT})`);
  }
}

console.log(`gp-rp-question-count: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  FAIL:', i));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have exactly ${EXPECTED_COUNT} questions`);
