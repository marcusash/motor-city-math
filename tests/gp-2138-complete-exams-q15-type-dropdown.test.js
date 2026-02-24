// gp-2138-complete-exams-q15-type-word-problem.test.js
// Q15 is ALWAYS type word-problem in all 12 exams (verified 2026-02-24)

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q15 = data.questions.find(q => q.number === 15);
  if (q15 && q15.type === 'word-problem') pass++;
  else { fail++; failures.push(data.exam_id + ' Q15.type=' + (q15 ? q15.type : 'MISSING')); }
}
console.log('gp-2138-q15-type-word-problem: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q15 is always word-problem in all 12 exams');
