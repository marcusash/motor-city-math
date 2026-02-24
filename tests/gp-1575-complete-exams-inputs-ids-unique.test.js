// gp-1575-complete-exams-inputs-ids-unique.test.js
// All input IDs within each question must be unique.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    const ids = (q.inputs || []).map(inp => inp.id);
    const unique = new Set(ids).size;
    if (unique === ids.length) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' duplicate input IDs'); }
  }
}
console.log('gp-1575-input-ids-unique: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all input IDs unique within questions (' + pass + ' questions checked)');
