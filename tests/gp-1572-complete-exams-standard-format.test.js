// gp-1572-complete-exams-standard-format.test.js
// Every question standard must match pattern W[0-9].[a-z] (e.g. W2.a, W3.c).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const STD_RE = /^W\d\.[a-z]$/;
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (q.standard && STD_RE.test(q.standard)) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' standard=' + q.standard); }
  }
}
console.log('gp-1572-standard-format: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all question standards match W{N}.{x} format (' + pass + ' checked)');
