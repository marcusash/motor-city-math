// gp-all-feedback-are-strings.test.js — both feedback fields must be strings in every question

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
    if (typeof q.feedback_correct !== 'string') {
      fail++;
      failures.push(`${file}: Q${q.id} feedback_correct is ${typeof q.feedback_correct}`);
    } else { pass++; }
    if (typeof q.feedback_wrong !== 'string') {
      fail++;
      failures.push(`${file}: Q${q.id} feedback_wrong is ${typeof q.feedback_wrong}`);
    } else { pass++; }
  }
}

console.log(`gp-all-feedback-are-strings: ${pass} pass, ${fail} wrong type`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} feedback fields are strings`);
