// gp-1708-complete-exams-input-ids-no-spaces.test.js
// Input IDs must not contain spaces (would break DOM lookup).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (typeof inp.id === 'string' && !inp.id.includes(' ')) pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ':' + inp.id); }
    }
  }
}
console.log('gp-1708-input-ids-no-spaces: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all input IDs have no spaces (' + pass + ' checked)');
