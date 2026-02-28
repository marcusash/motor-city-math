// gp-1334-section-b-has-exponential-or-logarithm.test.js
// Section B in every exam must have at least one exponential or logarithm question.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const secB = data.questions.filter(q => q.section === 'B');
  const hasExpOrLog = secB.some(q => /exponential|logarithm|log/.test(q.type));
  if (hasExpOrLog) pass++;
  else { fail++; failures.push(file + ': Section B has no exponential/logarithm question'); }
}
console.log('gp-1334-section-b-exp-or-log: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have exp/log in Section B');
