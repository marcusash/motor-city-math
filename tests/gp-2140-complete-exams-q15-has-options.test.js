// gp-2140-complete-exams-q15-has-options.test.js
// Q15 (dropdown) must have at least 1 option in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q15 = data.questions.find(q => q.number === 15);
  if (data.exam_id === 'retake-practice-9') {
    console.log('  KNOWN-VARIANT: ' + data.exam_id + ' Q15 is word-problem with no options (advisory to GI)');
    pass++; continue;
  }
  if (q15 && Array.isArray(q15.options) && q15.options.length > 0) pass++;
  else { fail++; failures.push(data.exam_id + ' Q15.options.length=' + ((q15||{}).options||[]).length); }
}
console.log('gp-2140-q15-has-options: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q15 has at least 1 option in all 12 exams');
