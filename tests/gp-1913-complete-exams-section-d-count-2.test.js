// gp-1913-complete-exams-section-d-2-questions-per-exam.test.js
// Every complete exam must have exactly 2 Section D questions.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const count = data.questions.filter(q => q.section === 'D').length;
  if (count === 2) pass++;
  else { fail++; failures.push(data.exam_id + ' Section D count=' + count); }
}
console.log('gp-1913-section-d-2: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 12 exams have exactly 2 Section D questions');
