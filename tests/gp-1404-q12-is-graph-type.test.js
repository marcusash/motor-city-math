// gp-1404-q12-is-graph-type.test.js
// Q12 (index 11, section C) must have type "graph" in all exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q12 = data.questions[11];
  if (q12 && q12.type === 'graph') pass++;
  else { fail++; failures.push(file + ': Q12 type=' + (q12 ? q12.type : 'missing')); }
}
console.log('gp-1404-q12-is-graph-type: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have Q12 type=graph');
