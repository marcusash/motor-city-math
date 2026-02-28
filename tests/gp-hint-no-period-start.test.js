// gp-hint-no-period-start.test.js — hint should not start with a period (copy-paste artifact)

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
    const hint = (q.hint || '').trim();
    if (hint.startsWith('.') || hint.startsWith(',')) {
      fail++;
      issues.push(`${file}: Q${q.id} hint starts with '${hint[0]}': "${hint.substring(0, 60)}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-hint-no-period-start: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} hints start with appropriate character`);
