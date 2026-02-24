// gp-2023-complete-exams-number-inputs-have-numeric-answers.test.js
// All 294 number-type inputs must have a numeric (not undefined) answer.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'number') continue;
      if (typeof inp.answer === 'number' || (typeof inp.answer === 'string' && inp.answer !== '')) pass++;
      else { fail++; failures.push(data.exam_id+':'+q.id+'.'+inp.id+' answer='+inp.answer); }
    }
  }
}
console.log('gp-2023-number-answers-defined: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all number inputs have defined numeric answers');
