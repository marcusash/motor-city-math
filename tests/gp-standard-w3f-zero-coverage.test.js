// gp-standard-w3f-zero-coverage.test.js — W3.f has ZERO questions — hard fail, GR must add questions

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let total = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.filter(q => q.standard === 'W3.f').length;
}

console.log(`gp-standard-w3f-zero-coverage: ${total} questions with W3.f across all exams`);
if (total === 0) {
  console.log('  FAIL: W3.f standard has ZERO questions — if tested at SAAS, Kai is unprepared');
  console.log('  GR action: confirm if W3.f is in scope and add questions if so');
  // Exit 1 to signal this is a hard gap
  process.exit(1);
} else {
  console.log(`OK — ${total} questions cover W3.f`);
}
