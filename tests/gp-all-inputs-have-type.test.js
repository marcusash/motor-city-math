// gp-all-inputs-have-type.test.js — every input must have a type field

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const VALID_TYPES = new Set(['text', 'dropdown', 'multiple_choice', 'number', 'expression']);

const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (!inp.type) {
        fail++;
        issues.push(`${file}: Q${q.id} input '${inp.id}' missing type field`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-all-inputs-have-type: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} inputs all have type fields`);
