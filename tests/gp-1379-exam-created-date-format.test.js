// gp-1379-exam-created-date-format.test.js
// created field must be a YYYY-MM-DD date string.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.created && DATE_RE.test(data.created)) pass++;
  else { fail++; failures.push(file + ': created="' + data.created + '"'); }
}
console.log('gp-1379-exam-created-date-format: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have YYYY-MM-DD created date');
