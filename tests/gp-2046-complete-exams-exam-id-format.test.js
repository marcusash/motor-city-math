// gp-2046-complete-exams-exam-id-format.test.js
// All 12 complete exam_ids must match format rp{N} (e.g. rp1, rp12).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const PATTERN = /^rp\d+$/;
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  if (PATTERN.test(data.exam_id)) pass++;
  else { fail++; failures.push(file + ' exam_id=' + data.exam_id); }
}
console.log('gp-2046-exam-id-format: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 12 exam_ids match rp{N} format');
