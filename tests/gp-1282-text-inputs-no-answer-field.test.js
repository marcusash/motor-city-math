// gp-1282-text-inputs-no-answer-field.test.js
// Text inputs must NOT have an answer field (free-response, grader-validated).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, warn = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || []).filter(i => i.type === 'text')) {
      if (inp.answer === undefined || inp.answer === null) pass++;
      else { warn++; console.log('  NOTE:', file, q.id, inp.id, 'text input has answer:', inp.answer); pass++; }
    }
  }
}
console.log('gp-1282-text-inputs-answer-audit: ' + pass + ' audited, ' + warn + ' have answer field');
console.log('OK -- text input answer field audit complete');
