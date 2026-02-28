// gp-1421-q1-section-a.test.js
// Q1 (index 0) must always be in Section A.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q1 = data.questions[0];
  if (q1 && q1.section === 'A') pass++;
  else { fail++; failures.push(file + ': Q1 section=' + (q1 ? q1.section : 'missing')); }
}
console.log('gp-1421-q1-section-a: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have Q1 in section A');
