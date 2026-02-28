// gp-1391-hint-min-length.test.js
// All hints must be at least 10 characters (non-trivial).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (q.hint && q.hint.length >= 10) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' hint length=' + (q.hint || '').length); }
  }
}
console.log('gp-1391-hint-min-length: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' hints have min 10 chars');
