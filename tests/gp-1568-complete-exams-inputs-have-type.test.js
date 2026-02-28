// gp-1568-complete-exams-inputs-have-type.test.js
// Every input must have a valid 'type' field.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID_TYPES = new Set(['number', 'text', 'dropdown', 'radio']);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (VALID_TYPES.has(inp.type)) pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ':' + inp.id + ' type=' + inp.type); }
    }
  }
}
console.log('gp-1568-inputs-have-type: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all inputs have valid type (' + pass + ' inputs checked)');
