// gp-1157-question-id-matches-position.test.js
// Question ID rp{N}-q{M} must match question's position (index+1) in the exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const examNum = file.match(/retake-practice-(\d+)/)[1];
  data.questions.forEach((q, idx) => {
    const expected = 'rp' + examNum + '-q' + (idx + 1);
    if (q.id === expected) pass++;
    else { fail++; failures.push(file + ': index ' + idx + ' id=' + q.id + ' (expected ' + expected + ')'); }
  });
}
console.log('gp-1157-question-id-matches-position: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' question IDs match their exam number and position');
