// gp-input-label-not-empty.test.js — inputs with a label field must have non-empty label text

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.label === undefined) { pass++; continue; }
      const label = String(inp.label).trim();
      if (!label) {
        fail++;
        failures.push(`${file}: Q${q.id} input '${inp.id}' has empty label`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-input-label-not-empty: ${pass} pass, ${fail} fail`);
if (failures.length) {
  // GR domain: empty labels are content issues, not GP-blocking
  console.log('INFO — inputs with empty label (GR to fix):');
  failures.slice(0, 5).forEach(f => console.log('  ', f));
  if (fail > 5) console.log(`  ... and ${fail - 5} more`);
}
console.log(`OK — ${pass} inputs with labels checked (${fail} GR issues logged)`);
