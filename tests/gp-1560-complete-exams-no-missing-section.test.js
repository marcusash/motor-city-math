// gp-1560-complete-exams-no-missing-section.test.js
// Every question in every complete exam must have a valid 'section' field.

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
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' section=' + q.section); }
  }
}
console.log('gp-1560-no-missing-section: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all questions have valid section (A/B/C/D) (' + pass + ' checked)');
