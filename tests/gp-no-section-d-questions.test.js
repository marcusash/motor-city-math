// gp-no-section-d-questions.test.js — sections must be one of A, B, C, D (no other values)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const VALID_SECTIONS = new Set(['A', 'B', 'C', 'D']);

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (q.section && !VALID_SECTIONS.has(q.section)) {
      fail++;
      failures.push(`${file}: Q${q.id} has unexpected section='${q.section}' (expected A, B, C, or D)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-no-section-d-questions: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} questions are in sections A, B, C, or D`);
