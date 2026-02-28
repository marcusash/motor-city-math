// gp-1512-rp12-all-questions-have-hint.test.js
// All 15 RP12 questions must have a non-empty hint.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-12.json'), 'utf8'));
let pass = 0, fail = 0; const failures = [];
for (const q of data.questions) {
  if (q.hint && q.hint.length >= 10) pass++;
  else { fail++; failures.push(q.id + ': hint length=' + (q.hint ? q.hint.length : 0)); }
}
console.log('gp-1512-rp12-hints: ' + pass + '/15 pass');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 15 RP12 questions have valid hints');
