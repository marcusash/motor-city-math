// gp-1064-text-input-schema.test.js — text inputs must have id and type fields

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
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'text') continue;
      if (typeof inp.id === 'string' && typeof inp.type === 'string') { pass++; }
      else { fail++; failures.push(`${file}: ${q.id} text input missing id or type: ${JSON.stringify(inp)}`); }
    }
  }
}

console.log(`gp-1064-text-input-schema: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} text inputs have id and type fields`);
