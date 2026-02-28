// gp-1857-complete-exams-all-w3-subletter-valid.test.js
// All W3 standards must have a valid subletter (a-e).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID_W3 = new Set(['W3.a','W3.b','W3.c','W3.d','W3.e']);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.standard.startsWith('W3.')) continue;
    if (VALID_W3.has(q.standard)) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' standard=' + q.standard); }
  }
}
console.log('gp-1857-w3-subletter-valid: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all W3 standards have valid subletter a-e (' + pass + ' questions)');
