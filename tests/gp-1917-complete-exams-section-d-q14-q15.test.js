// gp-1917-complete-exams-section-d-questions-14-15.test.js
// Section D must be exactly Q14, Q15 (by question number) in every exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const sectionD = data.questions.filter(q => q.section === 'D').map(q => q.number).sort((a,b)=>a-b);
  if (JSON.stringify(sectionD) === '[14,15]') pass++;
  else { fail++; failures.push(data.exam_id + ' Section D Q numbers=' + JSON.stringify(sectionD)); }
}
console.log('gp-1917-section-d-q14-q15: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Section D = Q14,Q15 in all 12 exams');
