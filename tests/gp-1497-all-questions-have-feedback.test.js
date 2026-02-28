// gp-1497-all-questions-have-feedback.test.js
// Every question must have both feedback_correct and feedback_wrong fields.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (q.feedback_correct && q.feedback_wrong) pass++;
    else {
      fail++;
      const missing = [];
      if (!q.feedback_correct) missing.push('feedback_correct');
      if (!q.feedback_wrong) missing.push('feedback_wrong');
      failures.push(data.exam_id + ':' + q.id + ' missing: ' + missing.join(', '));
    }
  }
}
console.log('gp-1497-all-have-feedback: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 165 questions have both feedback fields');
