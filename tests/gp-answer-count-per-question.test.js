// gp-answer-count-per-question.test.js — verify each question has at least 1 answerable input

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
    const inputs = q.inputs || [];
    const answerable = inputs.filter(inp => inp.answer !== undefined && inp.answer !== null);
    if (inputs.length > 0 && answerable.length === 0) {
      fail++;
      failures.push(`${file}: Q${q.id} has ${inputs.length} inputs but 0 with answer key`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-answer-count-per-question: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.slice(0, 5).forEach(f => console.log('  FAIL:', f));
  if (fail > 5) console.log(`  ... and ${fail - 5} more`);
  process.exit(1);
}
console.log(`OK — all ${pass} questions have at least one answerable input`);
