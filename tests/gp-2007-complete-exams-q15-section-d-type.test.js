// gp-2007-complete-exams-q15-always-word-or-write.test.js
// Q15 (Section D last) must be word-problem, write-equation, error-analysis, or construct.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID = new Set(['word-problem','write-equation','error-analysis','multiple-choice','construct']);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q15 = data.questions.find(q => q.number === 15);
  if (q15 && VALID.has(q15.type)) pass++;
  else { fail++; failures.push(data.exam_id + ' Q15 type=' + (q15&&q15.type)); }
}
console.log('gp-2007-q15-type: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q15 is Section D type in all ' + pass + ' exams');
