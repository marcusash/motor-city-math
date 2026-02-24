// gp-1529-all-12-exams-q15-word-problem.test.js
// Q15 must be word-problem in all 12 exams (universal invariant).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q15 = data.questions[14];
  if (q15 && q15.type === 'word-problem') pass++;
  else { fail++; failures.push(data.exam_id + ': Q15=' + (q15 && q15.type)); }
}
console.log('gp-1529-all-12-q15-word-problem: ' + pass + '/' + RP_FILES.length + ' pass');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q15=word-problem in all ' + pass + ' exams');
