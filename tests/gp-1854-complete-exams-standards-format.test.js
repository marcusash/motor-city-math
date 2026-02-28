// gp-1854-complete-exams-all-standards-format-W.test.js
// All question standards must start with 'W' (Winter standard format).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (/^W\d+\.[a-z]$/.test(q.standard)) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' standard=' + q.standard); }
  }
}
console.log('gp-1854-standards-format: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all standards match W{N}.{letter} format (' + pass + ' questions)');
