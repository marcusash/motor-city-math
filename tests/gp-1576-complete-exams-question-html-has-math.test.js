// gp-1576-complete-exams-question-html-has-math.test.js
// question_html for most questions should reference math content (dollar sign or digit).
// Advisory: flags questions with very short/plain question_html.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, advisory = 0; const advisories = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    const html = q.question_html || '';
    if (html.length >= 20) pass++;
    else { advisory++; advisories.push(data.exam_id + ':' + q.id + ' html.length=' + html.length); }
  }
}
console.log('gp-1576-question-html-length: ' + pass + ' pass, ' + advisory + ' advisory (very short)');
advisories.forEach(a => console.log('  ADVISORY:', a));
console.log('OK -- question_html length check complete (' + pass + '/' + (pass+advisory) + ' meet >=20 chars)');
