// gp-no-script-tags-in-hints.test.js — hints must not contain script tags

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
    const h = (q.hint || '').toLowerCase();
    if (h.includes('<script')) {
      fail++;
      failures.push(`${file}: ${q.id} hint contains script tag`);
    } else { pass++; }
  }
}

console.log(`gp-no-script-tags-in-hints: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} hints are free of script tags`);
