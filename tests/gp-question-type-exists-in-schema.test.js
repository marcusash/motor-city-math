// gp-question-type-exists-in-schema.test.js — all question types must match the known type list

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// All currently known types in the data
const KNOWN_TYPES = new Set([
  'identify', 'exponential', 'quadratic', 'radical', 'rational',
  'extraneous', 'fractional-exp', 'multiple-choice', 'word-problem',
  'absolute-value', 'write-equation', 'error-analysis', 'construct', 'graph'
]);

let pass = 0;
let warn = 0;
const warnings = [];
const newTypes = new Set();

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!KNOWN_TYPES.has(q.type)) {
      newTypes.add(q.type);
      warn++;
      warnings.push(`${file}: Q${q.id} unknown type='${q.type}'`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-question-type-exists-in-schema: ${pass} pass, ${warn} unknown types`);
if (newTypes.size > 0) {
  console.log(`INFO — new types discovered: ${[...newTypes].join(', ')}`);
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} questions use known types`);
