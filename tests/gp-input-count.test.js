// gp-input-count.test.js — every question has at least 1 input
// Questions with no inputs are unanswerable and would show blank to Kai

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
    if (inputs.length === 0) {
      fail++;
      violations.push(`${file} Q${q.id || q.number}: has 0 inputs`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-input-count: ${pass}/${pass + fail} pass`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log('OK — all questions have at least 1 input');
