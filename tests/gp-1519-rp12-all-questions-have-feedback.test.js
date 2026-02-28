// gp-1519-rp12-all-questions-have-feedback.test.js
// All 15 RP12 questions must have both feedback_correct and feedback_wrong.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-12.json'), 'utf8'));
let pass = 0, fail = 0; const failures = [];
for (const q of data.questions) {
  if (q.feedback_correct && q.feedback_wrong) pass++;
  else {
    fail++;
    const missing = [];
    if (!q.feedback_correct) missing.push('fc');
    if (!q.feedback_wrong) missing.push('fw');
    failures.push(q.id + ' missing: ' + missing.join(', '));
  }
}
console.log('gp-1519-rp12-feedback: ' + pass + '/15 pass');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 15 RP12 questions have both feedback fields');
