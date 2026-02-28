// gp-1547-complete-exams-count.test.js
// Lock the count of complete exams (15 questions, standard sections).
// Currently 12 complete exams (RP13 is incomplete, excluded).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID_SECTIONS = new Set(['A','B','C','D']);
let complete = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const qCount = data.questions.length;
  const sections = new Set(data.questions.map(q => q.section));
  const allValid = [...sections].every(s => VALID_SECTIONS.has(s));
  if (qCount === 15 && allValid) complete++;
}
console.log('gp-1547-complete-exam-count: ' + complete + ' complete exams');
console.log(complete >= 12 ? 'OK -- ' + complete + ' complete exams (>=12 baseline)' : 'FAIL: expected >=12, got ' + complete);
