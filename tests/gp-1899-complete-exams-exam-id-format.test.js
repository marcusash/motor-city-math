// gp-1899-complete-exams-exam-id-format-rp-n.test.js
// All exam_ids must match pattern rp{N} or retake-practice-{N}.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID = /^(rp\d+|retake-practice-\d+)$/;
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  if (VALID.test(data.exam_id)) pass++;
  else { fail++; failures.push(file + ' exam_id=' + data.exam_id); }
}
console.log('gp-1899-exam-id-format: ' + pass + ' valid, ' + fail + ' invalid');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all exam_ids match rp{N} or retake-practice-{N} pattern (' + pass + ' exams)');
