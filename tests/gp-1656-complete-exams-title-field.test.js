// gp-1656-complete-exams-title-field.test.js
// All complete exams must have a non-empty top-level 'title' field.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  if (data.title && typeof data.title === 'string' && data.title.trim().length > 0) pass++;
  else { fail++; failures.push(file + ': title missing/empty'); }
}
console.log('gp-1656-title-field: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all complete exams have non-empty title (' + pass + ' checked)');
