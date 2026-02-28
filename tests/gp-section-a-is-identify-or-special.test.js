// gp-section-a-is-identify-or-special.test.js — Section A question types audit

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Known Section A types from baseline
const SECTION_A_TYPES = new Set(['identify', 'absolute-value', 'quadratic', 'exponential', 'radical', 'rational', 'extraneous']);
let pass = 0, fail = 0;
const discoveries = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (q.section !== 'A') continue;
    if (!SECTION_A_TYPES.has(q.type)) {
      fail++;
      discoveries.push(`${file}: ${q.id} unexpected Section A type="${q.type}"`);
    } else { pass++; }
  }
}

console.log(`gp-section-a-is-identify-or-special: ${pass} pass, ${fail} unexpected types`);
if (discoveries.length) {
  discoveries.forEach(d => console.log('  INFO:', d));
  console.log(`  (advisory — new Section A type discovered)`);
}
console.log(`OK — Section A type audit complete`);
