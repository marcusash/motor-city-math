// gp-1562-complete-exams-exam-id-format.test.js
// exam_id must match pattern retake-practice-N where N matches filename.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const numFromFile = file.replace('retake-practice-', '').replace('.json', '');
  const expectedId = 'retake-practice-' + numFromFile;
  if (data.exam_id === expectedId) pass++;
  else { fail++; failures.push(file + ': expected ' + expectedId + ', got ' + data.exam_id); }
}
console.log('gp-1562-exam-id-format: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all exam_ids match filename convention');
