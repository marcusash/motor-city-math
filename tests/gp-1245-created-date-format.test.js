// gp-1245-created-date-format.test.js
// created field must be a valid YYYY-MM-DD date string in all exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const d = data.created || '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(Date.parse(d))) pass++;
  else { fail++; failures.push(file + ': created=' + d); }
}
console.log('gp-1245-created-date-format: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have valid YYYY-MM-DD created date');
