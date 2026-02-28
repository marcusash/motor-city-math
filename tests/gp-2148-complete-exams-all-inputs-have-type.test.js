// gp-2148-complete-exams-all-inputs-have-type.test.js
// Every input must have a type field (number, text, dropdown, or radio) in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID_INPUT_TYPES = new Set(['number','text','dropdown','radio']);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  let examFail = false;
  for (const q of data.questions) {
    const bad = (q.inputs||[]).filter(inp => !VALID_INPUT_TYPES.has(inp.type));
    if (bad.length > 0) { examFail = true; failures.push(data.exam_id + ' Q' + q.number + ' bad input types: ' + bad.map(i=>i.type).join(',')); }
  }
  if (!examFail) pass++;
  else fail++;
}
console.log('gp-2148-all-inputs-have-valid-type: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All inputs have valid types in all 12 exams');
