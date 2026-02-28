// gp-1567-complete-exams-inputs-have-id.test.js
// Every input in every complete exam must have an 'id' field.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.id && typeof inp.id === 'string') pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ' input missing id'); }
    }
  }
}
console.log('gp-1567-inputs-have-id: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all inputs have id field (' + pass + ' inputs checked)');
