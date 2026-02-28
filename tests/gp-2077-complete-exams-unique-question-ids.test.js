// gp-2077-complete-exams-question-ids-unique-within-exam.test.js
// Question IDs must be unique within each exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const ids = data.questions.map(q => q.id);
  const unique = new Set(ids);
  if (unique.size === ids.length) pass++;
  else { fail++; failures.push(data.exam_id + ' has ' + (ids.length - unique.size) + ' duplicate Q ids'); }
}
console.log('gp-2077-unique-question-ids: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 12 exams have unique question IDs');
