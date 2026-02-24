// gp-1563-complete-exams-question-html-nonempty.test.js
// Every question must have a non-empty question_html string.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (q.question_html && typeof q.question_html === 'string' && q.question_html.trim().length > 0) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' question_html missing/empty'); }
  }
}
console.log('gp-1563-question-html-nonempty: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all questions have non-empty question_html (' + pass + ' checked)');
