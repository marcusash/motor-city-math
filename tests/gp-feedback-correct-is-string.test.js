// gp-feedback-correct-is-string.test.js — feedback_correct must be a non-empty string

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
    const fc = q.feedback_correct;
    if (typeof fc !== 'string' || fc.trim() === '') {
      fail++;
      failures.push(`${file}: Q${q.id} feedback_correct=${JSON.stringify(fc)}`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-feedback-correct-is-string: ${pass} pass, ${fail} invalid`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} feedback_correct fields are non-empty strings`);
