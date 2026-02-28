// gp-input-type-known-values.test.js — input type must be one of: number, text, dropdown, radio

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const VALID_TYPES = new Set(['number', 'text', 'dropdown', 'radio']);
let pass = 0, fail = 0;
const failures = [];
const seen = new Set();

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!Array.isArray(q.inputs)) continue;
    for (const inp of q.inputs) {
      seen.add(inp.type);
      if (!VALID_TYPES.has(inp.type)) {
        fail++;
        failures.push(`${file}: ${q.id} input "${inp.id}" has unknown type="${inp.type}"`);
      } else { pass++; }
    }
  }
}

console.log(`gp-input-type-known-values: ${pass} pass, ${fail} fail`);
console.log(`  Types found: ${[...seen].sort().join(', ')}`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} inputs have valid types`);
