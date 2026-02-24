// gp-1561-complete-exams-question-order-sequential.test.js
// Question IDs must follow sequential naming: rp{N}-q1 ... rp{N}-q15.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const num = file.replace('retake-practice-', '').replace('.json', '');
  const prefix = 'rp' + num + '-q';
  for (let i = 0; i < 15; i++) {
    const q = data.questions[i];
    const expected = prefix + (i + 1);
    if (q.id === expected) pass++;
    else { fail++; failures.push(data.exam_id + ': index ' + i + ' expected ' + expected + ' got ' + q.id); }
  }
}
console.log('gp-1561-question-order-sequential: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all question IDs follow rp{N}-q{M} convention in all complete exams');
