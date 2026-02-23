// gp-no-duplicate-question-ids-across-same-exam.test.js — extended check: question IDs unique within exam, verbose

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const idCounts = {};
  for (const q of data.questions) {
    idCounts[q.id] = (idCounts[q.id] || 0) + 1;
  }
  for (const [id, count] of Object.entries(idCounts)) {
    if (count > 1) {
      fail++;
      failures.push(`${file}: "${id}" appears ${count} times`);
    } else { pass++; }
  }
}

console.log(`gp-no-duplicate-question-ids-across-same-exam: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} question IDs are unique within their exam`);
