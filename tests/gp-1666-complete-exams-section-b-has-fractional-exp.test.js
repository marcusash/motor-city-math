// gp-1666-complete-exams-section-b-has-fractional-exp.test.js
// Section B must include at least one fractional-exp question per exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const secB = data.questions.filter(q => q.section === 'B');
  const has = secB.some(q => q.type === 'fractional-exp');
  if (has) pass++;
  else { fail++; failures.push(data.exam_id + ': no fractional-exp in Section B'); }
}
console.log('gp-1666-section-b-has-fractional-exp: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all complete exams have fractional-exp in Section B (' + pass + ' checked)');
