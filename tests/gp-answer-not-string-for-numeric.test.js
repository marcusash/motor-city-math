// gp-answer-not-string-for-numeric.test.js — numeric answers are not stored as strings
// An answer of "4" (string) instead of 4 (number) breaks parseFloat comparison in grading

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();

let pass = 0;
let fail = 0;
const violations = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const questions = data.questions || [];
  for (const q of questions) {
    const inputs = q.inputs || [];
    for (const inp of inputs) {
      if (inp.type === 'number') {
        if (inp.answer !== undefined) {
          if (typeof inp.answer === 'string' && !isNaN(parseFloat(inp.answer))) {
            fail++;
            violations.push(`${file} Q${q.id || q.number} input "${inp.label || inp.id}": answer is string "${inp.answer}" — should be number`);
          } else {
            pass++;
          }
        }
      }
    }
  }
}

console.log(`gp-answer-not-string-for-numeric: ${pass} pass, ${fail} fail`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log('OK — all numeric inputs have number-typed answers');
