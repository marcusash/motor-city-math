// gp-1416-per-exam-word-problem-count.test.js
// Each exam must have exactly 1 word-problem question (Q15 in Section D).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const count = data.questions.filter(q => q.type === 'word-problem').length;
  if (count === 1) pass++;
  else { fail++; failures.push(file + ': word-problem count=' + count); }
}
console.log('gp-1416-word-problem-count: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have exactly 1 word-problem');
