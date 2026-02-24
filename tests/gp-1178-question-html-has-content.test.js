// gp-1178-question-html-has-content.test.js
// question_html must have more than just HTML tags -- at least 10 chars of content.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const stripped = (q.question_html || '').replace(/<[^>]+>/g, '').trim();
    if (stripped.length >= 10) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' question_html stripped to "' + stripped + '"'); }
  }
}
console.log('gp-1178-question-html-has-content: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' questions have substantial question_html content');
