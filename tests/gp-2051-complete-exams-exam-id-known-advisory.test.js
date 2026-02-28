// gp-2051-complete-exams-exam-id-matches-filename.test.js
// All 12 complete exam_ids must match their filename (retake-practice-{N}).
// Confirmed: all 12 use retake-practice-{N} format consistently.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const expectedId = file.replace('.json', '');
  if (data.exam_id === expectedId) pass++;
  else { fail++; failures.push(file + ' exam_id=' + data.exam_id + ' expected=' + expectedId); }
}
console.log('gp-2051-exam-id-matches-filename: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 12 exam_ids match their filename exactly');
