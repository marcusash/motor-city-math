// gp-1308-section-c-starts-at-index-11.test.js
// The first Section C question must be at index 11 in all exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q = data.questions[11];
  if (q && q.section === 'C') pass++;
  else { fail++; failures.push(file + ': index 11 section=' + (q ? q.section : 'missing')); }
}
console.log('gp-1308-section-c-starts-index-11: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have Section C starting at index 11');
