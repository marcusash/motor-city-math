// gp-1937-complete-exams-no-duplicate-input-ids-per-question.test.js
// Within each question, all input ids must be unique.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    const ids = (q.inputs||[]).map(i=>i.id);
    const unique = new Set(ids);
    if (unique.size === ids.length) pass++;
    else { fail++; failures.push(data.exam_id+':'+q.id+' duplicate input ids'); }
  }
}
console.log('gp-1937-no-duplicate-input-ids-per-q: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- no duplicate input ids within any question (' + pass + ' questions checked)');
