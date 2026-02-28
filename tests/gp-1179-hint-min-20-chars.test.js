// gp-1179-hint-min-20-chars.test.js
// Hints must be at least 20 characters (meaningful guidance, not placeholder).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const hint = (q.hint || '').trim();
    if (hint.length >= 20) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' hint too short (' + hint.length + ' chars): "' + hint + '"'); }
  }
}
console.log('gp-1179-hint-min-20-chars: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' hints are >= 20 characters');
