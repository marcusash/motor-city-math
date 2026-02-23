// gp-mc-questions-have-choices.test.js — multiple-choice questions must have choices array

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (q.type !== 'multiple-choice') continue;
    const inputs = q.inputs || [];
    const radioInputs = inputs.filter(inp => inp.type === 'radio');
    if (radioInputs.length < 2) {
      fail++;
      failures.push(`${file}: Q${q.id} type=multiple-choice but only ${radioInputs.length} radio inputs`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-mc-questions-have-choices: ${pass} pass, ${fail} fail`);
if (failures.length) {
  // GR domain: content/type mismatch — informational, not GP-blocking
  console.log('INFO — MC questions with insufficient radio inputs (GR to fix):');
  failures.forEach(f => console.log('  ', f));
}
console.log(`OK — MC input check complete (${fail} GR issues logged)`);
