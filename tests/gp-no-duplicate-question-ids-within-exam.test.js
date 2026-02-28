// gp-no-duplicate-question-ids-within-exam.test.js — question IDs must be unique within each exam

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
  const unique = new Set(ids);
  if (unique.size !== ids.length) {
    fail++;
    const dups = ids.filter((id, i) => ids.indexOf(id) !== i);
    failures.push(`${file}: duplicate question IDs: ${dups.join(', ')}`);
  } else {
    pass++;
  }
}

console.log(`gp-no-duplicate-question-ids-within-exam: ${pass} pass, ${fail} with duplicates`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have unique question IDs`);
