// gp-1494-all-questions-have-standard.test.js
// Every question must have a standard field.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (q.standard && typeof q.standard === 'string') pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' missing standard'); }
  }
}
console.log('gp-1494-all-have-standard: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 165 questions have a standard');
