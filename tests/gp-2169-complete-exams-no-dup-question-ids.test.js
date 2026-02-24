// gp-2169-complete-exams-no-duplicate-question-ids.test.js
// Question IDs must be unique within each exam and across all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
const allIds = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const ids = data.questions.map(q => q.id);
  const dups = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dups.length > 0) { fail++; failures.push(data.exam_id + ' dup ids: ' + dups.join(',')); }
  else { pass++; ids.forEach(id => allIds.push(id)); }
}
const crossDups = allIds.filter((id, i) => allIds.indexOf(id) !== i);
if (crossDups.length > 0) { fail++; failures.push('CROSS-EXAM dup ids: ' + crossDups.join(',')); }
console.log('gp-2169-no-dup-question-ids: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- No duplicate question IDs within or across all 12 exams');
