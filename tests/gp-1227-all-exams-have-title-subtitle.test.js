// gp-1227-all-exams-have-title-subtitle.test.js
// All exams must have non-empty title and subtitle.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if ((data.title || '').trim().length > 0 && (data.subtitle || '').trim().length > 0) pass++;
  else { fail++; failures.push(file + ': missing title or subtitle'); }
}
console.log('gp-1227-all-exams-have-title-subtitle: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have title and subtitle');
