// gp-no-trailing-spaces-in-feedback.test.js — feedback fields should not have leading/trailing spaces

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
    for (const field of ['feedback_correct', 'feedback_wrong', 'hint']) {
      const val = q[field];
      if (typeof val !== 'string') continue;
      if (val !== val.trim()) {
        fail++;
        failures.push(`${file}: ${q.id}.${field} has leading/trailing spaces`);
      } else { pass++; }
    }
  }
}

console.log(`gp-no-trailing-spaces-in-feedback: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} feedback/hint fields have no leading/trailing spaces`);
