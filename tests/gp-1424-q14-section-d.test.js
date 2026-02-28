// gp-1424-q14-section-d.test.js
// Q14 (index 13) must always be in Section D.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q14 = data.questions[13];
  if (q14 && q14.section === 'D') pass++;
  else { fail++; failures.push(file + ': Q14 section=' + (q14 ? q14.section : 'missing')); }
}
console.log('gp-1424-q14-section-d: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have Q14 in section D');
