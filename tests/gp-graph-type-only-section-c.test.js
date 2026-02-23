// gp-graph-type-only-section-c.test.js — "graph" type questions should only appear in Section C

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
    if (q.type !== 'graph') continue;
    if (q.section !== 'C') {
      fail++;
      failures.push(`${file}: ${q.id} is type "graph" but in Section ${q.section} (expected C)`);
    } else { pass++; }
  }
}

console.log(`gp-graph-type-only-section-c: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} "graph" type questions are in Section C`);
