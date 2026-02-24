// gp-1249-no-duplicate-input-ids-within-question.test.js
// Within a single question, all input IDs must be unique.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const ids = (q.inputs || []).map(i => i.id);
    const uniq = new Set(ids);
    if (uniq.size === ids.length) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' has duplicate input IDs'); }
  }
}
console.log('gp-1249-no-dup-input-ids-in-question: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' questions have unique input IDs');
