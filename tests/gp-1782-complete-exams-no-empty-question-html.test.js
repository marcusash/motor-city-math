// gp-1782-complete-exams-no-empty-question-html.test.js
// All question_html fields must be non-empty strings.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (typeof q.question_html === 'string' && q.question_html.trim().length >= 10) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' question_html empty or missing'); }
  }
}
console.log('gp-1782-question-html-nonempty: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all question_html are non-empty strings (' + pass + ' questions)');
