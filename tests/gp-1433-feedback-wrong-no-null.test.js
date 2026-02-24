// gp-1433-feedback-wrong-no-null.test.js
// feedback_wrong must not be null or contain the word "null".

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (q.feedback_wrong !== null && !(q.feedback_wrong || '').includes('null')) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' feedback_wrong has null issue'); }
  }
}
console.log('gp-1433-feedback-wrong-no-null: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' feedback_wrong are null-free');
