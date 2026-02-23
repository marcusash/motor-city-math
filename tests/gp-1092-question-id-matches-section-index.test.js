// gp-1092-question-id-matches-section-index.test.js
// Question ID format: rp{N}-q{M} where M matches 1-based position within exam.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const n = file.match(/retake-practice-(\d+)\.json/)[1];
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (let i = 0; i < data.questions.length; i++) {
    const q = data.questions[i];
    const expected = `rp${n}-q${i + 1}`;
    if (q.id === expected) { pass++; }
    else { fail++; failures.push(`${file}: index ${i} id="${q.id}" (expected "${expected}")`); }
  }
}

console.log(`gp-1092-question-id-matches-section-index: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} question IDs match their positional index`);
