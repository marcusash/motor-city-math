// gp-all-questions-have-inputs.test.js — every question should have at least 1 input to answer

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const inputs = q.inputs || [];
    if (inputs.length === 0) {
      fail++;
      issues.push(`${file}: Q${q.id} has no inputs — Kai can't answer this question`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-all-questions-have-inputs: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} questions have at least 1 input`);
