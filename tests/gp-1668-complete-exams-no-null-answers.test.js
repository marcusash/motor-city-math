// gp-1668-complete-exams-no-null-answers.test.js
// No numeric or dropdown input should have a null answer.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type === 'text') continue; // text inputs have no answer
      if (inp.answer !== null && inp.answer !== undefined) pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ':' + inp.id + ' null answer'); }
    }
  }
}
console.log('gp-1668-no-null-answers: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- no null answers in number/dropdown/radio inputs (' + pass + ' checked)');
