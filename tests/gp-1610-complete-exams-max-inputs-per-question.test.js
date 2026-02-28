// gp-1610-complete-exams-max-inputs-per-question.test.js
// Max inputs per question should be <=10 (data quality guard).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    const n = (q.inputs || []).length;
    if (n <= 10) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' inputs=' + n); }
  }
}
console.log('gp-1610-max-inputs-per-question: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all questions have <=10 inputs (' + pass + ' checked)');
