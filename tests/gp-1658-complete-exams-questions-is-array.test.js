// gp-1658-complete-exams-questions-is-array.test.js
// The top-level 'questions' field must be an array in all exam files.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (Array.isArray(data.questions)) pass++;
  else { fail++; failures.push(file + ': questions is not array'); }
}
console.log('gp-1658-questions-is-array: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- questions is array in all ' + pass + ' exam files');
