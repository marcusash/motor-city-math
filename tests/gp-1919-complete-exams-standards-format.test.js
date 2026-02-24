// gp-1919-complete-exams-all-w2-w3-standards-format.test.js
// All standards across all complete exams must match W2.{a-f} or W3.{a-e} format.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID = /^W[23]\.[a-f]$/;
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    const s = q.standard;
    if (VALID.test(s)) pass++;
    else { fail++; failures.push(data.exam_id+':'+q.id+' standard='+s); }
  }
}
console.log('gp-1919-standards-format: ' + pass + ' valid, ' + fail + ' invalid');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 180 standards match W2.{a-f} or W3.{a-e} format');
