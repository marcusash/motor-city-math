// gp-1839-complete-exams-all-q-have-number.test.js
// Every question must have a number field (integer 1-15).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (typeof q.number === 'number' && Number.isInteger(q.number) && q.number >= 1 && q.number <= 15) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' number=' + JSON.stringify(q.number)); }
  }
}
console.log('gp-1839-all-q-have-number: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all questions have integer number 1-15 (' + pass + ' questions)');
