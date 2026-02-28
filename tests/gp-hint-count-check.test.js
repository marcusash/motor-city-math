// gp-hint-count-check.test.js — every question must have at least 1 hint

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const hint = q.hint;
    if (hint && String(hint).trim().length > 0) {
      pass++;
    } else {
      fail++;
      issues.push(`${file}: Q${q.id} has no hint`);
    }
  }
}

console.log(`gp-hint-count-check: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(fail > 0 ? 1 : 0);
}
console.log(`OK — all ${pass} questions have a hint`);
