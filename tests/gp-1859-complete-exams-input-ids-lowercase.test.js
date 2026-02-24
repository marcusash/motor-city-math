// gp-1859-complete-exams-all-input-ids-lowercase.test.js
// All input IDs should be lowercase (no uppercase letters).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const inp of (q.inputs||[])) {
      if (inp.id === inp.id.toLowerCase()) pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ':' + inp.id + ' has uppercase'); }
    }
  }
}
console.log('gp-1859-input-ids-lowercase: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all input IDs are lowercase (' + pass + ' inputs)');
