// gp-1427-all-exams-have-subtitle.test.js
// Every exam must have a non-empty subtitle field.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.subtitle && data.subtitle.trim().length > 0) pass++;
  else { fail++; failures.push(file + ': missing or empty subtitle'); }
}
console.log('gp-1427-all-exams-have-subtitle: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have non-empty subtitle');
