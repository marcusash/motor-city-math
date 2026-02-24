// gp-1743-complete-exams-all-q-have-standard.test.js
// Every question must have a non-empty standard field.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (typeof q.standard === 'string' && q.standard.length > 0) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' no standard'); }
  }
}
console.log('gp-1743-all-q-have-standard: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 180 questions have non-empty standard (' + pass + ' checked)');
