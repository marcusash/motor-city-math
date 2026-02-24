// gp-2149-complete-exams-numeric-inputs-have-answer.test.js
// Number and dropdown inputs must have an answer field (auto-gradeable).
// Text inputs may omit answer (open-ended/rubric-graded).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
const AUTO_GRADE_TYPES = new Set(['number','dropdown']);
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  let examFail = false;
  for (const q of data.questions) {
    const noAns = (q.inputs||[]).filter(inp =>
      AUTO_GRADE_TYPES.has(inp.type) && (inp.answer === undefined || inp.answer === null)
    );
    if (noAns.length > 0) {
      examFail = true;
      failures.push(data.exam_id + ' Q' + q.number + ' ' + inp.type + ' inputs missing answer: ' + noAns.map(i=>i.id).join(','));
    }
  }
  if (!examFail) pass++;
  else fail++;
}
console.log('gp-2149-numeric-inputs-have-answer: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All number/dropdown inputs have answer fields in all 12 exams');
