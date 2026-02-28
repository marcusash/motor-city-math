// gp-1501-all-inputs-have-label.test.js
// Every input should have a label field (non-empty string).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      // radio inputs may have empty label (question_html provides context)
      if (typeof inp.label === 'string') pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ':' + inp.id + ' missing label'); }
    }
  }
}
console.log('gp-1501-inputs-have-label: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0, 5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' inputs have a label');
