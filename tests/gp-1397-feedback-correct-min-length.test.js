// gp-1397-feedback-correct-min-length.test.js
// feedback_correct must be at least 10 chars.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if ((q.feedback_correct || '').length >= 10) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' feedback_correct length=' + (q.feedback_correct || '').length); }
  }
}
console.log('gp-1397-feedback-correct-min-length: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' feedback_correct >= 10 chars');
