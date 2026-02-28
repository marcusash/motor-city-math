// gp-1675-complete-exams-hint-per-question.test.js
// Every question in every complete exam must have a non-empty hint.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (typeof q.hint === 'string' && q.hint.trim().length > 0) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' missing/empty hint'); }
  }
}
console.log('gp-1675-hint-per-question: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all questions have non-empty hint (' + pass + ' checked)');
