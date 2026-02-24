// gp-1665-complete-exams-section-b-has-exponential.test.js
// Section B must include at least one exponential question per exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const secB = data.questions.filter(q => q.section === 'B');
  const hasExp = secB.some(q => q.type === 'exponential');
  if (hasExp) pass++;
  else { fail++; failures.push(data.exam_id + ': no exponential in Section B'); }
}
console.log('gp-1665-section-b-has-exponential: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all complete exams have exponential in Section B (' + pass + ' checked)');
