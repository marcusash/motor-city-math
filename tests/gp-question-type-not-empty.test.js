// gp-question-type-not-empty.test.js — every question must have a non-empty type field

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
  for (const q of data.questions) {
    if (!q.type || String(q.type).trim() === '') {
      fail++;
      failures.push(`${file}: Q${q.id} missing type field`);
    } else { pass++; }
  }
}

console.log(`gp-question-type-not-empty: ${pass} pass, ${fail} missing`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} questions have non-empty type field`);
