// gp-1537-question-html-length-bounds.test.js
// question_html must be between 20 and 2000 characters.
// Too short: likely empty/placeholder. Too long: likely bloated.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const len = (q.question_html || '').length;
    if (len >= 20 && len <= 2000) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' html len=' + len); }
  }
}
console.log('gp-1537-question-html-length: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0, 5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' question_html lengths in [20, 2000]');
