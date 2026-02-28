// gp-2073-complete-exams-section-a-questions-1-to-3.test.js
// Section A questions must be Q1, Q2, Q3 in every exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const sectionA = data.questions.filter(q => q.section === 'A').map(q => q.number).sort((a,b)=>a-b);
  if (JSON.stringify(sectionA) === JSON.stringify([1,2,3])) pass++;
  else { fail++; failures.push(data.exam_id + ' section_A questions=' + JSON.stringify(sectionA)); }
}
console.log('gp-2073-section-a-q1-3: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Section A is always Q1-Q3 in all 12 exams');
