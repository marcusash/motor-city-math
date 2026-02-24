// gp-1841-complete-exams-all-exams-have-title.test.js
// All exam files must have a non-empty title field.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (typeof data.title === 'string' && data.title.trim().length >= 5) pass++;
  else { fail++; failures.push(file + ' title=' + JSON.stringify(data.title)); }
}
console.log('gp-1841-all-exams-have-title: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all exams have non-empty titles (' + pass + ' exams)');
