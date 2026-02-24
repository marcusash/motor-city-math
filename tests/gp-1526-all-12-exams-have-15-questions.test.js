// gp-1526-all-12-exams-have-15-questions.test.js
// All 12 exams must have exactly 15 questions.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length === 15) pass++;
  else { fail++; failures.push(data.exam_id + ': ' + data.questions.length + ' questions'); }
}
console.log('gp-1526-12-exams-15-qs: ' + pass + '/' + RP_FILES.length + ' pass');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have exactly 15 questions');
