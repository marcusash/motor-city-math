// gp-1422-q4-section-b.test.js
// Q4 (index 3) must always be in Section B.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q4 = data.questions[3];
  if (q4 && q4.section === 'B') pass++;
  else { fail++; failures.push(file + ': Q4 section=' + (q4 ? q4.section : 'missing')); }
}
console.log('gp-1422-q4-section-b: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have Q4 in section B');
