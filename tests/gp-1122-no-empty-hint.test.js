// gp-1122-no-empty-hint.test.js
// hint must not be empty or whitespace-only in any question.

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
    const hint = (q.hint || '').trim();
    if (hint.length > 0) { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} has empty hint`); }
  }
}

console.log(`gp-1122-no-empty-hint: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} questions have non-empty hint`);
