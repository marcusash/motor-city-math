// gp-1822-complete-exams-exam-id-matches-filename.test.js
// exam_id must match the file name pattern (e.g. retake-practice-1.json -> retake-practice-1).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const expected = file.replace('.json', '');
  if (data.exam_id === expected) pass++;
  else { fail++; failures.push(file + ' exam_id=' + data.exam_id + ' expected=' + expected); }
}
console.log('gp-1822-exam-id-matches-filename: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all exam_ids match filenames (' + pass + ' exams)');
