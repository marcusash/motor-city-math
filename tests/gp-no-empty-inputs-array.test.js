// gp-no-empty-inputs-array.test.js — the inputs array for each question should not be empty (use absent, not [])

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.hasOwnProperty('inputs')) { pass++; continue; }
    if (Array.isArray(q.inputs) && q.inputs.length === 0) {
      warn++;
      warnings.push(`${file}: Q${q.id} has inputs=[] (empty array; omit field instead)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-no-empty-inputs-array: ${pass} pass, ${warn} empty`);
if (warnings.length) {
  console.log('INFO — questions with empty inputs array (schema cleanliness):');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} questions have non-empty inputs or no inputs field`);
