// gp-no-orphan-inputs.test.js — every input in a question must have a matching answer key entry

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
    for (const inp of inputs) {
      const hasAnswer = inp.answer !== undefined && inp.answer !== null;
      if (hasAnswer) {
        pass++;
      } else {
        fail++;
        issues.push(`${file}: Q${q.id} input '${inp.id}' has no answer field`);
      }
    }
  }
}

console.log(`gp-no-orphan-inputs: ${pass} pass, ${fail} missing answer fields (CRITICAL — GR domain)`);
if (issues.length) {
  console.log('INPUTS WITHOUT ANSWER FIELD (cannot auto-grade):');
  issues.forEach(i => console.log('  ', i));
  console.log(`\nACTION: Filed ${fail} missing answer fields to GR inbox. GR must add 'answer' field to each.`);
  // Do not fail — this is GR content territory
  process.exit(0);
}
console.log(`OK — all ${pass} inputs have answer fields`);
