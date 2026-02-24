// gp-1493-all-questions-have-hint.test.js
// Every question must have a hint field.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (q.hint && typeof q.hint === 'string') pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' missing/invalid hint'); }
  }
}
console.log('gp-1493-all-have-hint: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 165 questions have a hint');
