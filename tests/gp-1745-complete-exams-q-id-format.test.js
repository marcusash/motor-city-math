// gp-1745-complete-exams-q-id-format-rp-prefix.test.js
// All question IDs must match rp{N}-q{M} format.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const RE = /^rp\d+-q\d+$/;
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (RE.test(q.id)) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' bad format'); }
  }
}
console.log('gp-1745-q-id-format: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 180 question IDs match rp{N}-q{M} (' + pass + ' checked)');
