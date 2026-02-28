// gp-1916-complete-exams-section-a-questions-1-2-3.test.js
// Section A must be exactly Q1, Q2, Q3 (by question number) in every exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const sectionA = data.questions.filter(q => q.section === 'A').map(q => q.number).sort((a,b)=>a-b);
  if (JSON.stringify(sectionA) === '[1,2,3]') pass++;
  else { fail++; failures.push(data.exam_id + ' Section A Q numbers=' + JSON.stringify(sectionA)); }
}
console.log('gp-1916-section-a-q1-q2-q3: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Section A = Q1,Q2,Q3 in all 12 exams');
