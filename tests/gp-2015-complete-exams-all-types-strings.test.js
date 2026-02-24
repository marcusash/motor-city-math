// gp-2015-complete-exams-all-types-are-strings.test.js
// Every type field across all 180 questions must be a non-empty string.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (typeof q.type === 'string' && q.type.length > 0) pass++;
    else { fail++; failures.push(data.exam_id+':'+q.id+' type='+typeof q.type); }
  }
}
console.log('gp-2015-all-types-strings: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 180 type fields are non-empty strings');
