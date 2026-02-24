// gp-1303-q1-always-section-a-index-0.test.js
// Q1 must always be at index 0 and in Section A.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q = data.questions[0];
  if (q && q.section === 'A') pass++;
  else { fail++; failures.push(file + ': index 0 section=' + (q ? q.section : 'missing')); }
}
console.log('gp-1303-q1-index-0-section-a: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have index-0 question in Section A');
