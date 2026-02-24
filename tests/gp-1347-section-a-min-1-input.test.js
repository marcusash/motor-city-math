// gp-1347-section-a-min-1-input.test.js
// Section A questions must have at least 1 input.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions.filter(q => q.section === 'A')) {
    const inputCount = (q.inputs || []).length;
    if (inputCount >= 1) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' section A has ' + inputCount + ' inputs'); }
  }
}
console.log('gp-1347-section-a-min-1-input: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' section A questions have at least 1 input');
