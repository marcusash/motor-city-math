// gp-1573-complete-exams-number-field.test.js
// Every question must have a 'number' field matching its 1-based index.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (let i = 0; i < 15; i++) {
    const q = data.questions[i];
    if (q.number === i + 1) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' number=' + q.number + ' expected ' + (i+1)); }
  }
}
console.log('gp-1573-number-field: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all question numbers match 1-based index (' + pass + ' checked)');
