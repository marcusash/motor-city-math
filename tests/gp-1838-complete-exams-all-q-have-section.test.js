// gp-1838-complete-exams-all-q-have-section-string.test.js
// Every question must have a section field (A, B, C, or D).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID = new Set(['A','B','C','D']);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (VALID.has(q.section)) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' section=' + JSON.stringify(q.section)); }
  }
}
console.log('gp-1838-all-q-section: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all questions have valid section (A/B/C/D) (' + pass + ' questions)');
