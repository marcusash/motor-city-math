// gp-no-null-question-fields.test.js — core question fields must not be null

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const CORE_FIELDS = ['id', 'section', 'type', 'standard', 'question_html', 'hint', 'feedback_correct', 'feedback_wrong'];
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const field of CORE_FIELDS) {
      if (q[field] === null) {
        fail++;
        failures.push(`${file}: ${q.id}.${field} is null`);
      } else { pass++; }
    }
  }
}

console.log(`gp-no-null-question-fields: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} core question fields are non-null`);
