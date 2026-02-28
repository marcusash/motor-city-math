// gp-inputs-no-duplicate-ids-per-question.test.js — no two inputs in the same question should share an ID

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
    const ids = (q.inputs || []).map(i => i.id);
    const unique = new Set(ids);
    if (unique.size !== ids.length) {
      fail++;
      const dupes = ids.filter((id, idx) => ids.indexOf(id) !== idx);
      issues.push(`${file}: Q${q.id} has duplicate input IDs: ${[...new Set(dupes)].join(', ')}`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-inputs-no-duplicate-ids-per-question: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} questions have no duplicate input IDs`);
