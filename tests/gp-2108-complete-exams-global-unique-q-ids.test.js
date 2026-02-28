// gp-2108-complete-exams-no-duplicate-question-ids-across-exams.test.js
// Question IDs must be unique ACROSS all 12 exams (global uniqueness).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const seen = new Map(); let fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (seen.has(q.id)) { fail++; failures.push(q.id + ' in ' + seen.get(q.id) + ' and ' + data.exam_id); }
    else seen.set(q.id, data.exam_id);
  }
}
console.log('gp-2108-global-unique-q-ids: seen=' + seen.size + ' dups=' + fail);
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 180 question IDs are globally unique across 12 exams');
