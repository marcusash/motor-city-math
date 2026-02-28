// gp-1687-complete-exams-per-exam-steps-sum-check.test.js
// Verify sum of per-exam step locks matches total 822.

const fs = require('fs'), path = require('path');
const PER_EXAM = {1:69, 2:72, 3:71, 4:71, 5:89, 6:62, 7:70, 8:61, 9:57, 10:61, 11:65, 12:74};
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (const [rpNum, expectedTotal] of Object.entries(PER_EXAM)) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'retake-practice-' + rpNum + '.json'), 'utf8'));
  let total = 0; for (const q of data.questions) total += (q.solution_steps || []).length;
  if (total === expectedTotal) pass++;
  else { fail++; failures.push('RP' + rpNum + ': expected ' + expectedTotal + ', got ' + total); }
}
const grandTotal = Object.values(PER_EXAM).reduce((a,b) => a+b, 0);
console.log('gp-1687-per-exam-steps-sum: ' + grandTotal + ' total; ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- per-exam solution_steps all locked, grand total=' + grandTotal);
