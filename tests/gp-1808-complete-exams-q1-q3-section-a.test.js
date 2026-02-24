// gp-1808-complete-exams-q1-q3-are-section-a.test.js
// Q1, Q2, Q3 (positions 1-3) must always be in Section A.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (q.number > 3) continue;
    if (q.section === 'A') pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' Q' + q.number + ' section=' + q.section); }
  }
}
console.log('gp-1808-q1-q3-section-a: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all Q1-Q3 are Section A (' + pass + ' questions)');
