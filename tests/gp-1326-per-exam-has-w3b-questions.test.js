// gp-1326-per-exam-has-w3b-questions.test.js
// Every exam should have at least 1 W3.b question (most common standard).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const n = data.questions.filter(q => q.standard === 'W3.b').length;
  if (n >= 1) pass++;
  else { fail++; failures.push(file + ': 0 W3.b questions'); }
}
console.log('gp-1326-per-exam-w3b-present: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have at least 1 W3.b question');
