// gp-1423-q11-section-b.test.js
// Q11 (index 10) must always be in Section B (last B question).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q11 = data.questions[10];
  if (q11 && q11.section === 'B') pass++;
  else { fail++; failures.push(file + ': Q11 section=' + (q11 ? q11.section : 'missing')); }
}
console.log('gp-1423-q11-section-b: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have Q11 in section B');
