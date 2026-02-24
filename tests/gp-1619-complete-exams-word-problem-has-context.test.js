// gp-1619-complete-exams-word-problem-has-context.test.js
// Word-problem questions must have question_html >= 100 chars (enough narrative context).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (q.type !== 'word-problem') continue;
    const len = (q.question_html || '').length;
    if (len >= 100) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' question_html.length=' + len); }
  }
}
console.log('gp-1619-word-problem-context: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all word-problem questions have >=100 char question_html (' + pass + ' checked)');
