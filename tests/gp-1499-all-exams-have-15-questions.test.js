// gp-1499-all-exams-have-15-questions.test.js
// Every exam must have exactly 15 questions (triple-check).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length === 15) pass++;
  else { fail++; failures.push(data.exam_id + ': ' + data.questions.length + ' questions'); }
}
console.log('gp-1499-all-have-15-questions: ' + pass + '/11 pass');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 11 exams have exactly 15 questions');
