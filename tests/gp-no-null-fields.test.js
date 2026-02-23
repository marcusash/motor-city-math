// gp-no-null-fields.test.js — no null values in required string fields
// Null in required fields causes renderer crashes on Kai's screen

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const REQUIRED_QUESTION_FIELDS = ['id', 'number', 'section', 'standard', 'type', 'hint', 'feedback_correct'];

let pass = 0;
let fail = 0;
const violations = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const questions = data.questions || [];
  for (const q of questions) {
    for (const field of REQUIRED_QUESTION_FIELDS) {
      if (field in q) {
        if (q[field] === null) {
          fail++;
          violations.push(`${file} Q${q.id || q.number} .${field} is null`);
        } else {
          pass++;
        }
      }
    }
  }
}

console.log(`gp-no-null-fields: ${pass} pass, ${fail} fail`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log('OK — no null values in required question fields');
