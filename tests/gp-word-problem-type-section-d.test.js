// gp-word-problem-type-section-d.test.js — "word-problem" type questions should be in Section D

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
    if (q.type !== 'word-problem') continue;
    if (q.section !== 'D') {
      fail++;
      failures.push(`${file}: ${q.id} is type "word-problem" in Section ${q.section} (expected D)`);
    } else { pass++; }
  }
}

console.log(`gp-word-problem-type-section-d: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} "word-problem" type questions are in Section D`);
