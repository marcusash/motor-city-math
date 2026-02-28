// gp-numeric-answer-is-finite.test.js — no Infinity or NaN in numeric answers
// Infinity/NaN answers can never be matched and always mark Kai wrong

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
      if (inp.type === 'number' && inp.answer !== undefined) {
        const n = typeof inp.answer === 'string' ? parseFloat(inp.answer) : inp.answer;
        if (typeof n === 'number' && !isFinite(n)) {
          fail++;
          violations.push(`${file} Q${q.id || q.number} "${inp.label || inp.id}": answer=${inp.answer} is not finite`);
        } else {
          pass++;
        }
      }
    }
  }
}

console.log(`gp-numeric-answer-is-finite: ${pass} pass, ${fail} fail`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log('OK — all numeric answers are finite');
