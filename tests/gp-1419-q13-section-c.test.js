// gp-1419-q13-section-c.test.js
// Q13 (index 12) must always be in Section C.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q13 = data.questions[12];
  if (q13 && q13.section === 'C') pass++;
  else { fail++; failures.push(file + ': Q13 section=' + (q13 ? q13.section : 'missing')); }
}
console.log('gp-1419-q13-section-c: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have Q13 in section C');
