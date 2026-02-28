// gp-1945-complete-exams-section-b-q4-to-q11.test.js
// Section B must be exactly Q4-Q11 (by question number) in every exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const EXPECTED = JSON.stringify([4,5,6,7,8,9,10,11]);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const sectionB = data.questions.filter(q => q.section === 'B').map(q => q.number).sort((a,b)=>a-b);
  if (JSON.stringify(sectionB) === EXPECTED) pass++;
  else { fail++; failures.push(data.exam_id + ' Section B Q numbers=' + JSON.stringify(sectionB)); }
}
console.log('gp-1945-section-b-q4-q11: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Section B = Q4-Q11 in all 12 exams');
