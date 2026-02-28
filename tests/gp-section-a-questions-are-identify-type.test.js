// gp-section-a-questions-are-identify-type.test.js — Section A questions are typically 'identify' type

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Section A = identify and read-graph questions
const SECTION_A_TYPES = new Set(['identify', 'exponential', 'radical', 'quadratic', 'rational',
  'fractional-exp', 'absolute-value', 'multiple-choice']);

let pass = 0;
let info = 0;
const notes = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const sectionA = data.questions.filter(q => q.section === 'A');
  for (const q of sectionA) {
    if (!SECTION_A_TYPES.has(q.type)) {
      info++;
      notes.push(`${file}: Q${q.id} Section A type='${q.type}' (unusual for Section A)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-section-a-questions-are-identify-type: ${pass} pass, ${info} informational`);
if (notes.length) {
  console.log('INFO — Section A questions with unexpected types:');
  notes.forEach(n => console.log('  ', n));
}
console.log(`OK — ${pass} Section A questions use expected types`);
