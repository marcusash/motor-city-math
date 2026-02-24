// gp-1809-complete-exams-q4-q11-are-section-b.test.js
// Q4-Q11 (positions 4-11) must always be in Section B.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (q.number < 4 || q.number > 11) continue;
    if (q.section === 'B') pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' Q' + q.number + ' section=' + q.section); }
  }
}
console.log('gp-1809-q4-q11-section-b: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all Q4-Q11 are Section B (' + pass + ' questions)');
