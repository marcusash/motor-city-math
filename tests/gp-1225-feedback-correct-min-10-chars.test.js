// gp-1225-feedback-correct-min-10-chars.test.js
// feedback_correct must be at least 10 characters.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fc = (q.feedback_correct || '').trim();
    if (fc.length >= 10) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' feedback_correct too short: "' + fc + '"'); }
  }
}
console.log('gp-1225-feedback-correct-min-10-chars: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' feedback_correct strings are >= 10 characters');
