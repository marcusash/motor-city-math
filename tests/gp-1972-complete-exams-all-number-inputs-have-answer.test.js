// gp-1972-complete-exams-all-number-inputs-have-answer.test.js
// All number-type inputs must have a numeric answer (not undefined, not null, not string).
// KNOWN EXCEPTION: q10_x1 inputs have negative answers (advisory, not bugs).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) for (const inp of (q.inputs||[])) {
    if (inp.type !== 'number') continue;
    if (typeof inp.answer === 'number') pass++;
    else { fail++; failures.push(data.exam_id+':'+q.id+':'+inp.id+' answer='+inp.answer); }
  }
}
console.log('gp-1972-number-inputs-have-answer: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' number inputs have numeric answer');
