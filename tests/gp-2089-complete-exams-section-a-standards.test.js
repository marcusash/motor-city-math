// gp-2089-complete-exams-section-a-standards-snapshot.test.js
// Section A standards must be within {W2.a, W2.b, W3.a} in all exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID_A = new Set(['W2.a','W2.b','W3.a']);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions.filter(q => q.section === 'A')) {
    if (VALID_A.has(q.standard)) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' section_A standard=' + q.standard); }
  }
}
console.log('gp-2089-section-a-standards: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all Section A questions have standards in {W2.a, W2.b, W3.a}');
