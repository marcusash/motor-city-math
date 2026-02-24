// gp-2078-complete-exams-numeric-answers-in-reasonable-range.test.js
// All number-type input answers must be in reasonable math range (-100000 to 100000).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
const MIN = -100000, MAX = 100000;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'number') continue;
      const val = typeof inp.answer === 'string' ? parseFloat(inp.answer) : inp.answer;
      if (typeof val === 'number' && !isNaN(val) && val >= MIN && val <= MAX) pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + '.' + inp.id + ' answer=' + inp.answer); }
    }
  }
}
console.log('gp-2078-answer-range: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all numeric answers in range [-100000, 100000]');
