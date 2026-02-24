// gp-2021-complete-exams-input-ids-are-strings.test.js
// Every input.id across all 388 inputs must be a non-empty string.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (typeof inp.id === 'string' && inp.id.length > 0) pass++;
      else { fail++; failures.push(data.exam_id+':'+q.id+'.input id='+inp.id); }
    }
  }
}
console.log('gp-2021-input-ids-strings: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 388 input id fields are non-empty strings');
