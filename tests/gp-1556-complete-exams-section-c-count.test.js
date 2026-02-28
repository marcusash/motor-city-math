// gp-1556-complete-exams-section-c-count.test.js
// Section C must have exactly 2 questions in all complete exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const sectionC = data.questions.filter(q => q.section === 'C').length;
  if (sectionC === 2) pass++;
  else { fail++; failures.push(data.exam_id + ': section C count=' + sectionC); }
}
console.log('gp-1556-section-c-count: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Section C = 2 questions in all ' + pass + ' complete exams');
