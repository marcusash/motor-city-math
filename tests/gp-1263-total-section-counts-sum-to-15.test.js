// gp-1263-total-section-counts-sum-to-15.test.js
// Section counts must sum to 15 (3+8+2+2) in every exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const total = data.questions.filter(q => ['A','B','C','D'].includes(q.section)).length;
  if (total === 15) pass++;
  else { fail++; failures.push(file + ': total=' + total + ' (expected 15)'); }
}
console.log('gp-1263-section-counts-sum-to-15: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have section counts summing to 15');
