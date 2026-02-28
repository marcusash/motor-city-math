// gp-1218-per-exam-graphs-exactly-2.test.js
// Each exam must have exactly 2 graph questions (Q12 and Q13).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const n = data.questions.filter(q => q.graph).length;
  if (n === 2) pass++;
  else { fail++; failures.push(file + ': ' + n + ' graphs (expected 2)'); }
}
console.log('gp-1218-per-exam-graphs-exactly-2: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have exactly 2 graph questions');
