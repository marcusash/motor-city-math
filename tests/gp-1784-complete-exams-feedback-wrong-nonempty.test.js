// gp-1784-complete-exams-feedback-wrong-nonempty.test.js
// All feedback_wrong must be non-empty strings.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (typeof q.feedback_wrong === 'string' && q.feedback_wrong.trim().length >= 3) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' feedback_wrong=' + JSON.stringify(q.feedback_wrong)); }
  }
}
console.log('gp-1784-feedback-wrong-nonempty: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all feedback_wrong are non-empty (' + pass + ' questions)');
