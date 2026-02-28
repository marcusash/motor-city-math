// gp-1377-no-duplicate-question-ids-within-exam.test.js
// Within a single exam, no two questions should share the same id.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const ids = data.questions.map(q => q.id);
  const unique = new Set(ids);
  if (unique.size === ids.length) pass++;
  else { fail++; failures.push(file + ': ' + (ids.length - unique.size) + ' duplicate question ids'); }
}
console.log('gp-1377-no-dup-question-ids-within-exam: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have unique question ids');
