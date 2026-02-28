// gp-1695-complete-exams-word-problem-long-html.test.js
// Word-problem questions must have question_html >= 100 chars and >=1 number in text.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (q.type !== 'word-problem') continue;
    const html = q.question_html || '';
    if (html.length >= 100) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' html length=' + html.length); }
  }
}
console.log('gp-1695-word-problem-html-length: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all word-problem questions have >=100 char question_html (' + pass + ' checked)');
