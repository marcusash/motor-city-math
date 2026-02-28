// gp-2159-complete-exams-exam-id-format.test.js
// exam_id must match 'retake-practice-{N}' pattern in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  if (/^retake-practice-\d+$/.test(data.exam_id)) pass++;
  else { fail++; failures.push(file + ' exam_id=' + data.exam_id); }
}
console.log('gp-2159-exam-id-format: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- exam_id format retake-practice-{N} in all 12 exams');
