// gp-inputs-are-objects.test.js — every entry in inputs[] must be a plain object

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
    for (let i = 0; i < (q.inputs || []).length; i++) {
      const inp = q.inputs[i];
      if (inp && typeof inp === 'object' && !Array.isArray(inp)) { pass++; }
      else { fail++; failures.push(`${file}: ${q.id}.inputs[${i}] is not an object`); }
    }
  }
}

console.log(`gp-inputs-are-objects: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} inputs are plain objects`);
