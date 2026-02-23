// gp-1033-exam-total-solution-steps-regression.test.js — total solution_steps across all exams = 748

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED = 748;
let total = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) { total += (q.solution_steps || []).length; }
}

console.log(`gp-1033-exam-total-solution-steps-regression: total=${total} (expected ${EXPECTED})`);
if (total !== EXPECTED) {
  console.log(`  FAIL: expected ${EXPECTED} steps, got ${total}`);
  process.exit(1);
}
console.log(`OK — total solution steps locked at ${EXPECTED}`);
