// gp-exam-title-not-empty.test.js — title field must be non-empty

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
  const t = (data.title || '').trim();
  if (t.length < 5) {
    fail++;
    failures.push(`${file}: title='${t}' is too short or empty`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-title-not-empty: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have valid title field`);
