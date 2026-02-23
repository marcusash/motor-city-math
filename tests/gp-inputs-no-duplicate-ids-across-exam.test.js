// gp-inputs-no-duplicate-ids-across-exam.test.js — input IDs should be unique across all questions in one exam

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
  const allIds = [];
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      allIds.push(inp.id);
    }
  }
  const dupes = allIds.filter((id, i) => allIds.indexOf(id) !== i);
  if (dupes.length > 0) {
    fail++;
    failures.push(`${file}: duplicate input IDs: ${[...new Set(dupes)].join(', ')}`);
  } else {
    pass++;
  }
}

console.log(`gp-inputs-no-duplicate-ids-across-exam: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have unique input IDs`);
