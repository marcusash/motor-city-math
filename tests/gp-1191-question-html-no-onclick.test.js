// gp-1191-question-html-no-onclick.test.js
// question_html must not contain onclick handlers (security).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (/onclick/i.test(q.question_html || '')) { fail++; failures.push(file + ': ' + q.id + ' has onclick'); }
    else pass++;
  }
}
console.log('gp-1191-question-html-no-onclick: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- no onclick handlers in question_html');
