// gp-2176-complete-exams-no-empty-feedback.test.js
// No feedback_correct or feedback_wrong should be empty in any exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const bad = data.questions.filter(q => (q.feedback_correct && q.feedback_correct.trim() === '') || (q.feedback_wrong && q.feedback_wrong.trim() === ''));
  if (bad.length === 0) pass++;
  else { fail++; failures.push(data.exam_id + ' empty feedback Q' + bad.map(q=>q.number).join(',')); }
}
console.log('gp-2176-no-empty-feedback: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- No empty feedback fields in all 12 exams');
