// gp-no-duplicate-question-ids-across-exams.test.js — question IDs must be unique across all 11 exams

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const idMap = {}; // id -> file

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.id) continue;
    if (idMap[q.id]) {
      fail++;
      failures.push(`Duplicate id="${q.id}" in ${file} AND ${idMap[q.id]}`);
    } else {
      idMap[q.id] = file;
      pass++;
    }
  }
}

console.log(`gp-no-duplicate-question-ids-across-exams: ${pass} unique, ${fail} duplicates`);
if (failures.length) {
  failures.slice(0, 5).forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} question IDs are unique across all 11 exams`);
