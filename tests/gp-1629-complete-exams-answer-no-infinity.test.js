// gp-1629-complete-exams-answer-no-infinity.test.js
// No numeric answer should be Infinity or NaN.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (typeof inp.answer !== 'number') continue;
      if (isFinite(inp.answer)) pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ':' + inp.id + ' answer=' + inp.answer); }
    }
  }
}
console.log('gp-1629-answers-no-infinity: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all numeric answers are finite (' + pass + ' checked)');
