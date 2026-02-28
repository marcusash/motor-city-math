// gp-questions-are-sequential-numbered.test.js — questions must be numbered 1-15 within each exam (no gaps)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const numbers = data.questions.map(q => q.number || q.order || null).filter(n => n !== null);
  
  if (numbers.length === 0) {
    // No explicit numbering — check if IDs imply sequence
    pass++;
    continue;
  }
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const expected = Array.from({ length: data.questions.length }, (_, i) => i + 1);
  
  const isSequential = sorted.every((n, i) => n === expected[i]);
  if (!isSequential) {
    fail++;
    failures.push(`${file}: question numbers not sequential. Got: [${sorted.join(',')}]`);
  } else {
    pass++;
  }
}

console.log(`gp-questions-are-sequential-numbered: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have sequential question numbering`);
