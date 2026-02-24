// gp-1238-no-empty-feedback-wrong.test.js
// feedback_wrong must not be empty or missing.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if ((q.feedback_wrong || '').trim().length > 0) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' has empty feedback_wrong'); }
  }
}
console.log('gp-1238-no-empty-feedback-wrong: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' questions have non-empty feedback_wrong');
