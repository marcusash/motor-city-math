// gp-1764-complete-exams-section-c-2-questions-lock.test.js
// Section C has exactly 2 questions per exam (all 12 complete).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const n = data.questions.filter(q => q.section === 'C').length;
  if (n === 2) pass++;
  else { fail++; failures.push(data.exam_id + ' Section C count=' + n); }
}
console.log('gp-1764-section-c-2-questions: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all exams have exactly 2 Section C questions (' + pass + ' exams)');
