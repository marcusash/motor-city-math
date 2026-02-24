// gp-1558-complete-exams-question-ids-unique.test.js
// All question IDs within each complete exam must be unique.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const ids = data.questions.map(q => q.id);
  const unique = new Set(ids).size;
  if (unique === ids.length) pass++;
  else { fail++; failures.push(data.exam_id + ': ' + ids.length + ' questions, ' + unique + ' unique IDs'); }
}
console.log('gp-1558-question-ids-unique: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all question IDs unique in all ' + pass + ' complete exams');
