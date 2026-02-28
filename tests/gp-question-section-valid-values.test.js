// gp-question-section-valid-values.test.js — section field must be A, B, C, or D

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
    const sec = q.section;
    if (!sec) {
      fail++;
      issues.push(`${file}: Q${q.id} missing section field`);
    } else if (!VALID_SECTIONS.has(sec)) {
      fail++;
      issues.push(`${file}: Q${q.id} section='${sec}' is not A/B/C/D`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-question-section-valid-values: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} questions have valid section values (A/B/C/D)`);
