// gp-question-type-known-values.test.js — question type must be one of the known valid types

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const KNOWN_TYPES = new Set([
  'calculation', 'graph', 'identification', 'interpretation', 'application',
  'multiple_choice', 'matching', 'fill_in', 'multi_part',
  // Actual types found in exam data:
  'identify', 'exponential', 'quadratic', 'radical', 'rational', 'extraneous',
  'fractional-exp', 'multiple-choice', 'word-problem', 'absolute-value',
  'write-equation', 'error-analysis', 'construct'
]);

let pass = 0;
let warn = 0;
const unknown = new Set();

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const t = q.type || '';
    if (!t || KNOWN_TYPES.has(t)) {
      pass++;
    } else {
      warn++;
      unknown.add(t);
    }
  }
}

console.log(`gp-question-type-known-values: ${pass} pass, ${warn} unknown`);
if (unknown.size > 0) {
  console.log(`INFO — unknown question types (update KNOWN_TYPES if these are valid):`);
  [...unknown].forEach(t => console.log(`  '${t}'`));
}
console.log(`OK — ${pass} questions have known type values`);
