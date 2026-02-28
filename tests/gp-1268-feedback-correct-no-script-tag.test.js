// gp-1268-feedback-correct-no-script-tag.test.js
// feedback_correct must not contain script tags.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (/<script/i.test(q.feedback_correct || '')) { fail++; failures.push(file + ': ' + q.id); }
    else pass++;
  }
}
console.log('gp-1268-feedback-correct-no-script: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- no script tags in feedback_correct');
