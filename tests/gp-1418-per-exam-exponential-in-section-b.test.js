// gp-1418-per-exam-exponential-in-section-b.test.js
// Each exam must have at least 1 exponential question in Section B.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const hasExp = data.questions.filter(q => q.section === 'B' && q.type === 'exponential').length > 0;
  if (hasExp) pass++;
  else { fail++; failures.push(file + ': no exponential in section B'); }
}
console.log('gp-1418-exponential-in-section-b: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have exponential in section B');
