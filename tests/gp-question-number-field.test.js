// gp-question-number-field.test.js — number field is a positive integer >= 1
// Question numbering must be sequential integers for exam display order

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();

let pass = 0;
let fail = 0;
const violations = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const questions = data.questions || [];
  for (const q of questions) {
    if (q.number === undefined) {
      fail++;
      violations.push(`${file} Q${q.id || '?'}: missing number field`);
    } else if (!Number.isInteger(q.number) || q.number < 1) {
      fail++;
      violations.push(`${file} Q${q.id}: number=${q.number} is not a positive integer`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-question-number-field: ${pass}/${pass + fail} pass`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log('OK — all question number fields are positive integers');
