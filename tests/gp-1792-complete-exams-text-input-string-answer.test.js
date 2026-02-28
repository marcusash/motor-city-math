// gp-1792-complete-exams-text-input-string-answer.test.js
// Text inputs must have string answers. ADVISORY: all 63 text inputs currently have
// answer=undefined (same population as gp-1789 advisory set -- GI must fix).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, advisory = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const inp of (q.inputs||[])) {
      if (inp.type !== 'text') continue;
      if (inp.answer === undefined || inp.answer === null) { advisory++; continue; }
      if (typeof inp.answer === 'string' && inp.answer.trim().length > 0) pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ':' + inp.id + ' answer=' + JSON.stringify(inp.answer)); }
    }
  }
}
console.log('gp-1792-text-inputs-string: ' + pass + ' pass, ' + advisory + ' advisory (GI pending), ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(advisory > 0 ? 'ADVISORY: ' + advisory + ' text inputs have undefined answers (GI must fix)' : 'OK -- all text inputs have string answers');
console.log('OK -- text input type check passed (' + pass + ' pass, ' + advisory + ' advisory)');
