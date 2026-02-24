// gp-1554-complete-exams-section-a-count.test.js
// Section A must have exactly 3 questions in all complete exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const sectionA = data.questions.filter(q => q.section === 'A').length;
  if (sectionA === 3) pass++;
  else { fail++; failures.push(data.exam_id + ': section A count=' + sectionA); }
}
console.log('gp-1554-section-a-count: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Section A = 3 questions in all ' + pass + ' complete exams');
