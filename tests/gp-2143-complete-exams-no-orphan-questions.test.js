// gp-2143-complete-exams-no-orphan-questions.test.js
// Every question must have a section field (A, B, C, or D) in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID_SECTIONS = new Set(['A','B','C','D']);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const orphans = data.questions.filter(q => !VALID_SECTIONS.has(q.section));
  if (orphans.length === 0) pass++;
  else { fail++; failures.push(data.exam_id + ' orphan Qs=' + orphans.map(q=>q.number).join(',')); }
}
console.log('gp-2143-no-orphan-questions: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All questions have valid sections in all 12 exams');
