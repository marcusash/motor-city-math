// gp-all-inputs-have-id-and-type.test.js — every input must have both id AND type fields

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
    for (const input of (q.inputs || [])) {
      const hasId = input.id && String(input.id).trim() !== '';
      const hasType = input.type && String(input.type).trim() !== '';
      if (!hasId || !hasType) {
        fail++;
        const missing = [!hasId && 'id', !hasType && 'type'].filter(Boolean).join(', ');
        failures.push(`${file}: Q${q.id} input missing: ${missing}`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-all-inputs-have-id-and-type: ${pass} pass, ${fail} missing fields`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} inputs have both id and type`);
