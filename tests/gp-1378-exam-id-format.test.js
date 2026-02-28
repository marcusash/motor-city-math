// gp-1378-exam-id-format.test.js
// exam_id must match the pattern "retake-practice-N" where N is 1-11.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
const PATTERN = /^retake-practice-\d+$/;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.exam_id && PATTERN.test(data.exam_id)) pass++;
  else { fail++; failures.push(file + ': exam_id="' + data.exam_id + '"'); }
}
console.log('gp-1378-exam-id-format: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exam_ids match retake-practice-N format');
