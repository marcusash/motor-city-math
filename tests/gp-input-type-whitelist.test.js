// gp-input-type-whitelist.test.js — all input types must be from the approved set

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Approved input types
const VALID_INPUT_TYPES = new Set(['text', 'number', 'radio', 'multiple-choice', 'select', 'dropdown', 'textarea']);

let pass = 0;
let fail = 0;
const seenTypes = new Set();
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      const t = inp.type;
      seenTypes.add(t);
      if (!t) {
        fail++;
        issues.push(`${file}: Q${q.id} input '${inp.id}' has no type field`);
      } else if (VALID_INPUT_TYPES.has(t)) {
        pass++;
      } else {
        fail++;
        issues.push(`${file}: Q${q.id} input '${inp.id}' has unknown type '${t}'`);
      }
    }
  }
}

console.log(`gp-input-type-whitelist: ${pass} pass, ${fail} fail`);
console.log(`Types seen: ${[...seenTypes].sort().join(', ')}`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} inputs use approved types`);
