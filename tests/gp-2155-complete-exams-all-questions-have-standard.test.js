// gp-2155-complete-exams-all-questions-have-standard.test.js
// Every question must have a non-empty standard field in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const noStd = data.questions.filter(q => !q.standard || typeof q.standard !== 'string' || q.standard.trim() === '');
  if (noStd.length === 0) pass++;
  else { fail++; failures.push(data.exam_id + ' missing std Q' + noStd.map(q=>q.number).join(',')); }
}
console.log('gp-2155-all-questions-have-standard: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All questions have non-empty standard in all 12 exams');
