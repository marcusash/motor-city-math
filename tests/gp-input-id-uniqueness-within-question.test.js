// gp-input-id-uniqueness-within-question.test.js — input IDs must be unique within each question

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
    const inputIds = inputs.map(inp => inp.id).filter(Boolean);
    const dupes = inputIds.filter((id, i, arr) => arr.indexOf(id) !== i);
    if (dupes.length > 0) {
      fail++;
      failures.push(`${file}: Q${q.id} has duplicate input IDs: ${[...new Set(dupes)].join(', ')}`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-input-id-uniqueness-within-question: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.slice(0, 5).forEach(f => console.log('  FAIL:', f));
  if (fail > 5) console.log(`  ... and ${fail - 5} more`);
  process.exit(1);
}
console.log(`OK — all ${pass} questions have unique input IDs`);
