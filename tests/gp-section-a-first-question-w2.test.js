// gp-section-a-first-question-w2.test.js — the very first question in each exam should be W2 standard

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
  const q1 = data.questions[0];
  if (!q1) { warn++; warnings.push(`${file}: no first question`); continue; }
  if (!q1.standard || !q1.standard.startsWith('W2')) {
    warn++;
    warnings.push(`${file}: first question has standard="${q1.standard}" (not W2)`);
  } else {
    pass++;
  }
}

console.log(`gp-section-a-first-question-w2: ${pass} pass, ${warn} not-W2`);
if (warnings.length) {
  console.log('INFO — exams whose first question is not W2:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams start with a W2 question`);
