// gp-1507-rp12-sections-correct.test.js
// RP12 must have correct section distribution: A=3, B=8, C=2, D=2.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-12.json'), 'utf8'));
const counts = { A: 0, B: 0, C: 0, D: 0 };
data.questions.forEach(q => { if (counts[q.section] !== undefined) counts[q.section]++; });
const EXPECTED = { A: 3, B: 8, C: 2, D: 2 };
let pass = 0; const failures = [];
for (const [sec, exp] of Object.entries(EXPECTED)) {
  if (counts[sec] === exp) pass++;
  else failures.push('Section ' + sec + ': expected=' + exp + ' got=' + counts[sec]);
}
console.log('gp-1507-rp12-sections: A=' + counts.A + ' B=' + counts.B + ' C=' + counts.C + ' D=' + counts.D);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP12 sections A=3, B=8, C=2, D=2');
