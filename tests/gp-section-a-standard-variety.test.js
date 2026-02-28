// gp-section-a-standard-variety.test.js — Section A should cover at least 2 different standards

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
  const sectionA = data.questions.filter(q => q.section === 'A');
  const standards = new Set(sectionA.map(q => q.standard).filter(Boolean));
  
  if (standards.size < 2) {
    warn++;
    warnings.push(`${file}: Section A has only ${standards.size} distinct standard(s): ${[...standards].join(',')}`);
  } else {
    pass++;
  }
}

console.log(`gp-section-a-standard-variety: ${pass} pass, ${warn} limited variety`);
if (warnings.length) {
  console.log('INFO — Section A with limited standard variety:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have Section A with >= 2 standards`);
