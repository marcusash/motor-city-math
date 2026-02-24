// gp-1224-feedback-wrong-min-20-chars.test.js
// feedback_wrong must be at least 20 characters (meaningful guidance).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fw = (q.feedback_wrong || '').trim();
    if (fw.length >= 20) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' feedback_wrong=' + fw.length + ' chars'); }
  }
}
console.log('gp-1224-feedback-wrong-min-20-chars: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' feedback_wrong strings are >= 20 characters');
