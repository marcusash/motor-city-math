// gp-1856-complete-exams-all-w2-subletter-valid.test.js
// All W2 standards must have a valid subletter (a-f).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID_W2 = new Set(['W2.a','W2.b','W2.c','W2.d','W2.e','W2.f']);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.standard.startsWith('W2.')) continue;
    if (VALID_W2.has(q.standard)) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' standard=' + q.standard); }
  }
}
console.log('gp-1856-w2-subletter-valid: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all W2 standards have valid subletter a-f (' + pass + ' questions)');
