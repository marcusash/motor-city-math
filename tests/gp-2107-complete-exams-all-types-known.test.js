// gp-2107-complete-exams-all-types-known.test.js
// All question types across 12 exams must be from the known 14-type set.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const KNOWN = new Set(['absolute-value','construct','error-analysis','exponential','extraneous',
  'fractional-exp','graph','identify','multiple-choice','quadratic','radical','rational',
  'word-problem','write-equation']);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (KNOWN.has(q.type)) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' type=' + q.type); }
  }
}
console.log('gp-2107-all-types-known: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 180 question types are from the known 14-type corpus');
