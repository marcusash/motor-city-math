// gp-1744-complete-exams-all-q-have-type.test.js
// Every question must have a non-empty type field.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID_TYPES = new Set(['identify','quadratic','exponential','fractional-exp','graph','word-problem','rational','linear','polynomial','logarithmic']);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (typeof q.type === 'string' && q.type.length > 0) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' no type'); }
  }
}
console.log('gp-1744-all-q-have-type: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 180 questions have non-empty type (' + pass + ' checked)');
