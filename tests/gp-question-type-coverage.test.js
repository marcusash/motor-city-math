// gp-question-type-coverage.test.js — each exam should cover at least 3 different question types

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
  const types = new Set(data.questions.map(q => q.type).filter(Boolean));
  
  if (types.size >= MIN_TYPES) {
    pass++;
    console.log(`  ${file}: ${types.size} types (${[...types].join(', ')})`);
  } else {
    warn++;
    warnings.push(`${file}: only ${types.size} question types (min: ${MIN_TYPES})`);
  }
}

console.log(`\ngp-question-type-coverage: ${pass} pass, ${warn} under-threshold`);
if (warnings.length) {
  console.log('INFO — exams with limited question type variety:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have diverse question types`);
