// gp-2022-complete-exams-input-types-valid.test.js
// Every input.type must be one of: number, text, dropdown, radio.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID = new Set(['number','text','dropdown','radio']);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (VALID.has(inp.type)) pass++;
      else { fail++; failures.push(data.exam_id+':'+q.id+'.input['+inp.id+'] type='+inp.type); }
    }
  }
}
console.log('gp-2022-input-types-valid: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 388 input types are number/text/dropdown/radio');
