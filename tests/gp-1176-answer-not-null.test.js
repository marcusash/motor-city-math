// gp-1176-answer-not-null.test.js
// Input answers must not be null (undefined is allowed for text inputs without answers).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.answer === null) { fail++; failures.push(file + ': ' + q.id + ' input=' + inp.id + ' answer=null'); }
      else pass++;
    }
  }
}
console.log('gp-1176-answer-not-null: ' + pass + ' pass, ' + fail + ' null answers');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- no null answers found');
