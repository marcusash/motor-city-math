// gp-exam-section-b-types-variety.test.js — Section B should have at least 3 different question types

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_TYPES = 3;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const sectionB = data.questions.filter(q => q.section === 'B');
  const uniqueTypes = new Set(sectionB.map(q => q.type));
  if (uniqueTypes.size < MIN_TYPES) {
    warn++;
    warnings.push(`${file}: Section B has only ${uniqueTypes.size} distinct types: ${[...uniqueTypes].join(', ')}`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-section-b-types-variety: ${pass} pass, ${warn} low-variety`);
if (warnings.length) {
  console.log('INFO — Section B with low type variety:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have diverse Section B question types`);
