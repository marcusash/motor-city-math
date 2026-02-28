// gp-1722-complete-exams-no-duplicate-q-ids-cross-exam.test.js
// Question IDs must be globally unique across all complete exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const seen = new Map(); let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!seen.has(q.id)) { seen.set(q.id, data.exam_id); pass++; }
    else { fail++; failures.push(q.id + ' duplicate in ' + data.exam_id + ' and ' + seen.get(q.id)); }
  }
}
console.log('gp-1722-global-q-id-unique: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 180 question IDs globally unique (' + pass + ' checked)');
