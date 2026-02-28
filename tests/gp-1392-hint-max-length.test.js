// gp-1392-hint-max-length.test.js
// All hints must be at most 500 characters (ADHD constraint).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if ((q.hint || '').length <= 500) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' hint length=' + q.hint.length); }
  }
}
console.log('gp-1392-hint-max-length: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' hints are <= 500 chars (ADHD-safe)');
