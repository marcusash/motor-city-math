// gp-1709-complete-exams-question-html-no-raw-script.test.js
// question_html must not contain <script tags (XSS guard).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    const html = (q.question_html || '').toLowerCase();
    if (!html.includes('<script')) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' has <script>'); }
  }
}
console.log('gp-1709-no-script-in-html: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- no <script in question_html (' + pass + ' checked)');
