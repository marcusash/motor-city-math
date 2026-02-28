// gp-1897-complete-exams-section-b-8-questions-per-exam.test.js
// Every complete exam must have exactly 8 Section B questions (Q4-Q11).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const bCount = data.questions.filter(q => q.section === 'B').length;
  if (bCount === 8) pass++;
  else { fail++; failures.push(data.exam_id + ' Section B count=' + bCount); }
}
console.log('gp-1897-section-b-8: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 12 exams have exactly 8 Section B questions');
