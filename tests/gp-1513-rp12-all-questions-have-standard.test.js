// gp-1513-rp12-all-questions-have-standard.test.js
// All 15 RP12 questions must have a valid standard.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-12.json'), 'utf8'));
const VALID = new Set(['W2.a','W2.b','W2.c','W2.d','W2.e','W3.a','W3.b','W3.c','W3.d','W3.e']);
let pass = 0, fail = 0; const failures = [];
for (const q of data.questions) {
  if (VALID.has(q.standard)) pass++;
  else { fail++; failures.push(q.id + ': standard=' + q.standard); }
}
console.log('gp-1513-rp12-standards: ' + pass + '/15 pass');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 15 RP12 questions have valid standard');
