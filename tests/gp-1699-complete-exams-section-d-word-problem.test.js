// gp-1699-complete-exams-section-d-word-problem.test.js
// Section D must contain at least one word-problem type (Q15 is always word-problem).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const secD = data.questions.filter(q => q.section === 'D');
  const hasWP = secD.some(q => q.type === 'word-problem');
  if (hasWP) pass++;
  else { fail++; failures.push(data.exam_id + ': Section D has no word-problem (' + secD.map(q=>q.type).join(',') + ')'); }
}
console.log('gp-1699-section-d-word-problem: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all complete exams have word-problem in Section D (' + pass + ' checked)');
