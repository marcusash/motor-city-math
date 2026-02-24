// gp-2139-complete-exams-q14-has-inputs.test.js
// Q14 must have at least 1 input in all 12 exams.
// NOTE: Q14 type varies (multiple-choice/error-analysis/construct/write-equation)
// but ALL use inputs, not options. Advisory sent to GI about mc type label mismatch.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q14 = data.questions.find(q => q.number === 14);
  if (q14 && Array.isArray(q14.inputs) && q14.inputs.length > 0) pass++;
  else { fail++; failures.push(data.exam_id + ' Q14.inputs.length=' + ((q14||{}).inputs||[]).length); }
}
console.log('gp-2139-q14-has-inputs: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q14 has at least 1 input in all 12 exams');
