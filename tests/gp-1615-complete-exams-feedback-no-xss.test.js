// gp-1615-complete-exams-feedback-no-xss.test.js
// feedback_correct and feedback_wrong must not contain raw script tags.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const XSS_RE = /<script/i;
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    const fields = [q.feedback_correct, q.feedback_wrong, q.hint];
    for (const f of fields) {
      if (!XSS_RE.test(f || '')) pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ' feedback/hint has <script>'); }
    }
  }
}
console.log('gp-1615-feedback-no-xss: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- no feedback/hint contains <script> tags (' + pass + ' checked)');
