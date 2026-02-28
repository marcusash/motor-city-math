// gp-2183-complete-exams-no-duplicate-input-ids-within-question.test.js
// Input IDs must be unique within each question in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  let examFail = false;
  for (const q of data.questions) {
    const ids = (q.inputs||[]).map(i=>i.id);
    const dups = ids.filter((id,i) => ids.indexOf(id) !== i);
    if (dups.length > 0) { examFail = true; failures.push(data.exam_id + ' Q' + q.number + ' dup input ids: ' + dups.join(',')); }
  }
  if (!examFail) pass++;
  else fail++;
}
console.log('gp-2183-no-dup-input-ids: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- No duplicate input IDs within any question');
