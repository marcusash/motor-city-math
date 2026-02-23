// gp-question-id-uniqueness.test.js — question IDs must be unique within each exam

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
  const ids = data.questions.map(q => q.id);
  const dupes = ids.filter((id, i, arr) => arr.indexOf(id) !== i);
  if (dupes.length > 0) {
    fail++;
    failures.push(`${file}: duplicate question IDs: ${[...new Set(dupes)].join(', ')}`);
  } else {
    pass++;
  }
}

console.log(`gp-question-id-uniqueness: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have unique question IDs`);
