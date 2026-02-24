// gp-1368-text-inputs-no-answer-field.test.js
// Text inputs should NOT have an answer field (they are open-response).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'text') continue;
      if (!('answer' in inp)) pass++;
      else { fail++; failures.push(file + ': ' + q.id + ' ' + inp.id + ' text input has answer field'); }
    }
  }
}
console.log('gp-1368-text-inputs-no-answer: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' text inputs have no answer field (correct for open-response)');
