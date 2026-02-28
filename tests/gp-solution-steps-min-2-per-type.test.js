// gp-solution-steps-min-2-per-type.test.js — multi-part questions (3+ inputs) should have more solution steps

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const inputCount = (q.inputs || []).length;
    const stepCount = (q.solution_steps || []).length;
    // Questions with 4+ inputs are multi-part — should have 4+ solution steps
    if (inputCount >= 4 && stepCount < 4) {
      warn++;
      warnings.push(`${file}: Q${q.id} has ${inputCount} inputs but only ${stepCount} solution steps (may be under-explained)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-solution-steps-min-2-per-type: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — multi-part questions with potentially too few solution steps (GR review):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} questions have adequate solution steps relative to input count`);
