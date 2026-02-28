// gp-1763-complete-exams-section-b-8-questions-lock.test.js
// Section B has exactly 8 questions per exam (all 12 complete).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const n = data.questions.filter(q => q.section === 'B').length;
  if (n === 8) pass++;
  else { fail++; failures.push(data.exam_id + ' Section B count=' + n); }
}
console.log('gp-1763-section-b-8-questions: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all exams have exactly 8 Section B questions (' + pass + ' exams)');
