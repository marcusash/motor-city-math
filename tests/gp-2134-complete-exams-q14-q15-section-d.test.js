// gp-2134-complete-exams-q14-q15-section-d-all-exams.test.js
// Q14 and Q15 must be in Section D in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q14 = data.questions.find(q => q.number === 14);
  const q15 = data.questions.find(q => q.number === 15);
  if (q14 && q15 && q14.section === 'D' && q15.section === 'D') pass++;
  else { fail++; failures.push(data.exam_id + ' Q14.section=' + (q14||{}).section + ' Q15.section=' + (q15||{}).section); }
}
console.log('gp-2134-q14-q15-section-d: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q14 and Q15 are in Section D in all 12 exams');
