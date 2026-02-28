// gp-1161-question-section-is-valid.test.js
// Section must be A, B, C, or D for every question.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID = new Set(['A', 'B', 'C', 'D']);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (VALID.has(q.section)) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' section=' + q.section); }
  }
}
console.log('gp-1161-question-section-is-valid: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' question sections are A/B/C/D');
