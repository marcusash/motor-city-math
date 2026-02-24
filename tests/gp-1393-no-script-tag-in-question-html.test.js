// gp-1393-no-script-tag-in-question-html.test.js
// question_html must not contain <script> tags (XSS guard).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!(q.question_html || '').toLowerCase().includes('<script')) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' question_html has <script>'); }
  }
}
console.log('gp-1393-no-script-in-question-html: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' question_html fields have no <script> tags');
