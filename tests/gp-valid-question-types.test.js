// gp-valid-question-types.test.js — type field is a known value
// Unknown types cause renderer to display nothing to Kai

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();

const VALID_TYPES = new Set([
  'identify', 'graph', 'multiple-choice', 'word-problem', 'write-equation',
  'exponential', 'quadratic', 'radical', 'rational', 'absolute-value',
  'extraneous', 'fractional-exp', 'error-analysis', 'construct'
]);

let pass = 0;
let fail = 0;
const violations = [];
const foundTypes = new Set();

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const questions = data.questions || [];
  for (const q of questions) {
    if (!q.type) continue;
    foundTypes.add(q.type);
    if (!VALID_TYPES.has(q.type)) {
      fail++;
      violations.push(`${file} Q${q.id || q.number}: unknown type "${q.type}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-valid-question-types: ${pass}/${pass + fail} pass`);
console.log(`Types found: ${[...foundTypes].sort().join(', ')}`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log('OK — all question types are valid');
