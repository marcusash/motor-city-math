// gp-1557-complete-exams-section-b-count.test.js
// Section B must have exactly 8 questions in all complete exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const sectionB = data.questions.filter(q => q.section === 'B').length;
  if (sectionB === 8) pass++;
  else { fail++; failures.push(data.exam_id + ': section B count=' + sectionB); }
}
console.log('gp-1557-section-b-count: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Section B = 8 questions in all ' + pass + ' complete exams');
