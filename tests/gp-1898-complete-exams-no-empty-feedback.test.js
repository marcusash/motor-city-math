// gp-1898-complete-exams-no-empty-feedback.test.js
// No question may have empty-string feedback_correct or feedback_wrong.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const field of ['feedback_correct','feedback_wrong']) {
      const v = q[field];
      if (!Object.prototype.hasOwnProperty.call(q, field)) continue;
      if (typeof v === 'string' && v.trim().length > 0) pass++;
      else { fail++; failures.push(data.exam_id+':'+q.id+' '+field+'=""'); }
    }
  }
}
console.log('gp-1898-no-empty-feedback: ' + pass + ' non-empty, ' + fail + ' empty');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- no empty feedback strings (' + pass + ' checked)');
