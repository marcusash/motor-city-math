// gp-no-duplicate-inputs-per-question.test.js — within a question, no two inputs should share the same id

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
    const ids = inputs.map(i => i.id);
    const uniqueIds = new Set(ids);
    
    if (uniqueIds.size !== ids.length) {
      const dups = ids.filter((id, i) => ids.indexOf(id) !== i);
      fail++;
      issues.push(`${file}: Q${q.id} has duplicate input IDs: ${dups.join(', ')}`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-no-duplicate-inputs-per-question: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} questions have unique input IDs`);
