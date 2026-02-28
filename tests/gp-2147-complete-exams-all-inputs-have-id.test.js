// gp-2147-complete-exams-all-inputs-have-id.test.js
// Every input must have a non-empty id field in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  let examFail = false;
  for (const q of data.questions) {
    const noId = (q.inputs||[]).filter(inp => !inp.id || typeof inp.id !== 'string' || inp.id.trim() === '');
    if (noId.length > 0) { examFail = true; failures.push(data.exam_id + ' Q' + q.number + ' input missing id'); }
  }
  if (!examFail) pass++;
  else fail++;
}
console.log('gp-2147-all-inputs-have-id: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All inputs have non-empty id in all 12 exams');
