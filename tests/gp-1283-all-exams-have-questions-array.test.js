// gp-1283-all-exams-have-questions-array.test.js
// Every exam must have a questions array.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (Array.isArray(data.questions) && data.questions.length > 0) pass++;
  else { fail++; failures.push(file + ': questions missing or empty'); }
}
console.log('gp-1283-all-exams-have-questions: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have non-empty questions array');
