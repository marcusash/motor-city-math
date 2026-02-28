// gp-2091-complete-exams-section-c-standards-snapshot.test.js
// Section C standards must be within {W2.c, W2.e} in all exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID_C = new Set(['W2.c','W2.e']);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions.filter(q => q.section === 'C')) {
    if (VALID_C.has(q.standard)) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' section_C standard=' + q.standard); }
  }
}
console.log('gp-2091-section-c-standards: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all Section C questions have standards in {W2.c, W2.e}');
