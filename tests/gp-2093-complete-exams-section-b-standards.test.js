// gp-2093-complete-exams-section-b-standards-snapshot.test.js
// Section B standards must be within {W2.a, W3.b, W3.c, W3.d, W3.e} in all exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID_B = new Set(['W2.a','W3.b','W3.c','W3.d','W3.e']);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions.filter(q => q.section === 'B')) {
    if (VALID_B.has(q.standard)) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' section_B standard=' + q.standard); }
  }
}
console.log('gp-2093-section-b-standards: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all Section B questions have standards in {W2.a, W3.b, W3.c, W3.d, W3.e}');
