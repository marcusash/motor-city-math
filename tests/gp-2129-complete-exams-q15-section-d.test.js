// gp-2129-complete-exams-q15-section-d-all-exams.test.js
// Q15 must be in Section D in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q15 = data.questions.find(q => q.number === 15);
  if (q15 && q15.section === 'D') pass++;
  else { fail++; failures.push(data.exam_id + ' Q15.section=' + (q15 ? q15.section : 'MISSING')); }
}
console.log('gp-2129-q15-section-d: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q15 is in Section D in all 12 exams');
