// gp-1807-complete-exams-q12-q13-are-section-c.test.js
// Q12 and Q13 (positions 12 and 13) must always be in Section C.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (q.number < 12 || q.number > 13) continue;
    if (q.section === 'C') pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' Q' + q.number + ' section=' + q.section); }
  }
}
console.log('gp-1807-q12-q13-section-c: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all Q12/Q13 positions are Section C (' + pass + ' questions)');
