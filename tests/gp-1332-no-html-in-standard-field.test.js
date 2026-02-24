// gp-1332-no-html-in-standard-field.test.js
// Standard field must not contain HTML characters.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (/<|>|&/.test(q.standard || '')) { fail++; failures.push(file + ': ' + q.id + ' standard has HTML'); }
    else pass++;
  }
}
console.log('gp-1332-standard-no-html: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' standards have no HTML characters');
