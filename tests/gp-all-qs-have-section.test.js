// gp-all-qs-have-section.test.js — every question must have a valid section (A, B, C, or D)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const VALID_SECTIONS = new Set(['A', 'B', 'C', 'D']);

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (VALID_SECTIONS.has(q.section)) {
      pass++;
    } else {
      fail++;
      issues.push(`${file}: Q${q.id} section='${q.section}' (expected A/B/C/D)`);
    }
  }
}

console.log(`gp-all-qs-have-section: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} questions have valid section (A/B/C/D)`);
