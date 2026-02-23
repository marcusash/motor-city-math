// gp-1123-no-empty-feedback-correct.test.js
// feedback_correct must not be empty in any question.

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
  for (const q of data.questions) {
    const fc = (q.feedback_correct || '').trim();
    if (fc.length > 0) { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} has empty feedback_correct`); }
  }
}

console.log(`gp-1123-no-empty-feedback-correct: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} questions have non-empty feedback_correct`);
