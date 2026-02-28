// gp-1674-complete-exams-feedback-correct-vs-wrong.test.js
// feedback_correct and feedback_wrong must differ per question.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.feedback_correct || !q.feedback_wrong) continue;
    if (q.feedback_correct.trim() !== q.feedback_wrong.trim()) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' identical feedback'); }
  }
}
console.log('gp-1674-feedback-unique-per-question: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- feedback_correct != feedback_wrong for all questions (' + pass + ' checked)');
