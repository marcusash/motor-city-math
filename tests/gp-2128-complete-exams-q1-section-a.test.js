// gp-2128-complete-exams-q1-section-a-all-exams.test.js
// Q1 must be in Section A in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q1 = data.questions.find(q => q.number === 1);
  if (q1 && q1.section === 'A') pass++;
  else { fail++; failures.push(data.exam_id + ' Q1.section=' + (q1 ? q1.section : 'MISSING')); }
}
console.log('gp-2128-q1-section-a: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q1 is in Section A in all 12 exams');
