// gp-no-section-e-or-f.test.js — no question should have section E or F (only A/B/C/D valid)

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
    if (!VALID_SECTIONS.has(q.section)) {
      fail++;
      failures.push(`${file}: Q${q.id} has invalid section="${q.section}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-no-section-e-or-f: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} questions have valid sections (A/B/C/D only)`);
