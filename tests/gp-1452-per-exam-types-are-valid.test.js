// gp-1452-per-exam-types-are-valid.test.js
// All question types must be within the 14 valid question type values.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID_TYPES = new Set([
  'identify','graph','word-problem','exponential','radical','quadratic','rational',
  'fractional-exp','absolute-value','multiple-choice','write-equation',
  'extraneous','error-analysis','construct','logarithm'
]);
let pass = 0, fail = 0; const failures = []; const unknownTypes = new Set();
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (VALID_TYPES.has(q.type)) pass++;
    else { fail++; unknownTypes.add(q.type); failures.push(file + ': ' + q.id + ' type="' + q.type + '"'); }
  }
}
console.log('gp-1452-types-are-valid: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) {
  console.log('  Unknown types:', [...unknownTypes].join(', '));
  failures.slice(0, 5).forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log('OK -- all ' + pass + ' question types are valid');
