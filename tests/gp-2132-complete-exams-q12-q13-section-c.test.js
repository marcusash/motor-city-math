// gp-2132-complete-exams-q12-q13-section-c-all-exams.test.js
// Q12 and Q13 must be in Section C in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q12 = data.questions.find(q => q.number === 12);
  const q13 = data.questions.find(q => q.number === 13);
  if (q12 && q13 && q12.section === 'C' && q13.section === 'C') pass++;
  else { fail++; failures.push(data.exam_id + ' Q12.section=' + (q12||{}).section + ' Q13.section=' + (q13||{}).section); }
}
console.log('gp-2132-q12-q13-section-c: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q12 and Q13 are in Section C in all 12 exams');
