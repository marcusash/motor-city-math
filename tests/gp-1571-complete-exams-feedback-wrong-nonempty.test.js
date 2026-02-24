// gp-1571-complete-exams-feedback-wrong-nonempty.test.js
// Every question must have a non-empty 'feedback_wrong' string.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (q.feedback_wrong && typeof q.feedback_wrong === 'string' && q.feedback_wrong.trim().length > 0) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' feedback_wrong missing/empty'); }
  }
}
console.log('gp-1571-feedback-wrong-nonempty: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all questions have non-empty feedback_wrong (' + pass + ' checked)');
