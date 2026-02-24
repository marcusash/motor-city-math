// gp-1806-complete-exams-q14-q15-are-section-d.test.js
// Q14 and Q15 (positions 14 and 15) must always be in Section D.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (q.number < 14) continue;
    if (q.section === 'D') pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' Q' + q.number + ' section=' + q.section); }
  }
}
console.log('gp-1806-q14-q15-section-d: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all Q14/Q15 positions are Section D (' + pass + ' questions)');
