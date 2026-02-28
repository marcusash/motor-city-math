// gp-1578-complete-exams-feedback-correct-word-count.test.js
// feedback_correct must be <=12 words (ADHD guideline).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    const words = (q.feedback_correct || '').split(/\s+/).filter(Boolean).length;
    if (words <= 12) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' feedback_correct words=' + words); }
  }
}
console.log('gp-1578-feedback-correct-word-count: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all feedback_correct <=12 words (' + pass + ' checked)');
