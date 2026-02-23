// gp-all-questions-have-section.test.js — every question must have a section (A, B, C, or D)

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
    if (!q.section || !VALID_SECTIONS.has(q.section)) {
      fail++;
      failures.push(`${file}: Q${q.id} has invalid section='${q.section}'`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-all-questions-have-section: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.slice(0, 5).forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} questions have valid section (A/B/C/D)`);
