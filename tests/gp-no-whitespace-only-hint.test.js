// gp-no-whitespace-only-hint.test.js — hint must not be blank or whitespace only

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
    if (hint === null || hint === undefined) {
      fail++;
      issues.push(`${file}: Q${q.id} hint is null/undefined`);
    } else if (typeof hint === 'string' && hint.trim().length === 0) {
      fail++;
      issues.push(`${file}: Q${q.id} hint is empty or whitespace only`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-no-whitespace-only-hint: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} hints have real content`);
