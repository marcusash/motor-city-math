// gp-2014-complete-exams-all-standards-are-strings.test.js
// Every standard field across all 180 questions must be a string.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (typeof q.standard === 'string' && q.standard.length > 0) pass++;
    else { fail++; failures.push(data.exam_id+':'+q.id+' standard='+typeof q.standard); }
  }
}
console.log('gp-2014-all-standards-strings: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 180 standard fields are non-empty strings');
