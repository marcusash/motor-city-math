// gp-1759-complete-exams-all-q-have-feedback.test.js
// Every question must have non-empty feedback_correct and feedback_wrong.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    const fc = typeof q.feedback_correct === 'string' && q.feedback_correct.trim().length > 0;
    const fw = typeof q.feedback_wrong === 'string' && q.feedback_wrong.trim().length > 0;
    if (fc && fw) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' missing feedback fc=' + fc + ' fw=' + fw); }
  }
}
console.log('gp-1759-all-q-have-feedback: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 180 questions have feedback_correct and feedback_wrong (' + pass + ' checked)');
