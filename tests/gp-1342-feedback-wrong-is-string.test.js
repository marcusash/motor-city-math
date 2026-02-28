// gp-1342-feedback-wrong-is-string.test.js
// feedback_wrong must be a string in all questions.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (typeof q.feedback_wrong === 'string') pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' feedback_wrong type=' + typeof q.feedback_wrong); }
  }
}
console.log('gp-1342-feedback-wrong-is-string: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' feedback_wrong fields are strings');
