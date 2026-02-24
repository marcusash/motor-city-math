// gp-1309-section-d-starts-at-index-13.test.js
// The first Section D question must be at index 13 in all exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q = data.questions[13];
  if (q && q.section === 'D') pass++;
  else { fail++; failures.push(file + ': index 13 section=' + (q ? q.section : 'missing')); }
}
console.log('gp-1309-section-d-starts-index-13: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have Section D starting at index 13');
