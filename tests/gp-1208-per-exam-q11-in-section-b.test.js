// gp-1208-per-exam-q11-in-section-b.test.js
// Q11 (index 10) must be in section B for every exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q11 = data.questions[10];
  if (q11 && q11.section === 'B') pass++;
  else { fail++; failures.push(file + ': Q11 section=' + q11?.section); }
}
console.log('gp-1208-per-exam-q11-in-section-b: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' Q11 questions are in Section B');
