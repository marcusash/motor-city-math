// gp-2140-complete-exams-q15-has-inputs.test.js
// Q15 (word-problem) must have at least 1 input in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q15 = data.questions.find(q => q.number === 15);
  if (q15 && Array.isArray(q15.inputs) && q15.inputs.length > 0) pass++;
  else { fail++; failures.push(data.exam_id + ' Q15.inputs.length=' + ((q15||{}).inputs||[]).length); }
}
console.log('gp-2140-q15-has-inputs: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q15 word-problem has inputs in all 12 exams');
