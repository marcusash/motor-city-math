// gp-1858-complete-exams-all-input-ids-no-spaces.test.js
// No input IDs should contain spaces.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const inp of (q.inputs||[])) {
      if (!/\s/.test(inp.id)) pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ':' + inp.id + ' has space'); }
    }
  }
}
console.log('gp-1858-input-ids-no-spaces: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- no input IDs contain spaces (' + pass + ' inputs)');
