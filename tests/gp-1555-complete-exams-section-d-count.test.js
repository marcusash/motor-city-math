// gp-1555-complete-exams-section-d-count.test.js
// Section D must have exactly 2 questions in all complete exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const sectionD = data.questions.filter(q => q.section === 'D').length;
  if (sectionD === 2) pass++;
  else { fail++; failures.push(data.exam_id + ': section D count=' + sectionD); }
}
console.log('gp-1555-section-d-count: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Section D = 2 questions in all ' + pass + ' complete exams');
