// gp-1307-section-b-starts-at-index-3.test.js
// The first Section B question must be at index 3 in all exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q = data.questions[3];
  if (q && q.section === 'B') pass++;
  else { fail++; failures.push(file + ': index 3 section=' + (q ? q.section : 'missing')); }
}
console.log('gp-1307-section-b-starts-index-3: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have Section B starting at index 3');
