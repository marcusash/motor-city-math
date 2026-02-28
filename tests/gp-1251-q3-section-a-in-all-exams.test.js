// gp-1251-q3-section-a-in-all-exams.test.js
// Q3 must be in Section A (index 2) in all exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q3 = data.questions[2]; // index 2
  if (q3 && q3.section === 'A') pass++;
  else { fail++; failures.push(file + ': Q3 (index 2) section=' + (q3 ? q3.section : 'missing')); }
}
console.log('gp-1251-q3-section-a: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have Q3 in Section A');
