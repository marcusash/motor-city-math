// gp-all-questions-have-type.test.js — every question has a type field
// Missing type causes the renderer to skip the question entirely

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();

let pass = 0;
let fail = 0;
const violations = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const questions = data.questions || [];
  for (const q of questions) {
    if (!q.type || typeof q.type !== 'string' || q.type.trim().length === 0) {
      fail++;
      violations.push(`${file} Q${q.id || q.number}: missing or empty type field`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-all-questions-have-type: ${pass}/${pass + fail} pass`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log('OK — all questions have a type field');
