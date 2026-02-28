// gp-1219-question-html-no-onerror.test.js
// question_html must not contain onerror event handlers.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (/onerror/i.test(q.question_html || '')) { fail++; failures.push(file + ': ' + q.id); }
    else pass++;
  }
}
console.log('gp-1219-question-html-no-onerror: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- no onerror handlers in question_html');
