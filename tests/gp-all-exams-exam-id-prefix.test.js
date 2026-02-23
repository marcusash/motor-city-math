// gp-all-exams-exam-id-prefix.test.js — exam_id must start with retake-practice-

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const PREFIX = 'retake-practice-';
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (!data.exam_id || !String(data.exam_id).startsWith(PREFIX)) {
    fail++;
    failures.push(`${file}: exam_id="${data.exam_id}" doesn't start with "${PREFIX}"`);
  } else { pass++; }
}

console.log(`gp-all-exams-exam-id-prefix: ${pass} pass, ${fail} invalid`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have exam_id starting with "${PREFIX}"`);
