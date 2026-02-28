// gp-1304-q11-always-section-b-index-10.test.js
// Q11 must be at index 10 and in Section B in all exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q = data.questions[10];
  if (q && q.section === 'B') pass++;
  else { fail++; failures.push(file + ': index 10 section=' + (q ? q.section : 'missing')); }
}
console.log('gp-1304-q11-index-10-section-b: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have index-10 question in Section B');
