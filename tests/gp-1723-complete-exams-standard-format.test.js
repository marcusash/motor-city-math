// gp-1723-complete-exams-standard-format-valid.test.js
// All standard values must match W[23]\.[a-e] format.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const RE = /^W[23]\.[a-e]$/;
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (RE.test(q.standard)) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' standard=' + q.standard); }
  }
}
console.log('gp-1723-standard-format: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all standards match W[23].[a-e] format (' + pass + ' checked)');
