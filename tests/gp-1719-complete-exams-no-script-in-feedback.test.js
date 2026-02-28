// gp-1719-complete-exams-hint-no-script.test.js
// No hint field should contain <script (XSS guard).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    const hint = (q.hint || '').toLowerCase();
    const fc = (q.feedback_correct || '').toLowerCase();
    const fw = (q.feedback_wrong || '').toLowerCase();
    if (!hint.includes('<script') && !fc.includes('<script') && !fw.includes('<script')) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' has <script in feedback/hint'); }
  }
}
console.log('gp-1719-no-script-in-feedback: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- no <script in hint/feedback_correct/wrong (' + pass + ' questions)');
