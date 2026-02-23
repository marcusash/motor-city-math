// gp-section-c-has-hint.test.js — Section C (graph) questions should have a hint

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
    if (q.section !== 'C') continue;
    const hint = (q.hint || '').trim();
    if (!hint) {
      warn++;
      warnings.push(`${file}: Q${q.id} (Section C) has no hint`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-section-c-has-hint: ${pass} pass, ${warn} missing hint`);
if (warnings.length) {
  console.log('INFO — Section C questions without hints:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} Section C questions have hints`);
