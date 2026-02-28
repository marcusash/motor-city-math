// gp-2156-complete-exams-all-questions-have-question-html.test.js
// Every question must have a non-empty question_html field in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const noQ = data.questions.filter(q => !q.question_html || typeof q.question_html !== 'string' || q.question_html.trim() === '');
  if (noQ.length === 0) pass++;
  else { fail++; failures.push(data.exam_id + ' missing question_html Q' + noQ.map(q=>q.number).join(',')); }
}
console.log('gp-2156-all-questions-have-html: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All questions have non-empty question_html in all 12 exams');
