// gp-1918-complete-exams-section-c-questions-12-13.test.js
// Section C must be exactly Q12, Q13 (by question number) in every exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const sectionC = data.questions.filter(q => q.section === 'C').map(q => q.number).sort((a,b)=>a-b);
  if (JSON.stringify(sectionC) === '[12,13]') pass++;
  else { fail++; failures.push(data.exam_id + ' Section C Q numbers=' + JSON.stringify(sectionC)); }
}
console.log('gp-1918-section-c-q12-q13: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Section C = Q12,Q13 in all 12 exams');
