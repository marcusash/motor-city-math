// gp-1502-all-inputs-have-id.test.js
// Every input must have an id field (already verified per-exam unique, but double-check presence).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.id && typeof inp.id === 'string') pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ' input missing id'); }
    }
  }
}
console.log('gp-1502-inputs-have-id: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0, 5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' inputs have an id field');
